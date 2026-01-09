# EXPA Mobile

A Progressive Web Application (PWA) for managing AIESEC applications and opportunities. This mobile-responsive application provides a streamlined interface for managing ICX (Incoming Exchange) and OGX (Outgoing Exchange) applications, built with React, Vite, and modern web technologies.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Key Components](#key-components)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [PWA Features](#pwa-features)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Additional Documentation](#additional-documentation)

## 🎯 Overview

EXPA Mobile is a mobile-first Progressive Web Application designed to help AIESEC members manage applications for exchange opportunities. The application supports two main flows:

- **ICX (Incoming Exchange)**: Managing applications from international participants for local opportunities
- **OGX (Outgoing Exchange)**: Managing applications from local participants for international opportunities

The application provides features for viewing, filtering, searching, and managing application statuses with a focus on mobile usability and offline capabilities.

## ✨ Features

### Core Functionality
- **Application Management**: View and manage applications for opportunities you manage
- **Status Management**: Change application statuses (Accept, Reject, Approve, etc.) with proper workflow validation
- **Search & Filter**: Search applications by applicant name and filter by multiple statuses
- **Pagination**: Efficient pagination with 30 items per page
- **CV Download**: Download applicant CVs directly from the application
- **Multi-Flow Support**: Separate interfaces for ICX and OGX applications

### User Experience
- **Mobile-First Design**: Responsive layout optimized for mobile devices
- **Progressive Web App**: Installable on mobile devices with offline support
- **Real-time Updates**: Automatic service worker updates for new versions
- **Status Color Coding**: Visual status indicators with color-coded badges
- **Rejection Reasons**: Structured rejection reason selection for rejected applications

### Technical Features
- **Keycloak Authentication**: Secure authentication with token management
- **GraphQL API**: Efficient data fetching with GraphQL queries and mutations
- **Offline Support**: Service worker caching for offline functionality
- **Auto-update**: Automatic PWA updates with user prompts

## 🛠 Technology Stack

### Core Framework
- **React 18.3.1**: Modern React with hooks and functional components
- **Vite 5.4.10**: Fast build tool and development server
- **React Router DOM 6.28.0**: Client-side routing

### Styling
- **Tailwind CSS 3.4.14**: Utility-first CSS framework
- **PostCSS**: CSS processing
- **Autoprefixer**: Automatic vendor prefixing

### Authentication & API
- **Keycloak JS 26.2.1**: Authentication and authorization
- **GraphQL**: API communication (via fetch)
- **graphql-tag 2.12.6**: GraphQL query parsing

### PWA & Build Tools
- **Vite PWA Plugin 0.20.0**: Progressive Web App support
- **Workbox**: Service worker and caching strategies

### UI Components
- **Headless UI 2.2.0**: Accessible UI components
- **Heroicons 2.1.5**: Icon library

### Development Tools
- **ESLint 9.13.0**: Code linting
- **TypeScript Types**: Type definitions for React

## 🏗 Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser/Device                        │
├─────────────────────────────────────────────────────────┤
│  React Application (PWA)                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Routing    │  │  Auth Context│  │  Components  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Pages      │  │  API Layer  │  │  PWA Service │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐
│  Keycloak Auth  │  │  GraphQL API    │  │  Service     │
│  Server         │  │  (EXPA Backend) │  │  Worker      │
└─────────────────┘  └─────────────────┘  └──────────────┘
```

### Application Flow

1. **Initialization**: Keycloak authentication is initialized on app load
2. **Authentication**: User authenticates via Keycloak, tokens are stored in localStorage
3. **Route Protection**: Protected routes check authentication status
4. **Data Fetching**: GraphQL queries fetch application data with authentication tokens
5. **State Management**: React hooks manage component state
6. **PWA Updates**: Service worker handles caching and updates

## 📁 Project Structure

```
expa-mobile/
├── public/                          # Static assets
│   ├── AIESEC-Human-Blue.png       # App icons
│   ├── White-Blue-Logo.png
│   ├── Error.jpg                   # Error state image
│   ├── silent-check-sso.html       # Keycloak SSO check
│   └── sw.js                        # Service worker
│
├── src/
│   ├── api/                        # API layer
│   │   ├── graphql.js              # GraphQL helper function
│   │   ├── ApplicationMutations.jsx # Status change mutations
│   │   ├── ApplicationIndexQuery_GetTheAllTheApplicationsManageByUser.jsx
│   │   ├── CurrentPersonQuery.jsx
│   │   ├── DownloadCV.jsx
│   │   ├── GetApplicationByID.jsx
│   │   ├── GetApplicationFromEPid.jsx
│   │   ├── fetchManagerSearch.jsx
│   │   ├── ogxQueries.jsx
│   │   └── UpdatePerson.jsx
│   │
│   ├── components/                 # Reusable components
│   │   ├── ApplicationCard.jsx    # ICX application card
│   │   ├── OGXApplicationCard.jsx  # OGX application card
│   │   ├── OGXApplications.jsx
│   │   ├── Navbar.jsx              # Navigation bar
│   │   ├── Footer.jsx               # Footer component
│   │   ├── PaginationControls.jsx  # Pagination UI
│   │   ├── ProjectDetails.jsx
│   │   ├── PWAUpdatePrompt.jsx     # PWA update notification
│   │   ├── StatusChangeDialog.jsx  # Status change modal
│   │   └── StatusDropdown.jsx       # Status selection dropdown
│   │
│   ├── config/                     # Configuration files
│   │   ├── defaultOpportunityApplication.jsx
│   │   ├── pwaConfig.js            # PWA configuration
│   │   └── statusConfig.jsx        # Status definitions and styles
│   │
│   ├── hooks/                       # Custom React hooks
│   │   └── usePWA.js
│   │
│   ├── pages/                      # Page components
│   │   ├── ApplicationsOfOpportunitiesIManage.jsx  # ICX main page
│   │   ├── Home.jsx                # Dashboard/home page
│   │   ├── LandingPage.jsx         # Landing/login page
│   │   ├── Layout.jsx              # Main layout wrapper
│   │   └── OGXPage.jsx             # OGX applications page
│   │
│   ├── App.jsx                     # Main app component with routing
│   ├── AuthProvider.jsx            # Authentication context provider
│   ├── keycloak.js                 # Keycloak initialization
│   ├── main.jsx                    # Application entry point
│   ├── pwaRegister.js              # PWA service worker registration
│   ├── App.css                     # Global styles
│   └── index.css                   # Base styles
│
├── dist/                           # Build output (generated)
├── node_modules/                   # Dependencies
│
├── .github/                        # GitHub workflows
│   └── workflows/
│       └── main_expa-mobile.yml    # CI/CD pipeline
│
├── index.html                      # HTML entry point
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── eslint.config.js                # ESLint configuration
├── package.json                    # Dependencies and scripts
└── README.md                       # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Comes with Node.js
- **Git**: For version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Expa-Mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory (see [Environment Variables](#environment-variables) section)

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in the terminal)

### Build for Production

```bash
npm run build
```

The production build will be generated in the `dist/` directory.

### Preview Production Build

```bash
npm start
```

This serves the production build locally for testing.

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Keycloak Authentication
VITE_KEYCLOAK_URL=https://auth.aiesec.lk
VITE_KEYCLOAK_REALM=your-realm-name
VITE_KEYCLOAK_CLIENT_ID=your-client-id

# GraphQL API
VITE_GIS_API=https://staging-jruby.aiesec.org/graphql
```

### Environment Variable Descriptions

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_KEYCLOAK_URL` | Base URL for Keycloak authentication server | Yes |
| `VITE_KEYCLOAK_REALM` | Keycloak realm name | Yes |
| `VITE_KEYCLOAK_CLIENT_ID` | Keycloak client ID for this application | Yes |
| `VITE_GIS_API` | GraphQL API endpoint URL | Yes |

**Note**: All environment variables must be prefixed with `VITE_` to be accessible in the Vite application.

## 💻 Development

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot module replacement |
| `npm run build` | Build production bundle |
| `npm start` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

### Development Server Configuration

The development server is configured in `vite.config.js` to:
- Listen on all network interfaces (`0.0.0.0`) for mobile device testing
- Use port `5173` by default
- Enable strict port checking

### Code Style

- **ESLint**: Configured with React-specific rules
- **Formatting**: Follow React best practices and functional component patterns
- **Components**: Use functional components with hooks
- **Styling**: Tailwind CSS utility classes

## 🧩 Key Components

### Pages

#### `ApplicationsOfOpportunitiesIManage.jsx`
Main page for managing ICX applications. Features:
- Application list with pagination
- Search by applicant name
- Multi-status filtering
- Status change functionality
- CV download

#### `OGXPage.jsx`
Page for viewing OGX applications. Features:
- List of people managed by the user
- Manager information display
- Contact details

#### `Layout.jsx`
Main layout wrapper that includes:
- Navigation bar
- Footer
- PWA update prompt
- Outlet for child routes

### Components

#### `ApplicationCard.jsx`
Displays individual ICX application with:
- Applicant information (name, LC, MC)
- Opportunity details
- Status badge with color coding
- Status change dropdown
- Rejection reason modal
- CV download button
- Contact information

#### `StatusDropdown.jsx`
Dropdown component for changing application status:
- Context-aware status options based on current status
- Flow-specific options (ICX vs OGX)
- Visual status indicators

#### `PWAUpdatePrompt.jsx`
Component that prompts users when a new PWA version is available.

### Configuration

#### `statusConfig.jsx`
Centralized status configuration:
- Status styles (colors, backgrounds)
- Status labels mapping
- Available status transitions
- Rejection reasons with IDs

#### `pwaConfig.js`
PWA configuration including:
- App metadata
- Icons and screenshots
- Service worker settings
- Caching strategies
- Shortcuts

## 🔌 API Integration

### GraphQL Helper

The application uses a lightweight GraphQL helper (`src/api/graphql.js`) that:
- Handles authentication token injection
- Manages error responses
- Returns only the `data` field from responses

### Key Queries

#### Application Index Query
Fetches paginated list of applications with filtering:
- Supports search by query string
- Status filtering
- Pagination (page, per_page)
- Conditional field inclusion

#### Application Mutations
Status change mutations:
- `matchApplication`: Accept/match an application
- `approveApplication`: Approve an application
- `rejectApplication`: Reject with optional reason
- `UnrejectApplicationMutation`: Reopen a rejected application
- `updateApplication`: Update application fields (e.g., paid status)

### API Endpoints

- **GraphQL API**: Configured via `VITE_GIS_API` environment variable
- **Keycloak**: Configured via `VITE_KEYCLOAK_URL` environment variable

## 🔒 Authentication

### Keycloak Integration

The application uses Keycloak for authentication with the following features:

1. **Initialization**: Keycloak is initialized on app load with `check-sso` mode
2. **Token Management**: 
   - Access tokens stored in localStorage
   - Refresh tokens for automatic token renewal
   - AIESEC access token extracted from Keycloak token
3. **Silent SSO**: Uses silent check-sso for seamless authentication
4. **Token Refresh**: Automatic token refresh before expiration
5. **Logout**: Clears all tokens and redirects to Keycloak logout

### Authentication Flow

```
1. App loads → Initialize Keycloak
2. Check for existing tokens in localStorage
3. If tokens exist → Validate and refresh if needed
4. If no tokens → Redirect to Keycloak login
5. After login → Store tokens and extract AIESEC token
6. Use AIESEC token for GraphQL API requests
```

### AuthProvider Context

The `AuthProvider` component provides:
- `authenticated`: Boolean authentication state
- `profile`: User profile from token
- `login()`: Trigger Keycloak login
- `logout()`: Clear tokens and logout
- `refresh()`: Manually refresh tokens
- `loading`: Loading state during auth check

### Protected Routes

Routes are protected using the `ProtectedRoute` component that:
- Checks authentication status
- Shows loading spinner during auth check
- Redirects to landing page if not authenticated

## 📱 PWA Features

### Progressive Web App Capabilities

1. **Installable**: Can be installed on mobile devices and desktops
2. **Offline Support**: Service worker caches assets and API responses
3. **Auto-update**: Automatically checks for updates and prompts users
4. **App-like Experience**: Standalone display mode without browser UI

### Service Worker

The service worker (`sw.js`) is generated by Vite PWA plugin and provides:
- **Precaching**: Static assets cached on install
- **Runtime Caching**: 
  - GraphQL API responses (NetworkFirst strategy, 24h cache)
  - Keycloak auth responses (NetworkFirst strategy, 1h cache)
- **Update Management**: Automatic updates with user prompts

### PWA Configuration

Configured in `vite.config.js` with:
- App name and description
- Theme colors (AIESEC blue: `#2B6CB0`)
- Icons (192x192, 512x512)
- Shortcuts for quick access to:
  - My Applications (`/app/icx/applications/my-opportunities`)
  - OGX Applications (`/app/ogx`)
- Display mode: `standalone`
- Orientation: `portrait-primary`

### Caching Strategies

- **Static Assets**: Precached on install
- **GraphQL API**: NetworkFirst with 24-hour expiration
- **Auth Endpoints**: NetworkFirst with 1-hour expiration
- **Images**: Cached for 30 days

## 🚢 Deployment

### Build Process

1. **Install dependencies**: `npm install`
2. **Build**: `npm run build`
3. **Output**: Production files in `dist/` directory

### CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/main_expa-mobile.yml`) that:
1. Builds the application on push to `main` branch
2. Creates a deployment artifact
3. Deploys to Azure Web App

### Azure Deployment

The application is configured for Azure Web App deployment with:
- Automatic builds on push to main
- Artifact creation and upload
- Azure authentication via service principal
- Production slot deployment

### Manual Deployment

1. Build the application: `npm run build`
2. Upload `dist/` contents to your web server
3. Ensure environment variables are set on the server
4. Configure HTTPS (required for PWA and Keycloak)

### Server Requirements

- **HTTPS**: Required for PWA features and Keycloak
- **Static File Serving**: Serve files from `dist/` directory
- **SPA Routing**: Configure server to serve `index.html` for all routes
- **Environment Variables**: Set in server environment or build process

## 📝 Application Statuses

### Status Workflow

The application supports various statuses with specific transitions:

#### ICX Flow Statuses
- **OPEN**: Initial status, can Accept or Reject
- **MATCHED**: Accepted by host, can Reject
- **ACCEPTED**: Accepted status
- **APPROVED BY HOME**: Approved by home entity, can Approve as Host or Reject
- **APPROVED**: Fully approved
- **REALIZED**: Application realized
- **REJECTED**: Rejected, can Unreject
- **FINISHED**: Completed application
- **WITHDRAWN**: Withdrawn application

#### OGX Flow Statuses
- **OPEN**: Can Accept or Withdraw
- **MATCHED**: Can Withdraw
- **ACCEPTED**: Can mark as Paid for Approve
- **PAID FOR APPROVAL**: Can Approve as Home
- **WITHDRAWN**: Can reopen to OPEN

### Status Colors

Statuses are color-coded in the UI:
- **Open**: Blue (`#2B6CB0`)
- **Accept/Approved**: Green (`#38A169`)
- **Reject**: Red (`#C53030`)
- **Approved by Home**: Yellow (`#D69E2E`)
- **Realized**: Purple (`#6B46C1`)
- **Withdrawn/Finished**: Gray (`#4A5568`)

### Rejection Reasons

When rejecting an application, users must select from predefined reasons:
1. Project is canceled
2. AIESEC is unresponsive
3. Partner is unresponsive
4. EP is unresponsive
5. Problem with the timeline or realization date
6. Required citizenship not matching
7. Poor language proficiency
8. Lack of professional experience
9. Position is filled
10. Skills are not suitable
11. The background is not suitable
12. Incomplete/low quality of CV/profile

## 🧪 Testing

### Manual Testing Checklist

- [ ] Authentication flow (login, logout, token refresh)
- [ ] Application list loading and pagination
- [ ] Search functionality
- [ ] Status filtering
- [ ] Status changes (all transitions)
- [ ] CV download
- [ ] Mobile responsiveness
- [ ] PWA installation
- [ ] Offline functionality
- [ ] PWA update prompts

## 🤝 Contributing

### Development Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Run linting: `npm run lint`
5. Create a pull request

### Code Guidelines

- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS for styling
- Keep components small and focused
- Add comments for complex logic
- Use meaningful variable and function names

## 📄 License

See `LICENSE` file for details.

## 🆘 Troubleshooting

### Common Issues

#### Authentication Not Working
- Verify environment variables are set correctly
- Check Keycloak server accessibility
- Verify Keycloak realm and client ID

#### API Requests Failing
- Check `VITE_GIS_API` environment variable
- Verify authentication token is present
- Check browser console for GraphQL errors

#### PWA Not Installing
- Ensure HTTPS is enabled
- Check service worker registration in browser console
- Verify manifest.json is accessible

#### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (requires 18.x+)
- Verify all environment variables are set

## 📞 Support

For issues and questions:
- Check existing GitHub issues
- Review code comments and documentation
- Contact the development team

## 📚 Additional Documentation

For more detailed information, see the following documentation files:

- **[Setup Guide](docs/SETUP.md)**: Detailed setup instructions and troubleshooting
- **[Architecture Documentation](docs/ARCHITECTURE.md)**: Technical architecture, data flow, and system design
- **[API Documentation](docs/API.md)**: Complete API reference, queries, mutations, and usage examples

---

**Built with ❤️ for AIESEC**
