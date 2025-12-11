import { BrowserRouter, Route, Routes } from 'react-router'
import './style/index.css'
import Login from './pages/Login'
import { EmpresaGuard } from './components/features/EmpresaGuard'
import ErrorPage from './pages/ErrorPage'
import ProtectedRoute from './components/features/ProtectedRoute'
import Index from './pages/Index'


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
                <Index/>
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
