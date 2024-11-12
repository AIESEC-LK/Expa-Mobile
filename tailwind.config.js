/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        status: {
          open: {
            light: '#EBF8FF',  // blue-100
            DEFAULT: '#2B6CB0', // blue-700
          },
          accept: {
            light: '#F0FFF4',  // green-100
            DEFAULT: '#38A169', // green-700
          },
          reject: {
            light: '#FFF5F5',  // red-100
            DEFAULT: '#C53030', // red-700
          },
          approvedByHome: {
            light: '#FEFCBF',  // yellow-100
            DEFAULT: '#D69E2E', // yellow-700
          },
          approved: {
            light: '#C6F6D5',  // green-200
            DEFAULT: '#2F855A', // green-800
          },
          realized: {
            light: '#FAF5FF',  // purple-100
            DEFAULT: '#6B46C1', // purple-700
          },
          matched: {
            light: '#EBF4FF',  // indigo-100
            DEFAULT: '#5A67D8', // indigo-700
          },
          withdrawn: {
            light: '#F7FAFC',  // gray-100
            DEFAULT: '#4A5568', // gray-700
          },
          finished: {
            light: '#EDF2F7',  // gray-200
            DEFAULT: '#2D3748', // gray-800
          },
          approvalBroken: {
            light: '#FED7D7',  // red-200
            DEFAULT: '#742A2A', // red-800
          },
          realizationBroken: {
            light: '#FED7D7',  // red-200
            DEFAULT: '#742A2A', // red-800
          },
          completed: {
            light: '#EDF2F7',  // gray-200
            DEFAULT: '#2D3748', // gray-800
          }
        }
      }
    }
  },
  plugins: [],
}

