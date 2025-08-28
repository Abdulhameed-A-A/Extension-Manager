import { useState } from "react"
import ExtensionCard from "../components/ExtensionCard"
import ExtensionHeader from "../components/ExtensionHeader"
import FilteredButton from "../components/FilteredButtons"
import type { FilterType } from "../types/extension"
import { type Extension } from "../types/extension"
import { supabase } from "../services/supabaseClient"

const ExtensionPage = ({
  extension,
  setExtension,
  showAddForm,
  setShowAddForm,
}: any) => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filter, setFilter] = useState<FilterType>("all")

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

  const filteredExtensions = extension.filter((ext: Extension) => {
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
    <div className="w-full px-4 md:max-w-6xl md:mx-auto md:px-6 py-6">

      {/* Header */}
      <ExtensionHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
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
        {filteredExtensions.map((ext: Extension) => (
          <ExtensionCard
            key={ext.id}
            extension={ext}
            onToggle={() => toggleExtension(ext.id, ext.isActive)}
            onRemove={() => removeExtension(ext.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default ExtensionPage