import { useState, useEffect } from "react"
import { type Extension } from "./types/extension"
import ExtensionCard from "./components/ExtensionCard"
import { supabase } from "./supabaseClient"
import AddExtensionForm from "./components/AddExtension"
import { Toaster } from "react-hot-toast"
import FilteredButton from "./components/FilteredButtons"
import { type FilterType } from "./types/extension"
import ExtensionHeader from "./components/ExtensionHeader"


function App() {
  const [extension, setExtension] = useState<Extension[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filter, setFilter] = useState<FilterType>("all")
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
        <ExtensionHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />


        {/* Filtered Buttons */}
        <FilteredButton
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
          filter={filter}
          setFilter={setFilter}
        />

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

      {/* Extension Form */}
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
