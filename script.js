document.addEventListener('DOMContentLoaded', function() {

    // --- CONFIGURACIÓN PRINCIPAL ---
    var juegos = { rompecabezas: { completado: false, bloqueado: false }, memorama: { completado: false, bloqueado: true }, 'sopa-letras': { completado: false, bloqueado: true }, laberinto: { completado: false, bloqueado: true }, historia: { completado: false, bloqueado: true } };
    var ordenJuegos = ['rompecabezas', 'memorama', 'sopa-letras', 'laberinto', 'historia'];
    var modal = document.getElementById('modal-juego'), contenedorJuegoModal = document.getElementById('contenedor-juego-modal'), cerrarModalBtn = document.querySelector('.cerrar-modal'), track = document.querySelector('.carousel-track'), slides = track ? Array.from(track.children) : [], nextButton = document.querySelector('.carousel-button.next'), prevButton = document.querySelector('.carousel-button.prev'), botonCumplido = document.getElementById('boton-cumplido'), mensajeCumplidoDiv = document.getElementById('mensaje-cumplido'), galeria = document.getElementById('galeria-videos');
    var videos = { rompecabezas: 'nosotroskari.jpg', memorama: 'nosotroskari.jpg', 'sopa-letras': 'nosotroskari.jpg', laberinto: 'nosotroskari.jpg', historia: 'nosotroskari.jpg' };
    var cumplidos = ["Gracias por ser la persona más increíble que conozco, Kari.", "Admiro tu fuerza y tu capacidad para nunca rendirte.", "Tu risa es mi sonido favorito en todo el mundo."];

    // --- LÓGICA DEL CARRUSEL ---
    var currentIndex = 0;
    function moverSlide(targetIndex){if(!slides.length)return;var slideAncho=slides[0].getBoundingClientRect().width,margen=20,movimiento=(slideAncho+margen*2)*targetIndex,wrapperAncho=document.querySelector('.carousel-wrapper').clientWidth,offset=(wrapperAncho-slideAncho)/2;track.style.transform='translateX(-'+(movimiento-offset)+'px)';slides.forEach(function(slide){slide.classList.remove('active')});slides[targetIndex].classList.add('active');currentIndex=targetIndex;actualizarCandadosCarrusel()}
    if(nextButton){nextButton.addEventListener('click',function(){if(currentIndex<slides.length-1){moverSlide(currentIndex+1)}})}
    if(prevButton){prevButton.addEventListener('click',function(){if(currentIndex>0){moverSlide(currentIndex-1)}})}
    
    // --- LÓGICA DE BLOQUEO Y JUEGOS ---
    function actualizarCandadosCarrusel(){slides.forEach(function(slide){var idJuego=slide.dataset.juego;var juego=juegos[idJuego];if(!slide.querySelector('.slide-candado')){var candadoDiv=document.createElement('div');candadoDiv.className='slide-candado';slide.appendChild(candadoDiv)}var candado=slide.querySelector('.slide-candado');if(juego.bloqueado){candado.classList.add('visible');candado.textContent='🔒'}else{candado.classList.remove('visible')}})}
    function juegoCompletado(idJuego){if(juegos[idJuego]&&!juegos[idJuego].completado){juegos[idJuego].completado=true;var indiceActual=ordenJuegos.indexOf(idJuego);if(indiceActual<ordenJuegos.length-1){juegos[ordenJuegos[indiceActual+1]].bloqueado=false}desbloquearVideo(idJuego);actualizarCandadosCarrusel();cerrarModal();alert('¡Felicidades! ¡Has completado el juego y desbloqueado una recompensa!')}}
    function desbloquearVideo(idJuego){var videoURL=videos[idJuego];if(videoURL&&galeria){var imgElement=document.createElement('img');imgElement.src=videoURL;imgElement.style.width='100%';imgElement.style.borderRadius='10px';galeria.appendChild(imgElement)}}
    
    // --- MANEJO DEL MODAL ---
    document.querySelectorAll('.boton-jugar').forEach(function(boton){boton.addEventListener('click',function(){var idJuego=boton.dataset.juego;if(juegos[idJuego]&&juegos[idJuego].bloqueado){alert('¡Aún no puedes jugar a este!');return}abrirModalConJuego(idJuego)})});
    if(cerrarModalBtn){cerrarModalBtn.addEventListener('click',cerrarModal)}
    window.addEventListener('click',function(event){if(event.target==modal){cerrarModal()}});
    function abrirModalConJuego(idJuego){if(!modal||!contenedorJuegoModal){return}contenedorJuegoModal.innerHTML='';var juegoTieneLogica=false;if(idJuego==='rompecabezas'){iniciarRompecabezas();juegoTieneLogica=true}else if(idJuego==='memorama'){iniciarMemorama();juegoTieneLogica=true}else if(idJuego==='historia'){iniciarHistoria();juegoTieneLogica=true}else if(idJuego==='sopa-letras'){iniciarSopaDeLetras()}else if(idJuego==='laberinto'){iniciarLaberinto()}if(juegoTieneLogica){modal.style.display='block'}}
    function cerrarModal(){if(modal){modal.style.display='none';contenedorJuegoModal.innerHTML=''}}
    
    // --- GENERADOR DE CUMPLIDOS ---
    if(botonCumplido&&mensajeCumplidoDiv){botonCumplido.addEventListener('click',function(){var i=Math.floor(Math.random()*cumplidos.length);mensajeCumplidoDiv.innerHTML='<p>"'+cumplidos[i]+'"</p>'})}

    // ==========================================================
    // === LÓGICA DE CADA JUEGO (NUEVO ROMPECABEZAS) ===
    // ==========================================================
    
    function iniciarRompecabezas() {
        // ========== ¡¡¡MODIFICA ESTA LÍNEA!!! ==========
        var imagenSrc = 'nosotroskari.jpg';
        // ===============================================
        var filas = 3, columnas = 3, totalPiezas = filas * columnas;
        var piezasColocadas = 0, piezaActivaArrastrable = null, piezasBarajadas = [], piezaActualIndex = 0;

        // --- Definición de la forma de la pieza de puzzle (SVG Path) ---
        // M=Mover a, L=Línea a, C=Curva a. Es complejo, pero define la forma.
        var puzzlePath = 'M30,15 C45,5 55,5 70,15 C85,25 85,45 70,55 L70,85 C70,95 60,105 50,105 L20,105 C10,105 0,95 0,85 L0,55 C-15,45 -15,25 0,15 L30,15 Z';

        // 1. Crear HTML del juego
        var html = '<h2>Rompecabezas con Forma</h2><div class="puzzle-v2-area"><div id="puzzle-panel-izquierdo"><div id="puzzle-contador">0/' + totalPiezas + ' piezas</div><div id="piezas-stack"></div></div><div id="puzzle-tablero"></div></div>';
        contenedorJuegoModal.innerHTML = html;

        var tablero = document.getElementById('puzzle-tablero');
        var stack = document.getElementById('piezas-stack');
        var contador = document.getElementById('puzzle-contador');
        
        setTimeout(function() {
            if (!tablero) return;
            var anchoTablero = tablero.clientWidth, altoTablero = tablero.clientHeight;
            var anchoPieza = anchoTablero / columnas, altoPieza = altoTablero / filas;
            
            // 2. Crear las piezas y los huecos en el tablero
            for (var i = 0; i < filas; i++) {
                for (var j = 0; j < columnas; j++) {
                    // --- Crear el HUECO en el tablero ---
                    var holeSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    holeSvg.setAttribute('class', 'puzzle-hole-svg');
                    holeSvg.style.left = (j * anchoPieza) + 'px';
                    holeSvg.style.top = (i * altoPieza) + 'px';
                    holeSvg.setAttribute('viewBox', '0 0 100 100'); // ViewBox para la forma de la pieza
                    
                    var holePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    holePath.setAttribute('d', puzzlePath);
                    holePath.setAttribute('class', 'puzzle-hole-path');
                    
                    holeSvg.appendChild(holePath);
                    tablero.appendChild(holeSvg);
                    
                    // --- Crear la PIEZA del rompecabezas ---
                    var piezaSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    piezaSvg.setAttribute('class', 'puzzle-pieza-svg');
                    piezaSvg.setAttribute('viewBox', '0 0 100 100');
                    
                    var clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
                    var clipPathId = 'clip_' + i + '_' + j;
                    clipPath.setAttribute('id', clipPathId);
                    
                    var clipPathShape = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    clipPathShape.setAttribute('d', puzzlePath);
                    clipPath.appendChild(clipPathShape);
                    
                    var image = document.createElementNS("http://www.w3.org/2000/svg", "image");
                    image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imagenSrc);
                    image.setAttribute('clip-path', 'url(#' + clipPathId + ')');
                    // Mapear la imagen completa al área de esta pieza
                    image.setAttribute('width', anchoTablero);
                    image.setAttribute('height', altoTablero);
                    image.setAttribute('x', -j * anchoPieza);
                    image.setAttribute('y', -i * altoPieza);
                    
                    piezaSvg.appendChild(clipPath);
                    piezaSvg.appendChild(image);
                    
                    piezaSvg.dataset.filaCorrecta = i;
                    piezaSvg.dataset.columnaCorrecta = j;
                    piezasBarajadas.push(piezaSvg);
                }
            }

            // 3. Barajar y mostrar la primera pieza
            piezasBarajadas.sort(function() { return Math.random() - 0.5; });
            piezasBarajadas.forEach(function(p) { if(stack) stack.appendChild(p); });
            mostrarSiguientePieza();

        }, 100);

        function mostrarSiguientePieza() {
            if (piezaActualIndex < totalPiezas) {
                var piezaAMostrar = piezasBarajadas[piezaActualIndex];
                piezaAMostrar.classList.add('pieza-activa');
                piezaAMostrar.draggable = true;
                
                piezaAMostrar.addEventListener('dragstart', function(e) {
                    piezaActivaArrastrable = e.target.closest('.puzzle-pieza-svg');
                    setTimeout(function() { if (piezaActivaArrastrable) piezaActivaArrastrable.style.opacity = '0.5'; }, 0);
                });
                
                piezaAMostrar.addEventListener('dragend', function(e) {
                    var target = e.target.closest('.puzzle-pieza-svg');
                    if (target) target.style.opacity = '1';
                });
            }
        }
        
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
                        piezaCorrecta.style.width = (tablero.clientWidth / columnas) + 'px';
                        piezaCorrecta.style.height = (tablero.clientHeight / filas) + 'px';
                        piezaCorrecta.draggable = false;
                        
                        // Movemos la pieza del stack al tablero
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
    // ... Las funciones de memorama, historia, etc. se mantienen igual ...
    function iniciarMemorama(){/*...código de memorama sin cambios...*/};
    function iniciarHistoria(){/*...código de historia sin cambios...*/};
    function iniciarSopaDeLetras(){alert("El juego 'Sopa de Letras' se completará automáticamente.");juegoCompletado('sopa-letras')};
    function iniciarLaberinto(){alert("El juego 'Laberinto' se completará automáticamente.");juegoCompletado('laberinto')};

    // --- INICIALIZACIÓN AL CARGAR LA PÁGINA ---
    if (slides.length > 0) { moverSlide(0); }
});
                                                             
