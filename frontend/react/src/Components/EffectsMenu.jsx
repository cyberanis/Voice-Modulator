import { useState } from "react";
import Button from "../Components/Button";

function EffectsMenu({ effect, ChangeEffect }) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeEffect, setActiveEffect] = useState(""); // "", "R", "A"

  const handleEffect = (newEffect) => {
    if (activeEffect === newEffect) {
      setActiveEffect("");
      ChangeEffect("");
    } else {
      setActiveEffect(newEffect);
      ChangeEffect(newEffect);
    }
    console.log(activeEffect);
  };

  return (
    <div className="EffectsField">
      <div className="MenuHeader">
        <div className="Title">
          <p>Effects</p>
        </div>
        <div className="MenuButtonContainer">
          <Button
            label="▼"
            className="Menu"
            onClick={() => {
              setIsOpen(!isOpen);
              handleEffect("");
            }}
          />
        </div>
      </div>

      {isOpen && (
        <div className="Effects">
          <Button
            label="Robotise"
            className="RobotisationButton"
            onClick={() => handleEffect("R")}
            style={{
              backgroundColor: activeEffect == "R" ? "#463d56" : "#2d2d2d",
            }}
          />
          <Button
            label="Alienification"
            className="AlienificationButton"
            onClick={() => handleEffect("A")}
            style={{
              backgroundColor: activeEffect === "A" ? "#463d56" : "#2d2d2d",
            }}
          />
          <Button
            label="None"
            className="OnVerra"
            onClick={() => handleEffect("")}
            style={{
              backgroundColor: activeEffect === "" ? "#463d56" : "#2d2d2d",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default EffectsMenu;
