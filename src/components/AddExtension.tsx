import { useState, type ChangeEvent } from "react"
import { supabase } from "../supabaseClient"
import { type Extension } from "../types/extension"
import { getPublicUrl, uploadFile } from "../services/uploads"
import toast from 'react-hot-toast'


interface AddExtensionFormProps {
  onAdded: (newExtension: Extension) => void
  onCancel: () => void
}

interface FormData {
  logo?: File,
  logoPreviewUrl?: string,
  name: string,
  description: string,
  isActive: boolean
}

const AddExtensionForm = ({ onAdded, onCancel }: AddExtensionFormProps) => {
  const [form, setForm] = useState<FormData>({
    logoPreviewUrl: "",
    name: "",
    description: "",
    isActive: false
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setForm((prev: FormData) => ({
          ...prev,
          logo: file,
          logoPreviewUrl: URL.createObjectURL(file)
        }));
      }
      return;
    }
    setForm((prev: FormData) => ({
      ...prev,
      [name]: type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : type === "file" ? ("TODO:") : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (!form?.logo) {
        setLoading(false)
        onCancel()
        toast.error("Please select a logo file.")
        return;
      }

      const fileName = `images/${Date.now()}-${form?.logo?.name}`;
      const filePath = await uploadFile(fileName, form.logo, "Images");
      const imageUrl = await getPublicUrl(filePath);
      const { logo, logoPreviewUrl, ...others } = form;
      const payload = { ...others, logo: imageUrl }

      const { data, error } = await supabase
        .from('extensions')
        .insert([payload])
        .select()
      setLoading(false)
      if (!error && data && data[0]) {
        toast.success("Extension created successfully")
        onAdded(data[0])
        setForm({ logoPreviewUrl: '', name: "", description: "", isActive: false })
      } else {
        onCancel()
        toast.error("An error occurred while creating extension.")
      }
    } catch (err) {
      setLoading(false)
      onCancel()
      toast.error("An error occurred while uploading the file.")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 m-5 dark:bg-gray-800 p-6 rounded-3xl  shadow-md max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4">Add New Extension</h2>

      <div className="mb-3">
        <label className="block mb-1 font-semibold">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md bg-gray-200 outline-gray-400 dark:outline-red-500 dark:bg-gray-700 text-black dark:text-white"
          required
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-semibold">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md bg-gray-200 outline-gray-400 dark:outline-black dark:bg-gray-700 scroll-smooth text-black dark:text-white"
          required
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-semibold">Logo URL</label>
        <input
          type="file"
          name="logo"
          onChange={handleChange}
          className="w-full px-3 py-3 text-center rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-white"
          required
        />

        {form?.logoPreviewUrl && <div className="w-full max-h-[300px] mt-3">
          <img src={form.logoPreviewUrl} className="max-w-15 md:max-w-50 md:max-h-50" alt="" />
        </div>}
      </div>

      <div className="mb-4 flex items-center">
        <label htmlFor="isActive" className="font-semibold mr-3">Active</label>
        <input
          type="checkbox"
          name="isActive"
          id="isActive"
          checked={form.isActive}
          onChange={handleChange}
          className="peer sr-only"
        />
        <div
          className={`w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors
            ${form.isActive ? "bg-red-500" : ""}
          `}
          onClick={() =>
            setForm(prev => ({ ...prev, isActive: !prev.isActive }))
          }
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform
              ${form.isActive ? "translate-x-4" : ""}
            `}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-red-500 cursor-pointer text-white rounded-full transition"
        >
          {loading ? "Adding..." : "Add"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition cursor-pointer"
        >
          Cancel
        </button>

      </div>
    </form>
  )
}

export default AddExtensionForm