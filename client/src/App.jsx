import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from "./Home/Home.jsx"
import ProtectedRoute from "./ProtectedRoute.jsx";
import MainLayout from "./MainLayout/MainLayout.jsx";
import DashboardContent from "./DashboardContent/DashboardContent.jsx";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ < Home/> } />

          <Route element={ <ProtectedRoute/> }>
            <Route element={ <MainLayout /> }>
              <Route path="/dashboard" element={ <DashboardContent /> }/>
              <Route path="/transactions" element=""/>
              <Route path="/statistics" element=""/>
              <Route path="/savings" element=""/>
              <Route path="/budgets" element="" />
              <Route path="/myprofile" element=""/>
              <Route path="/settings" element=""/>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
