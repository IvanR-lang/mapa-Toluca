// =========================================================================
// 1. SIMULADOR DINÁMICO DE BIODEGRADACIÓN
// =========================================================================

const selectorTiempo = document.getElementById('selectorTiempo');
const etiquetaTiempo = document.getElementById('etiquetaTiempo');
const vasoEfimero = document.getElementById('vasoEfimero');
const estadoEfimero = document.getElementById('estadoEfimero');

// Función que actualiza el estado visual del vaso según el tiempo seleccionado
function actualizarSimulador(valor) {
    if (valor == 0) {
        etiquetaTiempo.innerText = "Día 1 (Recién desechado)";
        estadoEfimero.innerText = "Intacto, resistente y funcional.";
        // Vaso en su estado inicial
        vasoEfimero.style.transform = "scale(1)";
        vasoEfimero.style.opacity = "1";
        vasoEfimero.style.filter = "blur(0px)";
    } 
    else if (valor > 0 && valor <= 33) {
        etiquetaTiempo.innerText = "Mes 1 (Inicio del compostaje)";
        estadoEfimero.innerText = "Los microorganismos y la humedad empiezan a ablandar la grenetina.";
        // Empieza a perder tamaño ligeramente
        vasoEfimero.style.transform = "scale(0.85)";
        vasoEfimero.style.opacity = "0.8";
        vasoEfimero.style.filter = "blur(0.5px)";
    } 
    else if (valor > 33 && valor <= 66) {
        etiquetaTiempo.innerText = "Mes 3 (Descomposición avanzada)";
        estadoEfimero.innerText = "El bioplástico se fragmenta por completo sin liberar ningún residuo tóxico.";
        // Se reduce más y se vuelve más transparente
        vasoEfimero.style.transform = "scale(0.5) translateY(20px)";
        vasoEfimero.style.opacity = "0.4";
        vasoEfimero.style.filter = "blur(1.5px)";
    } 
    else if (valor > 66 && valor < 100) {
        etiquetaTiempo.innerText = "Mes 5 (Integración al suelo)";
        estadoEfimero.innerText = "La glicerina y grenetina se degradan casi al 100%, volviendo a la tierra.";
        // Casi invisible
        vasoEfimero.style.transform = "scale(0.2) translateY(50px)";
        vasoEfimero.style.opacity = "0.1";
        vasoEfimero.style.filter = "blur(3px)";
    } 
    else if (valor == 100) {
        etiquetaTiempo.innerText = "¡Pocos meses después! (Economía Circular)";
        estadoEfimero.innerText = "¡Nutrientes orgánicos! Se convirtió en parte de la naturaleza otra vez.";
        // Desaparece por completo
        vasoEfimero.style.transform = "scale(0)";
        vasoEfimero.style.opacity = "0";
    }
}

// Escuchar los movimientos de la barra deslizable
selectorTiempo.addEventListener('input', (e) => {
    actualizarSimulador(e.target.value);
});


// =========================================================================
// 2. ANIMACIÓN DE APARICIÓN SUAVE (SCROLL REVEAL)
// =========================================================================

const tarjetas = document.querySelectorAll('.tarjeta');

const verificarTarjetasScroll = () => {
    // Definimos el punto de activación un 15% antes del fondo de la pantalla
    const triggerBottom = window.innerHeight * 0.85;

    tarjetas.forEach(tarjeta => {
        const tarjetaTop = tarjeta.getBoundingClientRect().top;

        if (tarjetaTop < triggerBottom) {
            // Añade la clase CSS que cambia la opacidad a 1 y sube el elemento
            tarjeta.classList.add('visible');
        }
    });
};

// Escuchar el evento de scroll en la página
window.addEventListener('scroll', verificarTarjetasScroll);

// Ejecutar una vez al cargar por si las tarjetas ya están visibles al inicio
window.addEventListener('DOMContentLoaded', () => {
    verificarTarjetasScroll();
    actualizarSimulador(0); // Forzar estado inicial del simulador
});
