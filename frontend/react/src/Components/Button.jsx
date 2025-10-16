// @ts-ignore
function Button({ label, className, onClick, icon, style }) {
  return (
    <button onClick={onClick} className={className} style={style}>
      {label}
      {icon && <img src={icon} alt="icon"></img>}
    </button>
  );
}

export default Button;
