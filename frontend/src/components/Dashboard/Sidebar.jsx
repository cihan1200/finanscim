import "../../styles/Dashboard/Sidebar.css";
import { House, ChartColumnIncreasing, Radar, ChevronDown, User, LogOut, Telescope, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    localStorage.removeItem("user");
    navigate("/");
  };

  const basicsNavItems = [
    { name: "Ana sayfa", icon: House, href: "/dashboard" },
    { name: "Yatırım planlama", icon: ChartColumnIncreasing, href: "/dashboard/investment_planner" },
    { name: "Radar", icon: Radar, href: "/dashboard/radar" },
    { name: "Hisseler", icon: Telescope, href: "/dashboard/stock_explorer" }
  ];
  const panelNavItems = [
    { name: `${user?.name} ${user?.lastName}`, icon: User, href: "/dashboard/user_info" },
    {
      name: "Çıkış yap",
      icon: LogOut,
      href: "#",
      onClick: handleLogout,
      className: "logout-item"
    }
  ];
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  const [showPanel, setShowPanel] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowPanel(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open Menu"
      >
        <Menu size={24} />
      </button>
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />
      <aside className={`dashboard-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="mobile-sidebar-header">
          <span className="mobile-logo-text">Menü</span>
          <button className="mobile-close-btn" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="user-menu-wrapper" ref={wrapperRef}>
          <div
            className="dashboard-sidebar__user-tab"
            onClick={() => setShowPanel(!showPanel)}
          >
            <div className="user-container">
              <div className="user-pp-container">
                <span className="user-pp">{user?.name[0]}</span>
              </div>
              <span className="user-name">{user?.name} {user?.lastName}</span>
            </div>
            <ChevronDown
              className={`chevron-icon ${showPanel ? "rotate" : ""}`}
              size=".7em"
            />
          </div>
          {showPanel && (
            <div className="panel">
              <div className="panel-user-container">
                <div className="panel-user-pp-container">
                  <span className="panel-user-pp">{user?.name[0]}{user?.lastName[0]}</span>
                </div>
                <span className="panel-user-name">{user?.name} {user?.lastName}</span>
              </div>
              <nav className="panel-nav">
                {panelNavItems.map((item, index) => (
                  <a
                    className={`nav-item ${item.className || ""}`}
                    href={item.href}
                    key={index}
                    onClick={(e) => {
                      if (item.onClick) item.onClick(e);
                      handleLinkClick();
                    }}
                  >
                    <item.icon size="1.2em" style={{ minWidth: "1.2em", flexShrink: 0 }} />
                    <span className="nav-text">{item.name}</span>
                  </a>
                ))}
              </nav>
            </div>
          )}
        </div>
        <nav className="dashboard-sidebar__basics-nav">
          {basicsNavItems.map((item, index) => {
            const isActive = item.href === currentPath;
            return (
              <a
                className={`nav-item ${isActive ? "nav-item--active" : ""}`}
                href={item.href}
                key={index}
                onClick={handleLinkClick}
              >
                <item.icon size="1.2em" />
                {item.name}
              </a>
            );
          })}
        </nav>
      </aside>
    </>
  );
}