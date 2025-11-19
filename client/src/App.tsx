import LightStarsLogo from '/logo.svg'
import './App.css'

function App() {
  return (
    <>
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-400 shadow-md rounded-lg p-10">
          <h1 className="text-3xl font-bold text-center">Welcome to LightStars.io <img src={LightStarsLogo} className="w-8 h-8 inline-block" alt="LightStars logo" /></h1>
        </div>
      </div>
    </>
  )
}

export default App
