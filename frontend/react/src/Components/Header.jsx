import Button from "./Button";

function Header() {
  return (
    <>
      <div className="Header">
        <div className="leftPart">
          <Button
            label="Home"
            className="Home"
            onClick={() => alert("Fonctionnalité en dev")}
          ></Button>
          <Button
            label="About"
            className="About"
            onClick={() => alert("Fonctionnalité en dev !")}
          ></Button>
        </div>
        <div className="rightPart">
          <img className="Settings" src="/settings.png"></img>
          <img className="User" src="/user.png"></img>
        </div>
      </div>
    </>
  );
}

export default Header;
