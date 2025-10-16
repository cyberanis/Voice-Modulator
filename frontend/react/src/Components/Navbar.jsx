import { useNavigate } from "react-router-dom";
import Button from "./Button";

function Navbar() {
  const Navigate = useNavigate();
  return (
    <>
      <div className="NavigationBar">
        <div className="buttons">
          <Button
            label="Home"
            className="home"
            onClick={() => {
              Navigate("/");
            }}
          ></Button>
          <Button
            label="About"
            className="about"
            onClick={() => {
              alert("En cours de dev !");
            }}
          ></Button>
        </div>
        <div className="IconSide">
          <div className="SettingsIconContainer">
            <img
              src="settings.png"
              className="Settings"
              alt="logo paramètres"
            ></img>
          </div>
          <div className="UserIconContainer">
            <img src="user.png" className="User" alt="logo utilisateur"></img>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
