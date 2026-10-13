import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function Sidebar() {
  // Used to redirect the user to the login page.
  const navigate = useNavigate();

  // Get the current user's information from Zustand.
  const user = useAuthStore((state) => state.user);

  // Get the logout function from Zustand.
  const logout = useAuthStore((state) => state.logout);

  // Runs when the logout button is clicked.
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <i className="bi bi-braces-asterisk"></i>
        <span>SnippetVault</span>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-heading">MAIN MENU</p>

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <i className="bi bi-grid"></i>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/snippets" end
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <i className="bi bi-code-slash"></i>
          <span>All Snippets</span>
        </NavLink>

        <NavLink
          to="/snippets/new" end
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <i className="bi bi-plus-square"></i>
          <span>Create Snippet</span>
        </NavLink>
      </div>

      <div className="sidebar-section">
        {/* <p className="sidebar-heading">ORGANIZE</p>

        <NavLink
          to="/languages"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <i className="bi bi-terminal"></i>
          <span>Languages</span>
        </NavLink>

        <NavLink
          to="/tags"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <i className="bi bi-tags"></i>
          <span>Tags</span>
        </NavLink>

        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <i className="bi bi-star"></i>
          <span>Favorites</span>
        </NavLink> */}
      </div>

      <div className="sidebar-bottom">
        {/* <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <i className="bi bi-gear"></i>
          <span>Settings</span>
        </NavLink> */}

        <div className="sidebar-user">
          {/* <div className="user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "D"}
          </div>

          <div className="user-info">
            <h6>{user?.name || "Developer"}</h6>
            <span>{user?.email || "Free Account"}</span>
          </div> */}

          <button
            type="button" 
            className="sidebar-logout-btn"
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;