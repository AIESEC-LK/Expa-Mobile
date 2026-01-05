# Setup Guide

## Quick Start

### 1. Prerequisites

Ensure you have the following installed:
- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**
- **Git** ([Download](https://git-scm.com/))

Verify installations:
```bash
node --version  # Should be 18.x or higher
npm --version
git --version
```

### 2. Clone Repository

```bash
git clone <repository-url>
cd Expa-Mobile
```

### 3. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

### 4. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Windows (PowerShell)
New-Item .env

# Linux/Mac
touch .env
```

Add the following environment variables:

```env
# Keycloak Authentication
VITE_KEYCLOAK_URL=https://auth.aiesec.lk
VITE_KEYCLOAK_REALM=your-realm-name
VITE_KEYCLOAK_CLIENT_ID=your-client-id

# GraphQL API
VITE_GIS_API=https://staging-jruby.aiesec.org/graphql
```

**Important**: Replace placeholder values with actual values from your environment.

### 5. Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173` (or the next available port).

### 6. Open in Browser

Navigate to `http://localhost:5173` in your browser.

## Development Setup

### IDE Configuration

#### VS Code (Recommended)

Install recommended extensions:
- ESLint
- Prettier (optional, for code formatting)
- Tailwind CSS IntelliSense

#### Project Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": [
    "javascript",
    "javascriptreact"
  ]
}
```

### Development Workflow

1. **Start Dev Server**: `npm run dev`
2. **Make Changes**: Edit files in `src/`
3. **Hot Reload**: Changes automatically reflect in browser
4. **Check Linting**: `npm run lint`
5. **Build for Testing**: `npm run build && npm start`

### Testing on Mobile Devices

The dev server is configured to accept connections from other devices:

1. **Find your local IP**:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr`

2. **Access from mobile**:
   - Connect mobile device to same network
   - Open browser on mobile
   - Navigate to `http://<your-ip>:5173`

3. **HTTPS for PWA Testing**:
   - For PWA features, you may need HTTPS
   - Use a tool like [ngrok](https://ngrok.com/) or [localtunnel](https://localtunnel.github.io/www/)
   - Or use Vite's HTTPS option (requires certificates)

## Production Build

### Build Process

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-{hash}.js
│   └── index-{hash}.css
├── manifest.webmanifest
├── sw.js
└── static assets
```

### Preview Production Build

```bash
npm start
```

This serves the production build locally for testing.

### Deploy Production Build

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Upload `dist/` contents** to your web server

3. **Configure server**:
   - Serve `index.html` for all routes (SPA routing)
   - Enable HTTPS (required for PWA)
   - Set environment variables on server

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_KEYCLOAK_URL` | Keycloak server URL | `https://auth.aiesec.lk` |
| `VITE_KEYCLOAK_REALM` | Keycloak realm name | `aiesec` |
| `VITE_KEYCLOAK_CLIENT_ID` | Keycloak client ID | `expa-mobile` |
| `VITE_GIS_API` | GraphQL API endpoint | `https://staging-jruby.aiesec.org/graphql` |

### Getting Keycloak Credentials

1. Contact your Keycloak administrator
2. Or access Keycloak admin console
3. Navigate to: Clients → Your Client → Settings
4. Note the Client ID
5. Note the Realm name from the URL or realm settings

### Getting API Endpoint

1. Contact backend team
2. Or check backend documentation
3. Use staging endpoint for development
4. Use production endpoint for production builds

## Troubleshooting

### Common Issues

#### Port Already in Use

**Error**: `Port 5173 is already in use`

**Solution**:
```bash
# Kill process on port 5173
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill
```

Or change port in `vite.config.js`:
```javascript
server: {
  port: 5174, // Change to different port
}
```

#### Module Not Found

**Error**: `Cannot find module '...'`

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Environment Variables Not Working

**Error**: `undefined` for environment variables

**Solution**:
1. Ensure variables start with `VITE_`
2. Restart dev server after adding variables
3. Check `.env` file is in root directory
4. Verify no typos in variable names

#### Keycloak Authentication Fails

**Error**: Authentication redirects or fails

**Solution**:
1. Verify Keycloak URL is accessible
2. Check realm and client ID are correct
3. Verify client is configured for public access
4. Check browser console for errors
5. Ensure HTTPS is used (or localhost for development)

#### GraphQL API Errors

**Error**: GraphQL query fails

**Solution**:
1. Verify `VITE_GIS_API` is correct
2. Check authentication token is present
3. Verify API endpoint is accessible
4. Check GraphQL query syntax
5. Review browser Network tab for error details

#### PWA Not Working

**Error**: Service worker not registering or PWA not installable

**Solution**:
1. Ensure HTTPS is enabled (required for PWA)
2. Check service worker file exists in `dist/`
3. Verify manifest.webmanifest is accessible
4. Check browser console for service worker errors
5. Clear browser cache and reload

#### Build Fails

**Error**: Build process errors

**Solution**:
1. Check Node.js version (18.x+)
2. Clear node_modules and reinstall
3. Check for syntax errors: `npm run lint`
4. Review build error messages
5. Ensure all environment variables are set

### Getting Help

1. **Check Documentation**:
   - README.md
   - ARCHITECTURE.md
   - API.md

2. **Check Issues**:
   - GitHub Issues
   - Team communication channels

3. **Debug Steps**:
   - Check browser console
   - Check Network tab
   - Review server logs
   - Enable verbose logging

## Additional Resources

### Documentation
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [GraphQL Documentation](https://graphql.org/learn/)

### Tools
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Vite DevTools](https://github.com/webfansplz/vite-plugin-vue-devtools)
- [GraphQL Playground](https://github.com/graphql/graphql-playground)

### Learning Resources
- [React Hooks](https://react.dev/reference/react)
- [React Router](https://reactrouter.com/)
- [PWA Guide](https://web.dev/progressive-web-apps/)

---

For more detailed information, see the main [README.md](../README.md) file.

