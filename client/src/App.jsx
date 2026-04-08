import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from "./Home/Home.jsx"
import ProtectedRoute from "./ProtectedRoute.jsx";
import MainLayout from "./MainLayout/MainLayout.jsx";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ < Home/> } />

          <Route element={ <ProtectedRoute/> }>
            <Route element={ <MainLayout /> }>
              <Route path="/dashboard" element=""/>
              <Route path="/savings" element="" />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
