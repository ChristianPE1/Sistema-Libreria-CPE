
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Books from './pages/Home'
import Login from './pages/AuthPages/LoginForm'
import Register from './pages/AuthPages/RegisterForm'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import MyRequests from './pages/RequestPages/MyRequests'

function Logout () {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterLogout(){
  localStorage.clear()
  return <Register/>
}

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Books />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterLogout />} /> 
          <Route path="*" element={<NotFound />} />
          <Route path="/my-requests" element={
            <ProtectedRoute allowedRoles={['usuario']}>
              <MyRequests />
            </ProtectedRoute>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
