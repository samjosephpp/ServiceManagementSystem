import { useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { AuthContext, AuthProvider } from './context/authContext'

function App() {

  return (
    
    <AuthProvider>
      <RouterProvider router={router}>  </RouterProvider>
    </AuthProvider>

  )
}

export default App
