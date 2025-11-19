import React from 'react'
import { useAuth } from './AuthProvider'

function Auth() {
  const { authenticated, profile, login, logout, refresh } = useAuth()

  return (
    <div>
      {authenticated ? (
        <div className="flex items-center space-x-4">
          <div>
            <div className="font-medium">Signed in as:</div>
            <div className="text-sm">{profile?.preferred_username || profile?.email || 'Unknown'}</div>
          </div>
          <button
            onClick={refresh}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none"
          >
            Refresh Token
          </button>
          <button
            onClick={logout}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none"
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={login}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
          >
            Login with Keycloak
          </button>
        </div>
      )}
    </div>
  )
}

export default Auth
