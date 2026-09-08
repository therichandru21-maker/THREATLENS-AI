function Navbar({
  user,
  title,
}) {
  return (
    <header className="topbar">

      <div className="topbar-title">
        <p className="eyebrow">
          SECURITY OPERATIONS CENTER
        </p>

        <h2>
          {title}
        </h2>
      </div>

      <div className="user-profile">

        <div className="avatar">
          {user?.username
            ?.charAt(0)
            .toUpperCase()}
        </div>

        <div>
          <strong>
            {user?.username}
          </strong>

          <small>
            Security Analyst
          </small>
        </div>

      </div>

    </header>
  );
}

export default Navbar;