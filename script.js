document.addEventListener('DOMContentLoaded', function() {

    // --- CONFIGURACIÓN PRINCIPAL ---
    var juegos = {
        rompecabezas: { completado: false, bloqueado: false },
        memorama: { completado: false, bloqueado: true },
        'sopa-letras': { completado: false, bloqueado: true },
        laberinto: { completado: false, bloqueado: true },
        historia: { completado: false, bloqueado: true }
    };
    var ordenJuegos = ['rompecabezas', 'memorama', 'sopa-letras', 'laberinto', 'historia'];

    // --- SELECCIÓN SEGURA DE ELEMENTOS ---
    var modal = document.getElementById('modal-juego');
    var contenedorJuegoModal = document.getElementById('contenedor-juego-modal');
    var cerrarModalBtn = document.querySelector('.cerrar-modal');
    var track = document.querySelector('.carousel-track');
    var slides = track ? Array.from(track.children) : [];
    var nextButton = document.querySelector('.carousel-button.next');
    var prevButton = document.querySelector('.carousel-button.prev');
    var botonCumplido = document.getElementById('boton-cumplido');
    var mensajeCumplidoDiv = document.getElementById('mensaje-cumplido');
    var galeria = document.getElementById('galeria-videos');

    // --- PERSONALIZACIÓN DE RECOMPENSAS Y TEXTOS ---
    var videos = {
        rompecabezas: 'nosotroskari.jpg',
        memorama: 'nosotroskari.jpg',
        'sopa-letras': 'nosotroskari.jpg',
        laberinto: 'nosotroskari.jpg',
        historia: 'nosotroskari.jpg'
    };
    var cumplidos = [
        "Gracias por ser la persona más increíble que conozco, Kari.",
        "Admiro tu fuerza y tu capacidad para nunca rendirte.",
        "Tu risa es mi sonido favorito en todo el mundo."
    ];

    // --- LÓGICA DEL CARRUSEL ---
    var currentIndex = 0;
    function moverSlide(targetIndex) {
        if (!slides.length) return;
        var slideAncho = slides[0].getBoundingClientRect().width;
        var margen = 20;
        var movimiento = (slideAncho + margen * 2) * targetIndex;
        var wrapperAncho = document.querySelector('.carousel-wrapper').clientWidth;
        var offset = (wrapperAncho - slideAncho) / 2;
        track.style.transform = 'translateX(-' + (movimiento - offset) + 'px)';
        slides.forEach(function(slide) { slide.classList.remove('active'); });
        slides[targetIndex].classList.add('active');
        currentIndex = targetIndex;
        actualizarCandadosCarrusel();
    }
    
    // Asignación segura de eventos
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            if (currentIndex < slides.length - 1) { moverSlide(currentIndex + 1); }
        });
    }
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            if (currentIndex > 0) { moverSlide(currentIndex - 1); }
        });
    }
    
    // --- LÓGICA DE BLOQUEO Y JUEGOS ---
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
        if (juegos[idJuego] && !juegos[idJuego].completado) {
            juegos[idJuego].completado = true;
            var indiceActual = ordenJuegos.indexOf(idJuego);
            if (indiceActual < ordenJuegos.length - 1) {
                juegos[ordenJuegos[indiceActual + 1]].bloqueado = false;
            }
            desbloquearVideo(idJuego);
            actualizarCandadosCarrusel();
            cerrarModal();
            alert('¡Felicidades! ¡Has completado el juego y desbloqueado una recompensa!');
        }
    }

    function desbloquearVideo(idJuego) {
        var videoURL = videos[idJuego];
        if (videoURL && galeria) {
            var imgElement = document.createElement('img');
            imgElement.src = videoURL;
            imgElement.style.width = '100%';
            imgElement.style.borderRadius = '10px';
            galeria.appendChild(imgElement);
        }
    }
    
    // --- MANEJO DEL MODAL ---
    var botonesJugar = document.querySelectorAll('.boton-jugar');
    if (botonesJugar.length > 0) {
        botonesJugar.forEach(function(boton) {
            boton.addEventListener('click', function() {
                var idJuego = boton.dataset.juego;
                if (juegos[idJuego] && juegos[idJuego].bloqueado) {
                    alert('¡Aún no puedes jugar a este! Completa los anteriores primero.');
                    return;
                }
                abrirModalConJuego(idJuego);
            });
        });
    }

    if (cerrarModalBtn) { cerrarModalBtn.addEventListener('click', cerrarModal); }
    window.addEventListener('click', function(event) { if (event.target == modal) { cerrarModal(); } });

    function abrirModalConJuego(idJuego) {
        if (!modal || !contenedorJuegoModal) { return; }
        contenedorJuegoModal.innerHTML = '';

        var juegoTieneLogica = false;
        if (idJuego === 'rompecabezas') { iniciarRompecabezas(); juegoTieneLogica = true; }
        else if (idJuego === 'memorama') { iniciarMemorama(); juegoTieneLogica = true; }
        else if (idJuego === 'historia') { iniciarHistoria(); juegoTieneLogica = true; }
        else if (idJuego === 'sopa-letras') { iniciarSopaDeLetras(); }
        else if (idJuego === 'laberinto') { iniciarLaberinto(); }

        if (juegoTieneLogica) {
            modal.style.display = 'block';
        }
    }

    function cerrarModal() { if (modal) { modal.style.display = 'none'; contenedorJuegoModal.innerHTML = ''; } }
    
    // --- GENERADOR DE CUMPLIDOS ---
    if(botonCumplido && mensajeCumplidoDiv) {
        botonCumplido.addEventListener('click', function() {
            var indiceAleatorio = Math.floor(Math.random() * cumplidos.length);
            mensajeCumplidoDiv.innerHTML = '<p>"' + cumplidos[indiceAleatorio] + '"</p>';
        });
    }

    // ==========================================================
    // === LÓGICA DE CADA JUEGO (COMPLETA Y CORREGIDA) ===
    // ==========================================================
    
    function iniciarRompecabezas() {
        var imagenSrc = 'nosotroskari.jpg';
        var filas = 3, columnas = 3, totalPiezas = filas * columnas;
        var piezasColocadas = 0, piezaActivaArrastrable = null, piezasBarajadas = [], piezaActualIndex = 0;

        var html = '<h2>Rompecabezas por Piezas</h2><div class="puzzle-v2-area"><div id="puzzle-panel-izquierdo"><div id="puzzle-contador">0/' + totalPiezas + ' piezas</div><div id="piezas-stack"></div></div><div id="puzzle-tablero"></div></div>';
        contenedorJuegoModal.innerHTML = html;

        var tablero = document.getElementById('puzzle-tablero');
        var stack = document.getElementById('piezas-stack');
        var contador = document.getElementById('puzzle-contador');
        
        setTimeout(function() {
            if (!tablero) return;
            var anchoTablero = tablero.clientWidth, altoTablero = tablero.clientHeight;
            var anchoPieza = anchoTablero / columnas, altoPieza = altoTablero / filas;

            for (var i = 0; i < filas; i++) {
                for (var j = 0; j < columnas; j++) {
                    var pieza = document.createElement('div');
                    pieza.classList.add('puzzle-pieza');
                    pieza.style.width = anchoPieza + 'px';
                    pieza.style.height = altoPieza + 'px';
                    pieza.style.backgroundImage = "url('" + imagenSrc + "')";
                    pieza.style.backgroundSize = anchoTablero + 'px ' + altoTablero + 'px';
                    pieza.style.backgroundPosition = '-' + (j * anchoPieza) + 'px -' + (i * altoPieza) + 'px';
                    pieza.dataset.filaCorrecta = i;
                    pieza.dataset.columnaCorrecta = j;
                    piezasBarajadas.push(pieza);
                }
            }

            piezasBarajadas.sort(function() { return Math.random() - 0.5; });
            piezasBarajadas.forEach(function(p) { if(stack) stack.appendChild(p); });
            mostrarSiguientePieza();

        }, 100);

        function mostrarSiguientePieza() {
            if (piezaActualIndex < totalPiezas) {
                var piezaAMostrar = piezasBarajadas[piezaActualIndex];
                piezaAMostrar.classList.add('pieza-activa');
                piezaAMostrar.draggable = true;
            }
        }

        document.addEventListener('dragstart', function(e) { if (e.target.classList.contains('pieza-activa')) { piezaActivaArrastrable = e.target; }});
        if(tablero) {
            tablero.addEventListener('dragover', function(e) { e.preventDefault(); });
            tablero.addEventListener('drop', function(e) {
                e.preventDefault();
                if (piezaActivaArrastrable) {
                    var filaSoltada = Math.floor(e.offsetY / (tablero.clientHeight / filas));
                    var colSoltada = Math.floor(e.offsetX / (tablero.clientWidth / columnas));

                    if (piezaActivaArrastrable.dataset.filaCorrecta == filaSoltada && piezaActivaArrastrable.dataset.columnaCorrecta == colSoltada) {
                        var piezaCorrecta = piezaActivaArrastrable;
                        piezaCorrecta.classList.remove('pieza-activa');
                        piezaCorrecta.style.position = 'absolute';
                        piezaCorrecta.style.left = (colSoltada * (tablero.clientWidth / columnas)) + 'px';
                        piezaCorrecta.style.top = (filaSoltada * (tablero.clientHeight / filas)) + 'px';
                        piezaCorrecta.draggable = false;
                        tablero.appendChild(piezaCorrecta);
                        
                        piezasColocadas++;
                        if(contador) contador.textContent = piezasColocadas + '/' + totalPiezas + ' piezas';
                        piezaActualIndex++;
                        mostrarSiguientePieza();
                        
                        if (piezasColocadas === totalPiezas) { juegoCompletado('rompecabezas'); }
                    }
                    piezaActivaArrastrable = null;
                }
            });
        }
    }

    function iniciarMemorama() {
        var imagenes = [ 'nosotroskari.jpg', 'nosotroskari.jpg', 'nosotroskari.jpg', 'nosotroskari.jpg', 'nosotroskari.jpg', 'nosotroskari.jpg' ];
        var cartasArray = imagenes.concat(imagenes).sort(function() { return 0.5 - Math.random() });
        
        contenedorJuegoModal.innerHTML = '<h2>Encuentra los Pares</h2><div class="memorama-tablero"></div>';
        var tablero = contenedorJuegoModal.querySelector('.memorama-tablero');
        if (!tablero) return;

        cartasArray.forEach(function(imgSrc, index) {
            var idUnico = index < imagenes.length ? index : index - imagenes.length;
            var cartaHTML = '<div class="memorama-carta" data-id="' + idUnico + '"><div class="cara" style="background-image: url(\'nosotroskari.jpg\')"></div><div class="dorso">?</div></div>';
            tablero.innerHTML += cartaHTML;
        });

        var cartasVolteadas = [], puedeJugar = true, paresEncontrados = 0;
        tablero.querySelectorAll('.memorama-carta').forEach(function(carta) {
            carta.addEventListener('click', function() {
                if (!puedeJugar || carta.classList.contains('volteada')) return;
                carta.classList.add('volteada');
                cartasVolteadas.push(carta);

                if (cartasVolteadas.length === 2) {
                    puedeJugar = false;
                    var carta1 = cartasVolteadas[0], carta2 = cartasVolteadas[1];
                    if (carta1.dataset.id === carta2.dataset.id) {
                        paresEncontrados++;
                        cartasVolteadas = [];
                        puedeJugar = true;
                        if (paresEncontrados === imagenes.length) { setTimeout(function() { juegoCompletado('memorama'); }, 500); }
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
        var historiaData = {
            inicio: { texto: "Recuerdas aquel día...", opciones: [{ texto: "¡Sí!", llevaA: "confusión" }]},
            confusión: { texto: "Fue cuando pensaste que el cubrebocas era un...", opciones: [{ texto: "¡Un cuervo!", llevaA: "cuervo" }]},
            cuervo: { texto: "¡Y le llamaste como a un gato! El mejor recuerdo.", opciones: [{ texto: "(Finalizar)", fin: true }] }
        };
        var nodoActual = 'inicio';

        function renderHistoria() {
            var nodo = historiaData[nodoActual];
            var html = '<h2>Nuestra anécdota</h2><div class="historia-texto"><p>' + nodo.texto + '</p></div><div class="historia-opciones">';
            nodo.opciones.forEach(function(opcion) {
                var fin = opcion.fin || false;
                html += '<button data-destino="' + opcion.llevaA + '" data-fin="' + fin + '">' + opcion.texto + '</button>';
            });
            html += '</div>';
            contenedorJuegoModal.innerHTML = html;
        }

        contenedorJuegoModal.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON') {
                if (e.target.dataset.fin === 'true') { juegoCompletado('historia'); } 
                else { nodoActual = e.target.dataset.destino; renderHistoria(); }
            }
        });
        renderHistoria();
    }

    function iniciarSopaDeLetras() {
        alert("El juego 'Sopa de Letras' se completará automáticamente por ahora. ¡Felicidades!");
        juegoCompletado('sopa-letras');
    }

    function iniciarLaberinto() {
        alert("El juego 'Laberinto' se completará automáticamente por ahora. ¡Felicidades!");
        juegoCompletado('laberinto');
    }
    
    // --- INICIALIZACIÓN AL CARGAR LA PÁGINA ---
    if (slides.length > 0) {
        moverSlide(0);
    } else {
        console.error("No se encontraron slides para el carrusel. Revisa el HTML.");
    }
});
                        
