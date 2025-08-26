import { useState, useEffect } from "react"
import { type Extension } from "./types/extension"
import ExtensionCard from "./components/ExtensionCard"
import darkIcon from "/assets/images/icon-moon.svg"
import lightIcon from "/assets/images/icon-sun.svg"
import { supabase } from "./supabaseClient"
import AddExtensionForm from "./components/AddExtension"
import {Toaster} from "react-hot-toast"

type FilterType = "all" | "active" | "inactive"

function App() {
  const [extension, setExtension] = useState<Extension[]>([])
  const [filter, setFilter] = useState<FilterType>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("darkMode");
    return saved !== null ? JSON.parse(saved) : true;
  })
  const [showAddForm, setShowAddForm] = useState<boolean>(false)

  useEffect(() => {
    const fetchExtensions = async () => {
      const { data, error } = await supabase
        .from('extensions')
        .select('*')
      if (error) {
        console.log(error)
      } else {
        setExtension(data)
      }
    }
    fetchExtensions()
  }, [])

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));

    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [darkMode])

  const toggleExtension = async (id: string, isActive: boolean) => {
    const { data, error } = await supabase
      .from('extensions')
      .update({ isActive: !isActive })
      .eq('id', id)
      .select()
    if (!error && data) {
      setExtension(prev =>
        prev.map(ext => ext.id === id ? data[0] : ext)
      )
    }
  }

  const removeExtension = async (id: string) => {
    const { error } = await supabase
      .from('extensions')
      .delete()
      .eq('id', id)
    if (!error) {
      setExtension(prev => prev.filter(ext => ext.id !== id))
    }
  }

  const handleExtensionAdded = (newExtension: Extension) => {
    setExtension(prev => [...prev, newExtension])
    setShowAddForm(false)
  }

  const filteredExtensions = extension.filter(ext => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && ext.isActive) ||
      (filter === "inactive" && !ext.isActive);

    const matchesSearch =
      ext.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ext.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <div className="w-full px-4 md:max-w-6xl md:mx-auto md:px-6 py-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center md:mb-10 mb-7 gap-5">

          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Extensions</h1>
          </div>

          <input
            type="text"
            placeholder="Search extensions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-black dark:text-white w-full md:w-1/3"
          />

          <button
            onClick={() => setDarkMode(prev => !prev)}
            className=" bg-gray-300 dark:bg-gray-700 text-black p-2 rounded-full self-end absolute top-6 md:self-auto md:static cursor-pointer"
            title="Toggle light/dark mode "
          >
            <img
              src={darkMode ? lightIcon : darkIcon}
              alt={darkMode ? "Light mode" : "Dark mode"}
              className="w-5 h-5"
            />
          </button>
        </div>


        {/* Filtered Buttons */}
        <div className="flex justify-center md:justify-start gap-3 mb-8">
          {(["all", "active", "inactive"] as FilterType[]).map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded-full text-center cursor-pointer text-sm transition ${filter === type
                ? "bg-red-500 text-white"
                : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}

          <button
            onClick={() => setShowAddForm(true)}
            className={`px-3 py-1 rounded-full cursor-pointer text-sm transition ${showAddForm
                ? "bg-red-500 text-white"
                : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-black dark:text-white"
              }`}
          >
            <span className="hidden md:block">Add Extensions</span> <span className="md:hidden">Add Ext</span>
          </button>
        </div>

        {/* Extension Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {filteredExtensions.map(ext => (
            <ExtensionCard
              key={ext.id}
              extension={ext}
              onToggle={() => toggleExtension(ext.id, ext.isActive)}
              onRemove={() => removeExtension(ext.id)}
            />
          ))}
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-2">
          <AddExtensionForm
            onAdded={handleExtensionAdded}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}
      <Toaster />
    </div>
  )
}

export default App
