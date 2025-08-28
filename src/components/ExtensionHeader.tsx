import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import darkIcon from "/assets/images/icon-moon.svg"
import lightIcon from "/assets/images/icon-sun.svg"

interface ExtensionHeaderPropsType {
  searchTerm: string,
  setSearchTerm: Dispatch<SetStateAction<string>>
}

const ExtensionHeader = ({ searchTerm, setSearchTerm }: ExtensionHeaderPropsType) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("darkMode");
    return saved !== null ? JSON.parse(saved) : true;
  })

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));

    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [darkMode])

  return (
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
        onClick={() => setDarkMode((prev: boolean) => !prev)}
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
  )
}

export default ExtensionHeader