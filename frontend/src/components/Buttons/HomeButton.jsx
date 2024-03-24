import React from "react";
import { useNavigate } from "react-router-dom";
import Utils from "../../modules/Utils";
import logoImage from "../../assets/logo_new.png";
import "../../style/Button.css";

const HomeButton = () => {
    const navigate = useNavigate();

    return(
        <div className="logo-bg" onClick={() => Utils.logout(navigate)}>
            <img className="logo" src={logoImage}></img>
        </div>
    )
}; 

export default HomeButton;