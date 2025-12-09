import { BrowserRouter, Route, Routes } from 'react-router'
import './style/index.css'
import Login from './pages/Login'
import { EmpresaGuard } from './components/EmpresaGuard'
import ErrorPage from './pages/ErrorPage'
import ProtectedRoute from './components/ProtectedRoute'


function App() {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/:empresa' element={
              <EmpresaGuard>
                <Login/>
              </EmpresaGuard>
              } />
          <Route path='/:empresa/dashboard' element={
            <EmpresaGuard>
              <ProtectedRoute>
                <div>Home Page - Protected</div>
              </ProtectedRoute>
            </EmpresaGuard>
          } />
          <Route path='/404' element={<ErrorPage/>} />
          <Route path='*' element={<ErrorPage/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
