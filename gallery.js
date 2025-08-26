/**
 * renderGallery(options)
 * - images: array of { src, thumb?, type?, width?, height?, alt? }
 * - container: selector string or DOM element
 * - galleryName: string (optional)
 * - wideThreshold: aspect ratio threshold to mark as "wide" (default 1.3)
 *
 * Notes:
 * - Uses naturalWidth/naturalHeight or provided width/height metadata to decide .wide
 * - Computes grid-row-end spans after images load so the grid becomes masonry-like
 * - Cleans up previous instance if re-rendering same container
 */
function renderGallery({ images = [], container = '#galleryContainer', galleryName = '', wideThreshold = 1.3 } = {}) {
    const containerEl = (typeof container === 'string') ? document.querySelector(container) : container;
    if (!containerEl) {
        console.warn('Gallery container not found', container);
        return;
    }

    // cleanup previous instance on same container
    if (containerEl._galleryInstance) {
        containerEl._galleryInstance.destroy();
        delete containerEl._galleryInstance;
    }

    // build markup
    containerEl.innerHTML = `
    <div class="gallery" role="list"></div>
    <small class="mt-2">Antall bilder: ${images.length}</small>
  `;
    const grid = containerEl.querySelector('.gallery');

    // populate items
    images.forEach((img, index) => {
        const src = img.type === 'video' ? (img.thumb || img.src) : img.src;
        const item = document.createElement('div');
        item.className = 'galleryitem';
        item.dataset.index = index;
        if (galleryName) item.dataset.gallery = galleryName;

        const imageEl = document.createElement('img');
        imageEl.loading = 'lazy';
        imageEl.decoding = 'async';
        imageEl.src = `https://teknix.no/chakims${src}`;
        imageEl.alt = img.alt || '';

        // append image
        item.appendChild(imageEl);

        // admin delete button (you already used data-delete)
        if (typeof isAdmin === 'function' && typeof isEditMode === 'function' && isAdmin() && isEditMode()) {
            const del = document.createElement('button');
            del.className = 'btn';
            del.type = 'button';
            del.setAttribute('data-delete', img.src);
            del.innerHTML = '&times;';
            item.appendChild(del);
        }

        // video overlay
        if (img.type === 'video') {
            const overlay = document.createElement('div');
            overlay.className = 'video-overlay';
            overlay.innerHTML = `<span class="play-icon">&#9658;</span>`;
            item.appendChild(overlay);
        }

        // append to grid
        grid.appendChild(item);

        // mark .wide if we have metadata immediately (width/height on img object),
        // otherwise we will check after the image loads
        const tryMarkWideFromMeta = () => {
            const w = img.width || img.naturalWidth || imageEl.naturalWidth || 0;
            const h = img.height || img.naturalHeight || imageEl.naturalHeight || 0;
            if (w && h && (w / h > wideThreshold)) {
                item.classList.add('wide');
            }
        };
        tryMarkWideFromMeta();

        // also mark wide after load if needed
        imageEl.addEventListener('load', () => tryMarkWideFromMeta(), { once: true });
    });

    // layout computation: measure each tile and set grid-row-end
    function layoutGrid() {
        const grid = document.querySelector('.gallery');
        if (!grid) return;

        const rowHeight = parseFloat(getComputedStyle(grid).getPropertyValue('grid-auto-rows')) || 8;
        const gap = parseFloat(getComputedStyle(grid).getPropertyValue('row-gap')) || 0;

        grid.querySelectorAll('.galleryitem').forEach(item => {
            item.style.gridRowEnd = 'span 1'; // reset first
            const content = item.querySelector('img, video');
            if (content) {
            const h = content.getBoundingClientRect().height;
            const span = Math.ceil((h + gap) / (rowHeight + gap));
            item.style.gridRowEnd = `span ${span}`;
            }
        });
    }

    // call after all images load
    window.addEventListener('load', layoutGrid);



    // wait until all images loaded (or cached) then layout
    const imgs = Array.from(grid.querySelectorAll('img'));
    const loadPromises = imgs.map(imgEl => {
        if (imgEl.complete && imgEl.naturalHeight !== 0) return Promise.resolve();
        return new Promise(res => imgEl.addEventListener('load', res, { once: true }));
    });

    Promise.all(loadPromises).then(() => {
        // let browser apply wide classes first, then layout
        requestAnimationFrame(() => layoutGrid());
    });

    // responsive: recompute on resize (debounced)
    let resizeTimer = null;
    const onResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => layoutGrid(), 120);
    };
    window.addEventListener('resize', onResize);

    // MutationObserver to re-layout when items are added/removed dynamically
    const mo = new MutationObserver(() => {
        // recalc after DOM changes
        requestAnimationFrame(() => layoutGrid());
    });
    mo.observe(grid, { childList: true, subtree: true });

    // store instance so we can clean up if re-rendered
    containerEl._galleryInstance = {
        destroy() {
            window.removeEventListener('resize', onResize);
            mo.disconnect();
            // clear DOM if desired:
            // containerEl.innerHTML = '';
        }
    };
}