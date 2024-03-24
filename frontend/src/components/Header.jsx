import React from "react";
import LogoutButton from "./Buttons/LogoutButton";
import HomeButton from "./Buttons/HomeButton";
import "../style/Header.css";

const Header = () => {
    return(
        <div className="header-container">
            <HomeButton />
            <LogoutButton />
        </div>
    )
};

export default Header;