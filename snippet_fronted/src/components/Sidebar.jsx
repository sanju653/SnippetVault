import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function Sidebar() {
  
  const navigate = useNavigate();

  //const user = useAuthStore((state) => state.user);

 
  const logout = useAuthStore((state) => state.logout);


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
          end //This tells React Router to consider the link active only when =>the current pathname matches its destination exactly.
          //Remember: end prevents the Dashboard link from staying active on every page.
          className={({ isActive }) =>
            //isActive : built-in property provided by React Router's NavLink
            //indicates whether the link is active.
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

          <div className="user-finfo">
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