import React from 'react'
import { useAuth } from '../AuthProvider'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import {Footer} from "../components/Footer.jsx";

const LandingPage = () => {
  const { authenticated, login } = useAuth()
  const navigate = useNavigate()

  // If already authenticated, redirect to app
  useEffect(() => {
    if (authenticated) {
      navigate('/app', { replace: true })
    }
  }, [authenticated, navigate])

  return (
      <div className="flex flex-col overflow-hidden h-screen" style={{backgroundColor: '#037EF3' }}>
      {/* Header */}
      <div className="flex justify-center items-center px-6 py-4 md:py-6">
        <img
          src="/White-Blue-Logo.png"
          alt="AIESEC Logo"
          className="h-10 w-auto"
        />
      </div>

      {/* Hero Section - Centered and Fitting Screen */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-2xl">
          {/* AIESEC Logo/Image */}
          <div className="mb-4 md:mb-6">
            <img
              src="/AIESEC-Human-Blue.png"
              alt="AIESEC Human Blue"
              className="h-24 md:h-40 mx-auto"
            />
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
            EXPA Mobile
          </h1>

          {/* Subheading */}
          <p className="text-base md:text-lg text-white text-opacity-90 mb-6 md:mb-8">
            Manage applications, track opportunities, and coordinate with your team. Sign in to get started.
          </p>

          {/* Login Button */}
          <button
            onClick={login}
            className="px-6 md:px-8 py-3 md:py-4 bg-white text-blue-600 font-bold text-base md:text-lg rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Sign In with AIESEC
          </button>
        </div>
          {/* Footer */}
          <Footer></Footer>
      </div>
    </div>
  )
}

export default LandingPage

