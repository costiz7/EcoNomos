import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from "./Home/Home.jsx"
import ProtectedRoute from "./ProtectedRoute.jsx"
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ < Home/> } />

          <Route element={ <ProtectedRoute/> }>
          
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
