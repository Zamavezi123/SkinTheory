/* =========================================================
   Skin Theory - lightbox.js
   Gallery filter buttons and a lightbox (enlarged photo
   viewer) with previous/next, keyboard and swipe support.
   ========================================================= */
(function () {
    'use strict';

    var gallery = document.getElementById('gallery');
    if (!gallery) { return; }

    var cells = Array.prototype.slice.call(gallery.querySelectorAll('li'));
    var filterBar = document.getElementById('gallery-filters');
    var visible = [];          // links currently shown (changes with the filter)
    var index = 0;             // which photo the lightbox is showing

    function el(tag, className) {
        var node = document.createElement(tag);
        if (className) { node.className = className; }
        return node;
    }

    /* ---------- Build the lightbox once ---------- */
    var dialog = el('dialog', 'lightbox');
    dialog.setAttribute('aria-label', 'Photo viewer');

    var closeBtn = el('button', 'lb-close');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close photo viewer');
    closeBtn.textContent = '\u2715';

    var prevBtn = el('button', 'lb-nav lb-prev');
    prevBtn.type = 'button';
    prevBtn.setAttribute('aria-label', 'Previous photo');
    prevBtn.textContent = '\u2039';

    var nextBtn = el('button', 'lb-nav lb-next');
    nextBtn.type = 'button';
    nextBtn.setAttribute('aria-label', 'Next photo');
    nextBtn.textContent = '\u203A';

    var figure = el('figure', 'lb-figure');
    var bigImg = el('img');
    var caption = el('figcaption');
    var counter = el('p', 'lb-counter');
    counter.setAttribute('aria-live', 'polite');
    figure.appendChild(bigImg);
    figure.appendChild(caption);
    figure.appendChild(counter);

    dialog.appendChild(closeBtn);
    dialog.appendChild(prevBtn);
    dialog.appendChild(figure);
    dialog.appendChild(nextBtn);
    document.body.appendChild(dialog);

    /* ---------- Show the photo at the current index ---------- */
    function show() {
        var link = visible[index];
        var thumb = link.querySelector('img');
        bigImg.classList.add('loading');
        bigImg.onload = function () { bigImg.classList.remove('loading'); };
        bigImg.onerror = function () {
            bigImg.classList.remove('loading');
            caption.textContent = 'Sorry, this photo could not be loaded.';
        };
        bigImg.src = link.href;
        bigImg.alt = thumb.alt;
        caption.textContent = link.dataset.caption || thumb.alt;
        counter.textContent = (index + 1) + ' / ' + visible.length;

        // preload the neighbours so next/previous feels instant
        [index - 1, index + 1].forEach(function (i) {
            var n = visible[(i + visible.length) % visible.length];
            if (n) { new Image().src = n.href; }
        });
    }

    function go(step) {
        index = (index + step + visible.length) % visible.length;   // wraps around
        show();
    }

    function open(i) {
        index = i;
        show();
        dialog.showModal();
    }

    /* ---------- Filter buttons ---------- */
    function applyFilter(category) {
        cells.forEach(function (cell) {
            cell.hidden = category !== 'all' && cell.dataset.category !== category;
        });
        visible = cells.filter(function (c) { return !c.hidden; })
                       .map(function (c) { return c.querySelector('a'); });
        Array.prototype.forEach.call(filterBar.querySelectorAll('button'), function (b) {
            b.setAttribute('aria-pressed', String(b.dataset.filter === category));
        });
    }

    filterBar.addEventListener('click', function (e) {
        var btn = e.target.closest('button[data-filter]');
        if (btn) { applyFilter(btn.dataset.filter); }
    });

    /* ---------- Opening a photo (event delegation) ---------- */
    gallery.addEventListener('click', function (e) {
        var link = e.target.closest('a.gallery-item');
        if (!link) { return; }
        e.preventDefault();                    // stop the browser opening the raw image
        open(visible.indexOf(link));
    });

    /* ---------- Lightbox controls ---------- */
    closeBtn.addEventListener('click', function () { dialog.close(); });
    prevBtn.addEventListener('click', function () { go(-1); });
    nextBtn.addEventListener('click', function () { go(1); });

    dialog.addEventListener('click', function (e) {
        if (e.target === dialog) { dialog.close(); }       // click on the dark area
    });
    dialog.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { go(-1); }
        if (e.key === 'ArrowRight') { go(1); }
    });

    // swipe left/right on touch screens
    var startX = null;
    figure.addEventListener('pointerdown', function (e) { startX = e.clientX; });
    figure.addEventListener('pointerup', function (e) {
        if (startX === null) { return; }
        var dx = e.clientX - startX;
        startX = null;
        if (Math.abs(dx) > 50) { go(dx < 0 ? 1 : -1); }
    });

    applyFilter('all');
})();