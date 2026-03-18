import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from "./Home/Home.jsx"
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ < Home/> } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
