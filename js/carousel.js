/* =============================================================
   Carousel Presentation Viewer – Carousel Logic
   Universidad Francisco de Paula Santander
   ============================================================= */

/** Total number of slides */
const TOTAL = 13;

/** Index of the slide currently in CENTER position */
let current = 0;

/** References to DOM slide elements */
const slides = [
    document.getElementById('slide-0'),
    document.getElementById('slide-1'),
    document.getElementById('slide-2'),
    document.getElementById('slide-3'),
    document.getElementById('slide-4'),
    document.getElementById('slide-5'),
    document.getElementById('slide-6'),
    document.getElementById('slide-7'),
    document.getElementById('slide-8'),
    document.getElementById('slide-9'),
    document.getElementById('slide-10'),
    document.getElementById('slide-11'),
    document.getElementById('slide-12'),
];

/**
 * Visual positions array. 
 * For 13 slides, the order from left-to-right in a circle is:
 * center, right, hidden-right, hidden, hidden, hidden, hidden, hidden, hidden, hidden, hidden, hidden-left, left
 */
let positions = ['center', 'right', 'hidden-right', 'hidden', 'hidden', 'hidden', 'hidden', 'hidden', 'hidden', 'hidden', 'hidden', 'hidden-left', 'left'];

/**
 * Applies the current positions[] state to the DOM by
 * setting each slide's className.
 */
function applyPositions() {
    slides.forEach((el, i) => {
        // Envolvemos en un chequeo por si alguna no existe en el DOM
        if(el) el.className = 'slide slide-' + positions[i];
    });
}

/**
 * Rotates the carousel one step by shifting the array.
 * @param {number} direction  +1 = next, -1 = previous
 */
function moveCarousel(direction) {
    if (direction === 1) {
        // Next: Movemos el último elemento al principio del arreglo
        positions.unshift(positions.pop());
    } else {
        // Prev: Movemos el primer elemento al final del arreglo
        positions.push(positions.shift());
    }

    current = positions.indexOf('center');

    applyPositions();
    updateDots();
    updateFooter();
}

/* ── Dot indicators ── */
const dotsContainer = document.getElementById('dots');

for (let i = 0; i < TOTAL; i++) {
    const btn = document.createElement('button');
    btn.className = 'dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', 'Slide ' + (i + 1));
    btn.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(btn);
}

function updateDots() {
    dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
        d.className = 'dot' + (i === current ? ' active' : '');
    });
}

/**
 * Navigates directly to a target slide taking the shortest path.
 * @param {number} target  Index of the desired slide
 */
function goToSlide(target) {
    if (positions[target] === 'center') return;
    
    // Calculamos si es más rápido ir por la derecha o por la izquierda
    let diff = target - current;
    
    // Ajuste circular para buscar la ruta más corta
    if (diff > TOTAL / 2) diff -= TOTAL;
    if (diff < -TOTAL / 2) diff += TOTAL;

    if (diff > 0) {
        for(let i = 0; i < diff; i++) moveCarousel(1);
    } else {
        for(let i = 0; i < Math.abs(diff); i++) moveCarousel(-1);
    }
}

/* ── Footer progress ── */
function updateFooter() {
    const label = document.getElementById('footer-slide-label');
    const progress = document.getElementById('footer-progress');
    
    if(label) label.textContent = 'Slide ' + (current + 1) + ' of ' + TOTAL;
    if(progress) progress.style.width = Math.round(((current + 1) / TOTAL) * 100) + '%';
}

/* ── Keyboard navigation ── */
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') moveCarousel(1);
    if (e.key === 'ArrowLeft')  moveCarousel(-1);
});

/* ── Initialization ── */
applyPositions();
updateDots();
updateFooter();