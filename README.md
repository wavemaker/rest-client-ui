# Rest Import UI

# Setting up a dev environment

Rest Import UI includes a development server that provides hot module reloading and unminified stack traces, for easier development.

### Prerequisites

- git, any version
- **Node.js >=16.13.2** and **npm >=8.1.2** are the minimum required versions that this repo runs on, but we recommend using the latest version of Node.js@16

### Steps

1. `git clone https://github.com/wavemaker/rest-client-ui.git`
2. `cd rest-client-ui`
3. `npm install`
4. `npm start`
5. Wait a bit
6. Open http://localhost:3000/

# Development

Run `npm start` for a dev server. Navigate to http://localhost:3000/. The application will automatically reload if you change any of the source files.

# Build

Run `npm run build` to build the project. The build artifacts will be stored in the dist/ directory.

1. `rest-import-bundle.js`
2. `rest-import-bundle.css`

