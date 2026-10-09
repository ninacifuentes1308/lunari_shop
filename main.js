const preguntas = document.querySelectorAll(".pregunta");
console.log(preguntas);
preguntas.forEach(pregunta => {pregunta.addEventListener("click",() => {
    const respuesta = pregunta.nextElementSibling
  //  console.log(respuesta) esto para mostrarlo en la consola
    respuesta.classList.toggle("activa");  //para que se presente en la pagina web
    const icono= pregunta.querySelector("span")
    if (respuesta.classList.contains("activa")) {
        icono.textContent="-" //textCont indica a como va a cambiar el texto
    } else {
        icono.textContent="+"
    }
})}) 