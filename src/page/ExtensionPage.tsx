import { useState } from "react"
import ExtensionCard from "../components/ExtensionCard"
import ExtensionHeader from "../components/ExtensionHeader"
import FilteredButton from "../components/FilteredButtons"
import type { FilterType } from "../types/extension"
import { type Extension } from "../types/extension"

const ExtensionPage = ({
  extension,
  setExtension,
  showAddForm,
  setShowAddForm,
}: any) => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filter, setFilter] = useState<FilterType>("all")

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
            setExtension={setExtension}
          />
        ))}
      </div>
    </div>
  )
}

export default ExtensionPage