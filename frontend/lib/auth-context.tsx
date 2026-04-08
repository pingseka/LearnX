'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getProfile, removeToken, getToken, type UserProfile } from '@/api/auth'

interface AuthContextType {
  user: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  logout: () => {},
  refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const token = getToken()
      if (!token) {
        setUser(null)
        setIsLoading(false)
        return
      }
      const profile = await getProfile()
      setUser(profile)
    } catch {
      setUser(null)
      removeToken()
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const logout = () => {
    removeToken()
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
