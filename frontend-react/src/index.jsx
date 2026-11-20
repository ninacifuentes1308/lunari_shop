import React, {useState} from "react";

const reseñas = [
  { nombre: "Daniela M.", foto: "/assets/img/cliente1.jpeg", estrellas: "⭐⭐⭐⭐⭐", texto: "La cajita es más linda en persona y la atención por WhatsApp 10/10, super pacientes." },
  { nombre: "Zacarias S.", foto: "/assets/img/cliente2.jpeg", estrellas: "⭐⭐⭐⭐⭐", texto: "Me ayudaron con ideas para darle a mi novia y le encantó." },
  { nombre: "Peter H.", foto: "/assets/img/cliente3.jpeg", estrellas: "⭐⭐⭐⭐⭐", texto: "Lo pedí para el cumpleaños de mi mejor amiga y le encantó, la próxima volveré a pedir." },
  { nombre: "Mateo J.", foto: "/assets/img/cliente4.jpeg", estrellas: "⭐⭐⭐⭐", texto: "Lo pedi para el cumpleaños de mi hermana y llegó a tiempo, aunque deberian tener más variedad, fuera de eso, increible." },
  { nombre: "Angie Z.", foto: "/assets/img/cliente5.jpeg", estrellas: "⭐⭐⭐⭐⭐", texto: "Me pedí unas cuantas cosas y simplemente hermoso, todo me encantó." },
  { nombre: "Cristina C.", foto: "/assets/img/cliente6.jpeg", estrellas: "⭐⭐⭐⭐⭐", texto: "Me pedi un kit y de verdad todo es mas bonito que en las fotos, muchas gracias." },
];

const preguntas = [
  { q: "¿Hacen envíos?", r: "Si, realizamos envios a todo el Ecuador mediante Servientrega. En guayaquil tenemos entregas personales mucho más rápido." },
  { q: "¿Cuánto demoran las entregas?", r: "Dentro de Guayaquil de 24 a 48 horas laborables. Fuera de Guayaquil de 2 a 4 días laborables." },
  { q: "¿Cuál es el costo de envío?", r: "En guayaquil $2.50 a $4 dependiendo el sector. A otras provincias $5 a $7." },
  { q: "¿Tienen tienda física?", r: "Por ahora somos solo tienda online, pero hacemos entregas personales en puntos de Guayaquil." },
];

export default function Index({ nombreUsuario, irATienda, irALogin, onSalir, irAContacto, irAAdmin }) {
  const [abierta, setAbierta] = useState(null);

  return (
    <>
      {/* BANNER - INICIO */}
      <section id="inicio">
        <div className="banner">
          <div className="textobanner">
            <h2>Lunari: Hecho con amor, para ti.</h2>
            <h4>Detallitos únicos para tu día a día.</h4>
            {nombreUsuario ? (
              <>
                <span id="saludousuario">Hola, {nombreUsuario} ✨</span>
                <button className="btn_principal" onClick={onSalir}>Salir</button>
              </>
            ) : (
              <button className="btn_principal" onClick={irALogin}>Iniciar Sesión</button>
            )}
          </div>
          <img src="/assets/img/bannerimg.png" alt="banner de Lunari Shop" width="250px" height="250px" />
        </div>
      </section>

      {/* HISTORIA */}
      <section id="historia">
        <div className="sobre_mi">
          <h2>Sobre Lunari:</h2><br />
          <p>Sabemos que encontrar el regalo perfecto no siempre es fácil. Por eso nació Lunari.</p><br /><br />
          <p>Somos una tienda de detalles donde puedes elegir del catálogo, armar tu propio combo, o personalizar los regalos a tu estilo.</p><br /><br />
          <p>Buscamos que cada regalo cuente una historia y que regalar vuelva a sentirse especial.</p>
        </div>
        <div className="imagen">
          <img src="/assets/img/gato.png" alt="gato de Lunari Shop" width="350px" height="350px" />
        </div>
      </section>

      {/* CÓMO PEDIR */}
      <section id="pedir">
        <h2>¿Como pedir tu detallito con Lunari? ❤️</h2>
        <h3>Te lo explicamos en 3 pasitos ✨</h3>
        <div className="pasos">
          <div className="paso"><h3>1.- Eliges</h3><p>Elige tus productos favoritos de nuestro catálogo o personaliza el tuyo con nuestras plantillas.</p></div>
          <div className="paso"><h3>2.- Nos escribes</h3><p>Nos mandas mensajito via WhatsApp con tu pedido y tu zona en Guayaquil.</p></div>
          <div className="paso"><h3>3.- Te lo llevamos</h3><p>Preparamos tu pedido y te lo llevamos.</p></div>
        </div>
      </section>

      {/* RESEÑAS */}
      <section id="reseñas">
        <h2>Lo que dicen de Lunari</h2>
        <div className="ventana">
          <div className="riel">
            {[...reseñas, ...reseñas].map((r, i) => (
              <div className="reseña" key={i}>
                <div className="arriba">
                  <div className="ft_perfil"><img src={r.foto} alt={`foto ${r.nombre}`} /></div>
                  <span>{r.nombre}</span>
                </div>
                <p>{r.estrellas}</p>
                <p>{r.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREGUNTAS */}
      <section id="preguntas">
        <h2>Preguntas Frecuentes</h2>
        {preguntas.map((p, i) => (
          <div key={i}>
            <button className="pregunta" onClick={() => setAbierta(abierta === i ? null : i)}>
              {p.q} <span>{abierta === i ? "-" : "+"}</span>
            </button>
            {abierta === i && <div className="respuesta">{p.r}</div>}
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer id="contacto">
        <div className="footer_redes">
          <p>Contactanos mediante nuestras redes sociales:</p>
          <div className="img_footer">
            <a href="mailto:lunari.shop13@gmail.com"><img src="/assets/img/correo.svg" alt="gmail" width="50px" height="50px" /></a>
            <a href="https://www.instagram.com/lunari_shop.ec" target="_blank" rel="noreferrer"><img src="/assets/img/insta.svg" alt="instagram" width="50px" height="50px" /></a>
            <a href="https://wa.me/593999810503?text=Hola%20quiero%20información" target="_blank" rel="noreferrer"><img src="/assets/img/whatsapp.svg" alt="WhatsApp" width="50px" height="50px" /></a>
          </div>
        </div>
        <div className="footer_pagos">
          <p>Métodos de pago:</p>
          <div className="img_footer">
            <img src="/assets/img/efectivo.svg" alt="pagos en efectivo" width="50px" height="50px" />
            <img src="/assets/img/tarjeta.svg" alt="pagos con tarjeta" width="50px" height="50px" />
          </div>
        </div>
        <p className="admin_acceso"><button className="admin_acceso_ancla" onClick={irAAdmin}>Administrador 🔒</button></p>
      </footer>
    </>
  );
}