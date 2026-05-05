(function () {
  // ── Create overlay elements ──────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  document.body.appendChild(overlay);

  let flyCard = null;
  let activeItem = null;
  let isOpen = false;

  // ── Open lightbox ────────────────────────────────────────────────────
  function openLightbox(item) {
    if (flyCard || activeItem) {
      closeLightbox(true);
    }
    if (isOpen) return;
    isOpen = true;
    activeItem = item;

    const rect = item.getBoundingClientRect();

    // Clone the masonry item into a fixed flying card
    flyCard = item.cloneNode(true);
    flyCard.className = item.className + ' lightbox-card';
    flyCard.style.cssText = `
      top: ${rect.top}px;
      left: ${rect.left}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      margin: 0;
      cursor: zoom-out;
    `;
    document.body.appendChild(flyCard);
    const flyCaption = flyCard.querySelector('.masonry-caption');
    if (flyCaption) flyCaption.style.visibility = 'hidden';
    flyCard.style.borderBottom = '0';

    // Hide the original so it doesn't show through
    item.style.visibility = 'hidden';

    // Force reflow before animating
    flyCard.getBoundingClientRect();

    // Target: centered, larger
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxW = Math.min(vw * 0.88, 860);
    const maxH = vh * 0.88;

    // Preserve the item's aspect ratio
    const imgEl = item.querySelector('img');
    const naturalW = imgEl ? imgEl.naturalWidth  || rect.width  : rect.width;
    const naturalH = imgEl ? imgEl.naturalHeight || rect.height : rect.height;
    const aspect = naturalH / naturalW;

    let targetW = maxW;
    let targetH = targetW * aspect;
    if (targetH > maxH) {
      targetH = maxH;
      targetW = targetH / aspect;
    }

    const targetLeft = (vw - targetW) / 2;
    const targetTop  = (vh - targetH) / 2;

    // Animate in
    requestAnimationFrame(() => {
      flyCard.classList.add('lifting');
      flyCard.style.top    = targetTop  + 'px';
      flyCard.style.left   = targetLeft + 'px';
      flyCard.style.width  = targetW    + 'px';
      flyCard.style.height = targetH    + 'px';

      overlay.classList.add('active');
      closeBtn.classList.add('visible');
    });

    flyCard.addEventListener('click', closeLightbox);
  }

  // ── Close lightbox ───────────────────────────────────────────────────
function closeLightbox(immediate = false) {
  if (!flyCard && !activeItem) return;
  isOpen = false;

  overlay.classList.remove('active');

  if (immediate) {
    flyCard?.remove();
    flyCard = null;
    if (activeItem) activeItem.style.visibility = '';
    activeItem = null;
    return;
  }

  // Fly back using transform only
  flyCard.style.transform = `translate(0, ${-window.scrollY}px) scale(1)`;
  flyCard.classList.remove('lifting');

  flyCard.addEventListener('transitionend', () => {
    flyCard?.remove();
    flyCard = null;
    if (activeItem) activeItem.style.visibility = '';
    activeItem = null;
  }, { once: true });
}

  // ── Wire up clicks ───────────────────────────────────────────────────
  document.addEventListener('click', (e) => {
    const item = e.target.closest('.masonry-item');
    if (item && !isOpen) {
      openLightbox(item);
    }
  });

  overlay.addEventListener('click', closeLightbox);

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
})();