
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import SignUp from './pages/FacultySignup'

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
      
      </Routes>
    </BrowserRouter>
    </>
  ) 
}

export default App
