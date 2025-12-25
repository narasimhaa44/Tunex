import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/HomePage.jsx'
import CoverPage from './components/CoverPage.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import CreateAlbum from './components/CreateAlbum.jsx'

import { AuthProvider } from './components/AuthContext.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './index.css'
import axios from 'axios';

// 🛑 FORCE UNREGISTER SERVICE WORKER (Fix for lingering PWA)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      console.log('Unregistering SW:', registration);
      registration.unregister();
    }
  });
}

axios.defaults.withCredentials = true;

const router = createBrowserRouter([
  {
    path: '/',
    element: <CoverPage />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },

  // 🔥 PROTECTED ROUTE HERE
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    )
  },
  {
    path: '/create-album',
    element: (
      <ProtectedRoute>
        <CreateAlbum />
      </ProtectedRoute>
    )
  }
])

createRoot(document.getElementById('root')).render(
  <AuthProvider>

    <RouterProvider router={router} />
  </AuthProvider>
)
