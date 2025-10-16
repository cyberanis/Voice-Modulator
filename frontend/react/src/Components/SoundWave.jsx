function SoundWave({ values, columns }) {
  return (
    <>
      {Array.from({ length: columns }).map((_, i) => (
        <div
          className="SoundColumnContainer"
          style={{
            width: `${50 / values.length}`,
            height: `${100}%`,
            gap: `${10 / columns}%`,
          }}
        >
          <div
            key={i}
            id={`Column${i}`}
            className="SoundColumn"
            style={{
              height: `${values[i] * 100}%`,
              backgroundColor: "#646cff",
            }}
          ></div>
        </div>
      ))}
    </>
  );
}

export default SoundWave;
