import "@supernova/ui/styles/globals.css"

import TodayTasksPage from './pages/TodayTasksPage'
import LoginOrSignupPage from './pages/LoginOrSignup'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/Register'

const router = createBrowserRouter([
  { path: '/login', element: <LoginOrSignupPage /> },
  { path: '/today', element: <TodayTasksPage /> },
  { path: '/', element: <HomePage /> },
  { path: '/register', element: <RegisterPage /> }
])

export const App = () => {
  return <RouterProvider router={router} />
}

export default App
