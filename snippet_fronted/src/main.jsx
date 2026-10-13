import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/Dashboard.css";
import App from './App.jsx'
import "./styles/Sidebar.css";
import "./styles/Topbar.css";
import "./styles/Navbar.css";
import "./styles/Snippetcard.css";
import "./styles/CreateSnippet.css";
import "./styles/AllSnippets.css";
import "./styles/SnippetDetails.css";
import "./styles/EditSnippet.css";
import "./styles/Login.css";
import "./styles/register.css";
import "./styles/ForgotPassword.css";
import "./styles/ResetPassword.css";
import "./styles/Home.css"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
