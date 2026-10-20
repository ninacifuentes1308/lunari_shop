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
document.querySelectorAll(".btn_carrito").forEach(boton => {
    boton.addEventListener("click",(e) => {
        const tarjeta = boton.closest(".producto");
        let id = tarjeta.dataset.id;
        let nombre = tarjeta.dataset.nombre;
        let img = tarjeta.dataset.img;
        let precioBase = parseFloat(tarjeta.dataset.precio) || 0;
        let variante = "unico";
        let precioFinal = precioBase;
        let elegido = null;
        let varianteNombre = "";

        const seleccionado = tarjeta.querySelector(".opcion");
        if (seleccionado) {
            variante = seleccionado.value;
            elegido = seleccionado.options[seleccionado.selectedIndex];
            varianteNombre = elegido.textContent.trim();
            if (elegido.dataset.precio) {
                precioFinal = parseFloat(elegido.dataset.precio);
            }
        }
        const claveunica = `${id}_${variante}`;
        //Para llamar el carrito o crear
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        let carritoexistente = carrito.find(item => "${item.id}_{item.variante}" === claveunica);

        if (carritoexistente) {
            carritoexistente.cantidad += 1;
        } else {
            carrito.push({
                id: id,
                nombre: nombre,
                img: img,
                variante: variante,
                varianteNombre: varianteNombre,
                precio: precioFinal,
                cantidad: 1
            });
        }
        localStorage.setItem("carrito",JSON.stringify(carrito));
        actualizarContador();
        console.log("Carrito", carrito);

        boton.textContent = "¡Agregado al carrito!";
        setTimeout(()=>boton.textContent = "Agregar al carrito",1000);
    })
})
function actualizarContador() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let total = carrito.reduce((sum,p) => sum + p.cantidad, 0);
    let contador = document.getElementById('contador_carrito');
    if (contador) {
        contador.textContent = total;
    }
}
actualizarContador();