
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import SignUp from './pages/FacultySignup'
import Signin from './pages/FacultySignin'
import AdminSignUp from './pages/AdminSignup'
import AdminSignin from './pages/AdminSignin'

function App() {
 

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div>
            HI there
          </div>
        } />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin/signup" element={<AdminSignUp />} />
        <Route path="/admin/signin" element={<AdminSignin />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </BrowserRouter>
    </>
  ) 
}

export default App
