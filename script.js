// Este código se ejecuta cuando toda la página HTML se ha cargado.
document.addEventListener('DOMContentLoaded', function() {

    // --- OBJETOS Y VARIABLES PRINCIPALES ---
    var juegos = {
        rompecabezas: { completado: false, bloqueado: false },
        memorama: { completado: false, bloqueado: true },
        'sopa-letras': { completado: false, bloqueado: true },
        laberinto: { completado: false, bloqueado: true },
        historia: { completado: false, bloqueado: true }
    };
    var ordenJuegos = ['rompecabezas', 'memorama', 'sopa-letras', 'laberinto', 'historia'];

    var modal = document.getElementById('modal-juego');
    var contenedorJuegoModal = document.getElementById('contenedor-juego-modal');
    var cerrarModalBtn = document.querySelector('.cerrar-modal');

    // --- VIDEOS DE RECOMPENSA ---
    var videos = {
        // REEMPLAZA ESTAS URLS CON LAS DE TUS VIDEOS
        rompecabezas: 'kari.mp4',
        memorama: 'kari.mp4',
        'sopa-letras': 'kari.mp4',
        laberinto: 'kari.mp4',
        historia: 'kari.mp4'
    };

    // --- CUMPLIDOS ---
    var cumplidos = [
        // REEMPLAZA O AÑADE TUS PROPIOS CUMPLIDOS
        "Gracias por ser la persona más increíble que conozco.",
        "Admiro tu fuerza y tu capacidad para nunca rendirte.",
        "Tu risa es mi sonido favorito en todo el mundo."
    ];


    // --- LÓGICA DEL CARRUSEL ---
    var track = document.querySelector('.carousel-track');
    var slides = Array.from(track.children);
    var nextButton = document.querySelector('.carousel-button.next');
    var prevButton = document.querySelector('.carousel-button.prev');
    var currentIndex = 0;

    function moverSlide(targetIndex) {
        var slideAncho = slides[0].getBoundingClientRect().width;
        var margen = 20; // El margen entre slides
        var movimiento = (slideAncho + margen * 2) * targetIndex;
        
        var wrapperAncho = document.querySelector('.carousel-wrapper').clientWidth;
        var offset = (wrapperAncho - slideAncho) / 2;

        track.style.transform = 'translateX(-' + (movimiento - offset) + 'px)';

        slides.forEach(function(slide) { slide.classList.remove('active'); });
        slides[targetIndex].classList.add('active');
        currentIndex = targetIndex;
        actualizarCandadosCarrusel();
    }

    nextButton.addEventListener('click', function() {
        if (currentIndex < slides.length - 1) { moverSlide(currentIndex + 1); }
    });

    prevButton.addEventListener('click', function() {
        if (currentIndex > 0) { moverSlide(currentIndex - 1); }
    });
    
    // --- LÓGICA DE BLOQUEO Y DESBLOQUEO ---
    function actualizarCandadosCarrusel() {
        slides.forEach(function(slide) {
            var idJuego = slide.dataset.juego;
            var juego = juegos[idJuego];
            
            if (!slide.querySelector('.slide-candado')) {
                var candadoDiv = document.createElement('div');
                candadoDiv.className = 'slide-candado';
                slide.appendChild(candadoDiv);
            }
            
            var candado = slide.querySelector('.slide-candado');
            if (juego.bloqueado) {
                candado.classList.add('visible');
                candado.textContent = '🔒';
            } else {
                candado.classList.remove('visible');
            }
        });
    }

    function juegoCompletado(idJuego) {
        if (!juegos[idJuego].completado) {
            juegos[idJuego].completado = true;
            
            var indiceActual = ordenJuegos.indexOf(idJuego);
            if (indiceActual < ordenJuegos.length - 1) {
                var siguienteJuegoId = ordenJuegos[indiceActual + 1];
                juegos[siguienteJuegoId].bloqueado = false;
            }

            desbloquearVideo(idJuego);
            actualizarCandadosCarrusel();
            cerrarModal();
            alert('¡Felicidades! ¡Has completado el juego y desbloqueado una recompensa!');
        }
    }
    
    function desbloquearVideo(idJuego) {
        var galeria = document.getElementById('galeria-videos');
        var videoURL = videos[idJuego];
        if (videoURL && galeria) {
            var videoElement = document.createElement('video');
            videoElement.src = videoURL;
            videoElement.controls = true;
            galeria.appendChild(videoElement);
        }
    }
    
    // --- MANEJO DEL MODAL ---
    document.querySelectorAll('.boton-jugar').forEach(function(boton) {
        boton.addEventListener('click', function() {
            var idJuego = boton.dataset.juego;
            if (juegos[idJuego] && juegos[idJuego].bloqueado) {
                alert('¡Aún no puedes jugar a este! Completa los anteriores primero.');
                return;
            }
            abrirModalConJuego(idJuego);
        });
    });

    if(cerrarModalBtn) cerrarModalBtn.addEventListener('click', cerrarModal);
    window.addEventListener('click', function(event) { if (event.target == modal) { cerrarModal(); }});

    function abrirModalConJuego(idJuego) {
        if (!modal || !contenedorJuegoModal) return;
        contenedorJuegoModal.innerHTML = '';
        
        var juegoIniciado = false;
        if (idJuego === 'rompecabezas') { iniciarRompecabezas(); juegoIniciado = true; }
        else if (idJuego === 'memorama') { iniciarMemorama(); juegoIniciado = true; }
        else if (idJuego === 'historia') { iniciarHistoria(); juegoIniciado = true; }
        
        if (juegoIniciado) {
            modal.style.display = 'block';
        } else {
            alert('Este juego se completará automáticamente. ¡Felicidades!');
            juegoCompletado(idJuego);
        }
    }

    function cerrarModal() {
        if(modal) {
            modal.style.display = 'none';
            contenedorJuegoModal.innerHTML = '';
        }
    }
    
    // --- GENERADOR DE CUMPLIDOS ---
    var botonCumplido = document.getElementById('boton-cumplido');
    var mensajeCumplidoDiv = document.getElementById('mensaje-cumplido');
    if(botonCumplido) {
        botonCumplido.addEventListener('click', function() {
            var indiceAleatorio = Math.floor(Math.random() * cumplidos.length);
            mensajeCumplidoDiv.innerHTML = '<p>"' + cumplidos[indiceAleatorio] + '"</p>';
        });
    }

    // ==========================================================
    // === LÓGICA DE CADA JUEGO (COMPLETA) ===
    // ==========================================================
    
    function iniciarRompecabezas() {
        // ========== ¡¡¡MODIFICA ESTA LÍNEA!!! ==========
        var imagenSrc = 'nosotroskari.jpg';
        // ===============================================
        var filas = 4; 
        var columnas = 4;

        var html = '<div class="puzzle-area"><h2>¡Arma la foto!</h2><div class="puzzle-contenedor"><div id="puzzle-tablero"></div><div id="piezas-contenedor"></div></div></div>';
        contenedorJuegoModal.innerHTML = html;

        var tablero = document.getElementById('puzzle-tablero');
        var contenedorPiezas = document.getElementById('piezas-contenedor');
        
        setTimeout(function() {
            var anchoTablero = tablero.clientWidth; 
            var altoTablero = tablero.clientHeight;
            var anchoPieza = anchoTablero / columnas; 
            var altoPieza = altoTablero / filas;
            var piezas = []; 
            var piezaActiva = null;

            for (var i = 0; i < filas; i++) {
                for (var j = 0; j < columnas; j++) {
                    var pieza = document.createElement('div');
                    pieza.draggable = true; 
                    pieza.classList.add('puzzle-pieza');
                    
                    pieza.style.width = anchoPieza + 'px';
                    pieza.style.height = altoPieza + 'px';
                    pieza.style.backgroundImage = "url('" + imagenSrc + "')";
                    pieza.style.backgroundSize = anchoTablero + 'px ' + altoTablero + 'px';
                    pieza.style.backgroundPosition = '-' + (j * anchoPieza) + 'px -' + (i * altoPieza) + 'px';
                    
                    pieza.dataset.ordenCorrecto = i + '-' + j;
                    piezas.push(pieza);
                }
            }

            piezas.sort(function() { return Math.random() - 0.5 }).forEach(function(p) { contenedorPiezas.appendChild(p);});

            document.addEventListener('dragstart', function(e) { if (e.target.classList.contains('puzzle-pieza')) { piezaActiva = e.target; }});
            tablero.addEventListener('dragover', function(e) { e.preventDefault(); });
            tablero.addEventListener('drop', function(e) {
                e.preventDefault();
                if (piezaActiva) {
                    var col = Math.floor(e.offsetX / anchoPieza);
                    var fil = Math.floor(e.offsetY / altoPieza);
                    var ordenActual = fil + '-' + col;
                    
                    if (piezaActiva.dataset.ordenCorrecto === ordenActual) {
                        piezaActiva.style.position = 'absolute';
                        piezaActiva.style.left = (col * anchoPieza) + 'px';
                        piezaActiva.style.top = (fil * altoPieza) + 'px';
                        piezaActiva.draggable = false;
                        tablero.appendChild(piezaActiva);
                        if (tablero.children.length === (filas * columnas)) {
                            juegoCompletado('rompecabezas');
                        }
                    }
                }
            });
        }, 100);
    }

    function iniciarMemorama() {
        // ========== ¡¡¡MODIFICA ESTAS LÍNEAS!!! ==========
        var imagenes = [
            'karipelo.jpg', 'anciano.jpg',
            'nosotroskari.jpg', 'Bambu.jpg',
            'kariale.jpg', 'nosotroskari.jpg'
        ];
        // ================================================
        var cartasArray = imagenes.concat(imagenes).sort(function() { return 0.5 - Math.random() });
        
        contenedorJuegoModal.innerHTML = '<h2>Encuentra los Pares</h2><div class="memorama-tablero"></div>';
        var tablero = contenedorJuegoModal.querySelector('.memorama-tablero');

        cartasArray.forEach(function(imgSrc) {
            var cartaHTML = '<div class="memorama-carta" data-imagen="' + imgSrc + '">' +
                            '<div class="cara" style="background-image: url(\'' + imgSrc + '\')"></div>' +
                            '<div class="dorso">?</div>' +
                            '</div>';
            tablero.innerHTML += cartaHTML;
        });

        var cartasVolteadas = [];
        var puedeJugar = true;
        var paresEncontrados = 0;

        tablero.querySelectorAll('.memorama-carta').forEach(function(carta) {
            carta.addEventListener('click', function() {
                if (!puedeJugar || carta.classList.contains('volteada')) return;
                
                carta.classList.add('volteada');
                cartasVolteadas.push(carta);

                if (cartasVolteadas.length === 2) {
                    puedeJugar = false;
                    var carta1 = cartasVolteadas[0];
                    var carta2 = cartasVolteadas[1];

                    if (carta1.dataset.imagen === carta2.dataset.imagen) {
                        paresEncontrados++;
                        cartasVolteadas = [];
                        puedeJugar = true;
                        if (paresEncontrados === imagenes.length) {
                            setTimeout(function() { juegoCompletado('memorama'); }, 500);
                        }
                    } else {
                        setTimeout(function() {
                            carta1.classList.remove('volteada');
                            carta2.classList.remove('volteada');
                            cartasVolteadas = [];
                            puedeJugar = true;
                        }, 1200);
                    }
                }
            });
        });
    }

    function iniciarHistoria() {
        // ========== PUEDES MODIFICAR LA HISTORIA AQUÍ ==========
        var historiaData = {
            inicio: {
                texto: "Recuerdas aquel día en la escuela, ¿cuando vimos algo oscuro en el patio y no sabíamos qué era?",
                opciones: [
                    { texto: "¡Claro que sí! ¡Qué risa!", llevaA: "confusión" },
                    { texto: "Uhm... no mucho, recuérdame.", llevaA: "confusión" }
                ]
            },
            confusión: {
                texto: "Era un simple cubrebocas negro tirado, pero tú, con tu gran corazón, pensaste que era un animalito herido. ¿Qué creíste que era?",
                opciones: [ { texto: "¡Un cuervo bebé!", llevaA: "cuervo" }, { texto: "Un ratoncito.", llevaA: "incorrecto" } ]
            },
            incorrecto: {
                texto: "¡No! ¡Fue algo más gracioso! ¡Algo que vuela!",
                opciones: [{ texto: "Ah, ¡ya! ¡Un cuervo!", llevaA: "cuervo" }]
            },
            cuervo: {
                texto: "¡EXACTO! Y lo mejor fue cuando te acercaste y empezaste a llamarlo como a un gatito: '¡Mishi, mishi, ven!'. ¡Casi muero de la risa! Gracias por ese y tantos otros momentos.",
                opciones: [{ texto: "Jajaja, ¡qué buen recuerdo! (Finalizar)", fin: true }]
            }
        };
        // ==========================================================

        var nodoActual = 'inicio';

        function renderHistoria() {
            var nodo = historiaData[nodoActual];
            var html = '<h2>Nuestra anécdota del "Cuervo-Gato"</h2>';
            html += '<div class="historia-texto"><p>' + nodo.texto + '</p></div>';
            html += '<div class="historia-opciones">';
            nodo.opciones.forEach(function(opcion) {
                var fin = opcion.fin || false;
                html += '<button data-destino="' + opcion.llevaA + '" data-fin="' + fin + '">' + opcion.texto + '</button>';
            });
            html += '</div>';
            contenedorJuegoModal.innerHTML = html;
        }

        contenedorJuegoModal.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON') {
                if (e.target.dataset.fin === 'true') {
                    juegoCompletado('historia');
                } else {
                    nodoActual = e.target.dataset.destino;
                    renderHistoria();
                }
            }
        });

        renderHistoria();
    }

    // --- INICIALIZACIÓN AL CARGAR LA PÁGINA ---
    moverSlide(0);
    actualizarCandadosCarrusel();
})
/* ============================================== */
/* === NUEVOS ESTILOS PARA EL ROMPECABEZAS v2 === */
/* ============================================== */

.puzzle-v2-area {
    display: flex;
    gap: 30px;
    align-items: flex-start;
    justify-content: center;
}

#puzzle-panel-izquierdo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

#puzzle-contador {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-principal);
    background: #f0f0f0;
    padding: 10px 20px;
    border-radius: 10px;
}

#piezas-stack {
    width: 170px;
    height: 170px;
    border: 2px dashed #ccc;
    border-radius: 10px;
    position: relative; /* Clave para apilar las piezas */
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f9f9f9;
}

#piezas-stack .puzzle-pieza {
    /* Todas las piezas estarán una encima de otra */
    position: absolute;
    /* Ocultas por defecto */
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease;
}

#piezas-stack .pieza-activa {
    /* La pieza activa se hace visible */
    opacity: 1;
    visibility: visible;
    z-index: 100;
}
