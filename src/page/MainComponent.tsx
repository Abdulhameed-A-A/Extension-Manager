import { useEffect, useState } from "react"
import AddExtensionForm from "../components/AddExtension"
import ExtensionPage from "./ExtensionPage"
import { type Extension } from "../types/extension"
import { supabase } from "../services/supabaseClient"

const MainComponent = () => {
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
    <>
      <ExtensionPage
        extension={extension}
        setExtension={setExtension}
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
      />

      {/* Extension Form */}
      {
        showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-2">
            <AddExtensionForm
              onAdded={handleExtensionAdded}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )
      }
    </>
  )
}


export default MainComponent