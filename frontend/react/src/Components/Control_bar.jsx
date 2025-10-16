function ControlBar({
  value1,
  setValue1,
  value2,
  setValue2,
  value3,
  setValue3,
}) {
  return (
    <>
      <div className="ControlBarContainer">
        <div className="ControlLine">
          <p className="Label">Speed</p>
          <div className="SliderContainer">
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.5"
              value={value1}
              onChange={(e) => setValue1(Number(e.target.value))}
              className="SpeedControlBar"
              list="tickmarks"
            ></input>
          </div>
          <div className="Value">
            <p>x {value1}</p>
          </div>
        </div>

        <div className="ControlLine">
          <p className="Label">Pitch</p>
          <div className="SliderContainer">
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.5"
              value={value2}
              onChange={(e) => setValue2(Number(e.target.value))}
              className="PitchControlBar"
            ></input>
          </div>
          <div className="Value">
            <p>x {value2}</p>
          </div>
        </div>
        <div className="ControlLine">
          <p className="Label">Reverb</p>
          <div className="SliderContainer">
            <input
              type="range"
              min="0"
              max="3"
              step="1"
              value={value3}
              onChange={(e) => setValue3(Number(e.target.value))}
              className="ReverbControlBar"
            ></input>
          </div>
          <div className="Value">
            <p>x {value3}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ControlBar;
