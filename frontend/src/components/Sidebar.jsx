function Sidebar({
  page,
  onNavigate,
  selectedIncidentId,
  onLogout,
}) {

  function navigate(target) {

    if (
      target === "analyzer" &&
      !selectedIncidentId
    ) {

      onNavigate("new");
      return;
    }

    onNavigate(target);
  }


  return (
    <aside className="sidebar">

      <div className="brand">

        <div className="brand-icon">
          🛡
        </div>


        <div className="brand-text">

          <h1>
            ThreatLens AI
          </h1>

          <span>
            AI SECURITY PLATFORM
          </span>

        </div>

      </div>


      <nav className="navigation">

        <button
          className={
            page === "dashboard"
              ? "nav-item active"
              : "nav-item"
          }
          onClick={() =>
            navigate("dashboard")
          }
        >
          <span>▦</span>
          Dashboard
        </button>


        <button
          className={
            page === "new"
              ? "nav-item active"
              : "nav-item"
          }
          onClick={() =>
            navigate("new")
          }
        >
          <span>＋</span>
          New Incident
        </button>


        <button
          className={
            page === "analyzer"
              ? "nav-item active"
              : "nav-item"
          }
          onClick={() =>
            navigate("analyzer")
          }
        >
          <span>✦</span>
          AI Analyzer
        </button>


        <button
          className={
            page === "history"
              ? "nav-item active"
              : "nav-item"
          }
          onClick={() =>
            navigate("history")
          }
        >
          <span>◷</span>
          Incident History
        </button>


        <button
          className={
            page === "analytics"
              ? "nav-item active"
              : "nav-item"
          }
          onClick={() =>
            navigate("analytics")
          }
        >
          <span>◫</span>
          Analytics
        </button>

      </nav>


      <div className="sidebar-bottom">

        <div className="security-status">

          <span className="status-dot" />

          <div>

            <strong>
              AI Engine Online
            </strong>

            <small>
              Groq + RAG active
            </small>

          </div>

        </div>


        <button
          className="logout-button"
          onClick={onLogout}
        >
          ⇥ Sign out
        </button>

      </div>

    </aside>
  );
}


export default Sidebar;