/* =============================================================
   Carousel Presentation Viewer – Carousel Logic
   Universidad Francisco de Paula Santander
   ============================================================= */

/** Total number of slides */
const TOTAL = 3;

/** Index of the slide currently in CENTER position */
let current = 0;

/** References to DOM slide elements */
const slides = [
    document.getElementById('slide-0'),
    document.getElementById('slide-1'),
    document.getElementById('slide-2'),
];

/**
 * Visual positions array – positions[i] is the current
 * position class suffix for slides[i].
 *
 * Initial state:
 *   slide-0 → center
 *   slide-1 → right
 *   slide-2 → left
 */
let positions = ['center', 'right', 'left'];

/**
 * Applies the current positions[] state to the DOM by
 * setting each slide's className.
 */
function applyPositions() {
    slides.forEach((el, i) => {
        el.className = 'slide slide-' + positions[i];
    });
}

/**
 * Rotates the carousel one step.
 * @param {number} direction  +1 = next, -1 = previous
 */
function moveCarousel(direction) {
    if (direction === 1) {
        // Next: center→left, right→center, left→right (circular)
        positions = positions.map(p => {
            if (p === 'center') return 'left';
            if (p === 'right')  return 'center';
            if (p === 'left')   return 'right';
            return 'hidden';
        });
    } else {
        // Prev: center→right, left→center, right→left (circular)
        positions = positions.map(p => {
            if (p === 'center') return 'right';
            if (p === 'left')   return 'center';
            if (p === 'right')  return 'left';
            return 'hidden';
        });
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

/** Refreshes which dot is highlighted to match current center slide. */
function updateDots() {
    dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
        d.className = 'dot' + (i === current ? ' active' : '');
    });
}

/**
 * Navigates directly to a target slide (one step at a time).
 * @param {number} target  Index of the desired slide
 */
function goToSlide(target) {
    const targetPos = positions[target];
    if (targetPos === 'center') return;
    if (targetPos === 'right')  moveCarousel(1);
    else if (targetPos === 'left') moveCarousel(-1);
}

/* ── Footer progress ── */
function updateFooter() {
    document.getElementById('footer-slide-label').textContent =
        'Slide ' + (current + 1) + ' of ' + TOTAL;
    document.getElementById('footer-progress').style.width =
        Math.round(((current + 1) / TOTAL) * 100) + '%';
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
