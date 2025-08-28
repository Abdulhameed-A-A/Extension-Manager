import { Toaster } from "react-hot-toast"
import MainComponent from "./page/MainComponent"

const App = () => {
 
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      
      {/* Main component */}
      <MainComponent />

      {/* Toaster Notification */}
      <Toaster />
    </div>
  )
}

export default App
