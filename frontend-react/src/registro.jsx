import { useState } from "react";

export default function Registro({onIrLogin}) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [verPass, setVerPass] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);
  const [errorCorreo, setErrorCorreo] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirmar, setErrorConfirmar] = useState("");

  const registrar = async (e) => {
    e.preventDefault();
    let valido = true;
    setErrorCorreo("");
    setErrorPassword("");
    setErrorConfirmar("");

    // Validar correo - igual que tu main.js
    const regexMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|ec|net|org|edu|com\.ec|gob|io)$/i;
    if (!regexMail.test(correo.trim())) {
      setErrorCorreo("Por favor ingresa un correo válido ejemplo: tunombre@gmail.com");
      valido = false;
    }

    // Validar contraseña - igual que tu main.js
    const letras4 = (password.match(/[a-zA-Z]/g) || []).length >= 4;
    const conNumero = /[0-9]/.test(password);
    const conSigno = /[^a-zA-Z0-9]/.test(password);
    if (!letras4 || !conNumero || !conSigno || password.length < 4) {
      setErrorPassword("Minimo 4 letras, 1 numero y 1 signo.");
      valido = false;
    }

    // Que coincidan
    if (password !== confirmar) {
      setErrorConfirmar("Las contraseñas no coinciden");
      valido = false;
    }

    if (!valido) return;

    try {
      const respuesta = await fetch("http://localhost:3000/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo: correo.trim(), password, telefono }),
      });
      const datos = await respuesta.json();
      alert(datos.mensaje);
      if (respuesta.ok) {
        setNombre(""); setCorreo(""); setTelefono(""); setPassword(""); setConfirmar("");
      }
    } catch {
      alert("No se puede conectar con el servidor. ¿Tienes prendido el backend con node index.js?");
    }
  };

  return (
    <main className="form_registro_inicio">
      <h2>Crea tu cuenta en Lunari ✨</h2>
      <form className="formulario" onSubmit={registrar}>
        <div className="form_dato">
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div className="form_dato">
          <label>Correo:</label>
          <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          {errorCorreo && <small className="error" style={{display:"block"}}>{errorCorreo}</small>}
        </div>
        <div className="form_dato">
          <label>Número celular:</label>
          <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
        </div>
        <div className="form_dato password_wrapper">
          <label>Contraseña:</label>
          <input type={verPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
          {errorPassword && <small className="error" style={{display:"block"}}>{errorPassword}</small>}
          <button type="button" className="contraseña_privada" onClick={() => setVerPass(!verPass)}>
            {verPass ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        <div className="form_dato password_wrapper">
          <label>Confirmar contraseña:</label>
          <input type={verConfirmar ? "text" : "password"} value={confirmar} onChange={(e) => setConfirmar(e.target.value)} required />
          <button type="button" className="contraseña_privada" onClick={() => setVerConfirmar(!verConfirmar)}>
            {verConfirmar ? "Ocultar" : "Mostrar"}
          </button>
          {errorConfirmar && <small className="error" style={{display:"block"}}>{errorConfirmar}</small>}
        </div>
        <button type="submit" className="btn_principal">Registrarse</button>
        <p>¿Ya tienes una cuenta? <button type="button" className="link_login" onClick={()=>onIrLogin && onIrLogin()}>Iniciar Sesión</button></p>
      </form>
    </main>
  );
}
