import { useNavigate } from "react-router-dom";
import Button from "../Components/Button";
import "./Home.css";

function Home() {
  const Navigate = useNavigate();

  return (
    <>
      <div className="Corps">
        <div className="TitlesPart">
          <h2 className="MainPageTitle">
            Modulate your Voice <br />
            <span className="MainPageSubTitle">
              Welcome to the sound revolution
            </span>
          </h2>
        </div>
        <div className="buttonsContainerHome">
          <Button
            label="Try Local"
            className="btn-Local"
            onClick={() => Navigate("/local")}
          ></Button>
          <Button
            label="Go Live"
            className="btn-Live"
            onClick={() => {
              alert("Bruh en cours de dev !");
            }}
          ></Button>
        </div>
      </div>
    </>
  );
}

export default Home;
