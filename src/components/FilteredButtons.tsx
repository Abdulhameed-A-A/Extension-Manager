import type { Dispatch, SetStateAction } from "react"
import { type FilterType } from "../types/extension"

interface FilteredButtonPropsType {
  filter: FilterType,
  setFilter: Dispatch<SetStateAction<FilterType>>,
  showAddForm: boolean,
  setShowAddForm: Dispatch<SetStateAction<boolean>>
}

const FilteredButton = ({ filter, setFilter, showAddForm, setShowAddForm }: FilteredButtonPropsType) => {
  return (
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
  )
}

export default FilteredButton

