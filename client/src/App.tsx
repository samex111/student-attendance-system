
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Signin from './pages/FacultySignin'
import AdminSignUp from './pages/AdminSignup'
import AdminSignin from './pages/AdminSignin'
import FacultyDashboard from './pages/FacultyDashboard'
import AddFaculty from './customComponent/AddFAculty'
import { AddStudent } from './customComponent/AddStudent'
import DashboardOverview from './customComponent/DashboardOverview'
import AdminLayout from './layout/applayout'
import BranchAttendance from './customComponent/GetAttendance'
import AddSubjectForm from './customComponent/AddSubjectForm'
import { LandingPage } from './pages/AdminDashboard'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/faculty/signin" element={<Signin />} />
        
        {/* Admin Auth Routes */}
        <Route path="/admin/signin" element={<AdminSignin />} />
        <Route path="/admin/signup" element={<AdminSignUp />} />

        {/* Faculty Routes */}
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />

        {/* Protected Admin Dashboard Routes (Wrapped in Layout) */}
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminLayout>
              <DashboardOverview />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/dashboard/add/student" 
          element={
            <AdminLayout>
              <AddStudent />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/dashboard/add/faculty" 
          element={
            <AdminLayout>
              <AddFaculty />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/dashboard/settings" 
          element={
            <AdminLayout>
              <div className="flex items-center justify-center h-full text-zinc-400">Settings Page Placeholder</div>
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/dashboard/attendance" 
          element={
            <AdminLayout>
             <BranchAttendance/>
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/dashboard/add/subject" 
          element={
            <AdminLayout>
             <AddSubjectForm/>
            </AdminLayout>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;