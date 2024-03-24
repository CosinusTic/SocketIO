import React from "react";
import { useNavigate } from "react-router-dom";
import Utils from "../../modules/Utils";
import logoutImage from "../../assets/logout_alt.jpg";
import "../../style/Button.css";

const LogoutButton = () => {
    const navigate = useNavigate();

    return(
        <div className="logout-btn">
            <img onClick={() => Utils.logout(navigate)} src={logoutImage} className="logout-bg"></img>
        </div>
    )
}; 

export default LogoutButton;