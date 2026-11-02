/* =========================================================
   Skin Theory - main.js
   Site-wide interactivity: mobile menu, FAQ accordion,
   About-page tabs, scroll animations, back-to-top button.
   ========================================================= */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- 1. Mobile menu (hamburger) ---------- */
    (function menu() {
        var nav = document.querySelector('nav');
        if (!nav) { return; }
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'menu-toggle';
        btn.textContent = '\u2630 Menu';
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-controls', 'site-nav');
        nav.id = 'site-nav';
        nav.classList.add('js-nav');
        nav.parentNode.insertBefore(btn, nav);

        function setOpen(open) {
            nav.classList.toggle('open', open);
            btn.setAttribute('aria-expanded', String(open));
            btn.textContent = open ? '\u2715 Close' : '\u2630 Menu';
        }
        btn.addEventListener('click', function () {
            setOpen(!nav.classList.contains('open'));
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') { setOpen(false); }
        });
    })();

    /* ---------- 2. FAQ accordion (one open at a time, animated) ---------- */
    (function accordion() {
        var all = document.querySelectorAll('main details');
        if (!all.length) { return; }

        function animate(d, opening) {
            var summary = d.querySelector('summary');
            if (d._anim) { d._anim.cancel(); }
            if (reduceMotion || !d.animate) { d.open = opening; return; }

            var startH = d.offsetHeight;
            if (opening) { d.open = true; }
            var endH = opening ? d.offsetHeight : summary.offsetHeight;
            d.style.overflow = 'hidden';
            d.style.boxSizing = 'border-box';
            d._anim = d.animate(
                { height: [startH + 'px', endH + 'px'] },
                { duration: 300, easing: 'ease' }
            );
            d._anim.onfinish = d._anim.oncancel = function () {
                if (!opening) { d.open = false; }
                d.style.overflow = '';
                d.style.boxSizing = '';
                d._anim = null;
            };
        }

        all.forEach(function (d) {
            d.querySelector('summary').addEventListener('click', function (e) {
                e.preventDefault();
                if (d.open) {
                    animate(d, false);
                } else {
                    all.forEach(function (other) {
                        if (other !== d && other.open) { animate(other, false); }
                    });
                    animate(d, true);
                }
            });
        });
    })();

    /* ---------- 3. Tabs (About page) ---------- */
    (function tabs() {
        var wrap = document.getElementById('about-tabs');
        if (!wrap) { return; }
        var panels = Array.prototype.slice.call(wrap.querySelectorAll('.tab-panel'));
        var tablist = document.createElement('div');
        tablist.className = 'tab-list';
        tablist.setAttribute('role', 'tablist');
        tablist.setAttribute('aria-label', 'About Skin Theory');
        var buttons = [];

        panels.forEach(function (panel, i) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'tab-button';
            b.id = 'tab-' + i;
            b.textContent = panel.dataset.title;
            b.setAttribute('role', 'tab');
            b.setAttribute('aria-controls', panel.id);
            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('aria-labelledby', b.id);
            b.addEventListener('click', function () { activate(i, false); });
            b.addEventListener('keydown', function (e) {
                var next = null;
                if (e.key === 'ArrowRight') { next = (i + 1) % panels.length; }
                if (e.key === 'ArrowLeft') { next = (i - 1 + panels.length) % panels.length; }
                if (e.key === 'Home') { next = 0; }
                if (e.key === 'End') { next = panels.length - 1; }
                if (next !== null) { e.preventDefault(); activate(next, true); }
            });
            tablist.appendChild(b);
            buttons.push(b);
        });
        wrap.insertBefore(tablist, wrap.firstChild);
        wrap.classList.add('tabs-ready');

        function activate(index, focus) {
            panels.forEach(function (p, i) {
                var on = i === index;
                p.hidden = !on;
                buttons[i].setAttribute('aria-selected', String(on));
                buttons[i].tabIndex = on ? 0 : -1;
                buttons[i].classList.toggle('active', on);
            });
            if (focus) { buttons[index].focus(); }
        }

        // open the right tab when the URL has #mission, #vision, etc.
        function fromHash() {
            var id = window.location.hash.slice(1);
            var target = id && document.getElementById(id);
            var panel = target && target.closest('.tab-panel');
            var index = panel ? panels.indexOf(panel) : 0;
            activate(index, false);
            if (target) { target.scrollIntoView(); }
        }
        window.addEventListener('hashchange', fromHash);
        fromHash();
    })();

    /* ---------- 4. Scroll-reveal animation ---------- */
    (function reveal() {
        if (reduceMotion || !('IntersectionObserver' in window)) { return; }
        var targets = document.querySelectorAll(
            'main h2, main > img, main > table, main details, .reveal');
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        targets.forEach(function (t) {
            t.classList.add('reveal');
            observer.observe(t);
        });
    })();

    /* ---------- 5. Back-to-top button ---------- */
    (function backToTop() {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'back-to-top';
        btn.textContent = '\u2191 Top';
        btn.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(btn);
        window.addEventListener('scroll', function () {
            btn.classList.toggle('show', window.scrollY > 500);
        }, { passive: true });
        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    })();
})();