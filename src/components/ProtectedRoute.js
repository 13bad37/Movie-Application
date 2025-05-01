import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'

export default function ProtectedRoute({ children }) {
  const user = useAuthStore(s => s.user)
  const loc  = useLocation()

  if (!user) {
    toast.error('Please register or log in to view this content')
    return <Navigate to="/register" state={{ from: loc }} replace />
  }

  return children
}
