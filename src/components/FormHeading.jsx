export default function FormHeading({ eyebrow, title, close }) {
  return <div className="form-heading">
    <div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>
    <button type="button" onClick={close} aria-label="Cerrar">✕</button>
  </div>;
}
