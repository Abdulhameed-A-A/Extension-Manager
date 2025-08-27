import { type Extension } from "../types/extension";

interface Props {
  extension: Extension;
  onToggle: () => void;
  onRemove: () => void;
}

const ExtensionCard = ({ extension, onToggle, onRemove }: Props) => {

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
          onClick={onRemove}
          className="px-3 py-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-sm rounded-md transition cursor-pointer"
        >
          Remove
        </button>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={extension.isActive}
            onChange={onToggle}
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
