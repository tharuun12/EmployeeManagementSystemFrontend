# Employee Management System Frontend

This project is the frontend for the Employee Management System. It is built using React and TypeScript.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (v16 or higher)
- npm (v7 or higher)
- .NET Core SDK (v6 or higher)

## Setup Instructions

Follow these steps to set up the project:

### 1. Clone the Repository

```bash
git clone https://github.com/tharuun12/EmployeeManagementSystemFrontend.git
cd EmployeeManagementSystemFrontend
```

### 2. Install Dependencies

Run the following command to install the required dependencies:

```bash
npm install
```

### 3. Configure Environment Variables

Set up the `.env` file in the root directory with the following content:

```properties
REACT_APP_API_BASE_URL= https://localhost:7016
```

This URL is the base URL for accessing the API hosted by the .NET backend.

### 4. Start the Development Server

Run the following command to start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Project Structure

The project is organized as follows:

- `public/`: Contains static assets like `index.html` and images.
- `src/`: Contains the source code for the application.
  - `api/`: Contains API-related utilities.
  - `assets/`: Contains styles and other assets.
  - `components/`: Contains reusable components.
  - `hooks/`: Contains custom React hooks.
  - `pages/`: Contains page-specific components.
  - `routes/`: Contains route definitions.

