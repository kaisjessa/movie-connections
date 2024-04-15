import React from "react";

const Header = async () => {
  return (
    <div className="navbar bg-base-100">
      <a className="header-btn" href="/">
        Home
      </a>
      <a className="header-btn" href="/create">
        Create
      </a>
    </div>
  );
};

export default Header;
