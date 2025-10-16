import ControlBar from "../Components/Control_bar";
import Navbar from "../Components/Navbar";
import Button from "../Components/Button";
import EffectsMenu from "../Components/EffectsMenu";
import SoundWave from "../Components/SoundWave";
import { useEffect, useState } from "react";
import "./Local.css";
const { ipcRenderer } = window.require("electron");
const path = require("path");

function Local() {
  /*J'initialise les useState de la controlBar*/
  const [SpeedValue, setSpeedValue] = useState(1);
  const [PitchValue, setPitchValue] = useState(1);
  const [ReverbValue, setReverbValue] = useState(0);

  /*J'initialise le UseState de l'EffectsMenu */
  const [effet, ChangeEffect] = useState("");

  /*J'initialise les valeurs de la waveSound*/
  const columns = 100;
  const [data, setData] = useState(new Array(100).fill(0));
  const [toggle, setToggle] = useState(0);

  /*State de l'audio*/
  const [audioPath, setAudioPath] = useState(null);

  useEffect(() => {
    ipcRenderer.on("fileName", (event, path) => {
      setAudioPath(path);
    });
  });

  /*Je crée un composant déstiné à passer en commentaire de la requête au Backend */
  const config = {
    speed: SpeedValue,
    pitch: PitchValue,
    reverb: ReverbValue,
    effect: effet,
  };

  const handleClick = () => {
    setToggle((prev) => (prev === 0 ? 1 : 0));
    toggle == 0
      ? ipcRenderer.send("start-cpp", config)
      : ipcRenderer.send("stop-cpp");
    console.log(config);
  };

  const path = toggle === 0 ? "audio.png" : "arret.png";

  let audiopath = ipcRenderer.on("fileName", (event, path) => {});

  const playSound = () => {
    console.log(audioPath);
    const audio = new Audio(`${audioPath}`);
    audio.play().catch((err) => console.error("erreur de lecture: ", err));
  };

  useEffect(() => {
    const handler = (event, newData) => {
      const incoming = Array.isArray(newData) ? newData : [newData];

      setData((prev) => {
        let updated = [...prev];

        incoming.forEach((val) => {
          updated = [...updated.slice(1), val * 10]; // on enlève le premier et on ajoute à la fin
        });

        return updated;
      });
    };

    ipcRenderer.on("cpp-data", handler);

    return () => {
      ipcRenderer.removeListener("cpp-data", handler);
    };
  }, []);

  return (
    <>
      <div className="TopLeftTitle">
        <h1>Enregistrement Local</h1>
      </div>
      <Navbar />
      <ControlBar
        value1={SpeedValue}
        value2={PitchValue}
        value3={ReverbValue}
        setValue1={setSpeedValue}
        setValue2={setPitchValue}
        setValue3={setReverbValue}
      />
      <div className="BottomButtons">
        <Button
          label="Read"
          className="ReadButton"
          onClick={() => {
            playSound();
          }}
        ></Button>
        <Button
          label="Save"
          className="SaveButton"
          onClick={() => {
            alert("Encore en phase de dev !");
          }}
        ></Button>
      </div>
      <div className="SaveIcon">
        <Button
          label=""
          className="micIcon"
          onClick={handleClick}
          icon={path}
        ></Button>
      </div>

      <div className="SoundWaveContainer" style={{ gap: `${50 / columns}%` }}>
        <SoundWave values={data} columns={columns} />
      </div>

      <div className="EffectsMenuContainer">
        <EffectsMenu effect={effet} ChangeEffect={ChangeEffect}></EffectsMenu>
      </div>
    </>
  );
}

export default Local;
