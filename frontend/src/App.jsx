import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Books from './pages/Home'
import Login from './pages/AuthPages/LoginForm'
import Register from './pages/AuthPages/RegisterForm'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import MyRequests from './pages/RequestPages/MyRequests'
import BookPage from './pages/BooksPages/BookPage'
import RequestPage from './pages/RequestPages/RequestPage'
import RequestsCopies from './pages/RequestPages/RequestsCopies'
import Layout from './components/GlobalLayout'

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
          <Route element={<Layout />}>
          <Route path="/" element={<Books />} />
          
          <Route path="/books/:id" element={<BookPage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/my-requests" element={
            <ProtectedRoute allowedRoles={['usuario']}>
              <MyRequests />
            </ProtectedRoute>}/>
          <Route path="/requests" element={
            <ProtectedRoute allowedRoles={['bibliotecario']}>
              <RequestPage />
            </ProtectedRoute>}/>
          <Route path="/requests-copies" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <RequestsCopies />
              </ProtectedRoute>}/>
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterLogout />} /> 
        </Routes>
        
      </Router>
    </>
  )
}

export default App
