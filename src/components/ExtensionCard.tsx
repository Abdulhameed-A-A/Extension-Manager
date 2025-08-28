import type { Dispatch, SetStateAction } from "react";
import { supabase } from "../services/supabaseClient";
import { type Extension } from "../types/extension";

interface ExtensionCardProp {
  extension: Extension;
  setExtension: Dispatch<SetStateAction<Extension[]>>
}

const ExtensionCard = ({ extension, setExtension }: ExtensionCardProp) => {

  const toggleExtension = async (id: string, isActive: boolean) => {
    const { data, error } = await supabase
      .from('extensions')
      .update({ isActive: !isActive })
      .eq('id', id)
      .select()
    if (!error && data) {
      setExtension((prev: Extension[]) =>
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
      setExtension((prev: Extension[]) => prev.filter(ext => ext.id !== id))
    }
  }

  return (
    <div className="flex flex-col justify-between rounded-xl p-4 hover:shadow-sm bg-gray-100 shadow-md dark:bg-gray-800 transition-colors duration-300">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-md flex items-center justify-center bg-gray-300 dark:bg-gray-700">
          <img
            src={extension.logo}
            alt={`icon`}
            className="w-5 h-5 max-w-5 max-h-5 md:max-w-12 md:max-h-12 md:w-10 md:h-10 rounded-md object-cover"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold">{extension.name}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {extension.description}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => removeExtension(extension.id)}
          className="px-3 py-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-sm rounded-md transition cursor-pointer"
        >
          Remove
        </button>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={extension.isActive}
            onChange={() => toggleExtension(extension.id, extension.isActive)}
            className="sr-only peer pointer-events-auto"
          />
          <div className="w-10 h-6 bg-gray-300 rounded-full peer-checked:bg-red-500 transition-colors duration-300"></div>
          <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-4"></span>
        </label>
      </div>
    </div>
  );
};

export default ExtensionCard;
