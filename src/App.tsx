import { useState, useEffect } from "react"
import { supabase } from "./services/supabaseClient"
import { Toaster } from "react-hot-toast"
import AddExtensionForm from "./components/AddExtension"
import ExtensionPage from "./page/ExtensionPage"
import { type Extension } from "./types/extension"

const App = () => {
  const [extension, setExtension] = useState<Extension[]>([])
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

  const handleExtensionAdded = (newExtension: Extension) => {
    setExtension(prev => [...prev, newExtension])
    setShowAddForm(false)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      
      {/* Extension Page */}
      <ExtensionPage
        extension={extension}
        setExtension={setExtension}
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
      />

      {/* Extension Form */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-2">
          <AddExtensionForm
            onAdded={handleExtensionAdded}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Toaster Notification */}
      <Toaster />
    </div>
  )
}

export default App
