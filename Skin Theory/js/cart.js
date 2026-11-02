/* =========================================================
   Skin Theory - cart.js
   Shopping cart kept in localStorage, with a slide-out
   drawer. Loaded on every page. Other scripts use
   window.SkinCart.add(product).
   ========================================================= */
(function () {
    'use strict';

    var KEY = 'skinTheoryCart';
    var FREE_SHIPPING = 800;          // matches the promo banner (R800)
    var items = load();

    /* ---------- storage helpers (wrapped in try/catch) ---------- */
    function load() {
        try {
            var data = JSON.parse(localStorage.getItem(KEY));
            return Array.isArray(data) ? data : [];
        } catch (e) { return []; }
    }
    function save() {
        try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* storage blocked */ }
    }
    function formatRand(n) { return 'R' + n.toLocaleString('en-ZA'); }
    function count() {
        return items.reduce(function (n, i) { return n + i.qty; }, 0);
    }
    function total() {
        return items.reduce(function (sum, i) { return sum + i.price * i.qty; }, 0);
    }
    function find(id) {
        return items.filter(function (i) { return i.id === id; })[0];
    }

    /* ---------- build the cart UI once ---------- */
    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) { node.className = className; }
        if (text) { node.textContent = text; }
        return node;
    }

    var toggle = el('button', 'cart-toggle');
    toggle.type = 'button';
    toggle.appendChild(document.createTextNode('Cart '));
    var badge = el('span', 'cart-count', '0');
    toggle.appendChild(badge);

    var overlay = el('div', 'cart-overlay');
    var drawer = el('aside', 'cart-drawer');
    drawer.setAttribute('aria-label', 'Shopping cart');
    drawer.id = 'cart-drawer';

    var drawerHead = el('div', 'cart-head');
    drawerHead.appendChild(el('h2', '', 'Your cart'));
    var closeBtn = el('button', 'cart-close', 'Close');
    closeBtn.type = 'button';
    drawerHead.appendChild(closeBtn);

    var shipText = el('p', 'cart-ship');
    var shipBar = el('progress', 'cart-progress');
    shipBar.max = FREE_SHIPPING;
    var list = el('ul', 'cart-items');
    var empty = el('p', 'cart-empty', 'Your cart is empty. Browse our products to add something you love.');
    var foot = el('div', 'cart-foot');
    var totalRow = el('p', 'cart-total');
    var quote = el('a', 'cart-button', 'Request a quote');
    quote.href = 'enquiry.html';
    var clearBtn = el('button', 'cart-clear', 'Clear cart');
    clearBtn.type = 'button';
    foot.appendChild(totalRow);
    foot.appendChild(quote);
    foot.appendChild(clearBtn);

    drawer.appendChild(drawerHead);
    drawer.appendChild(shipText);
    drawer.appendChild(shipBar);
    drawer.appendChild(empty);
    drawer.appendChild(list);
    drawer.appendChild(foot);

    var toast = el('p', 'cart-toast');
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    document.body.appendChild(toggle);
    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
    document.body.appendChild(toast);

    /* ---------- render ---------- */
    function render() {
        var n = count();
        badge.textContent = n;
        toggle.setAttribute('aria-label', 'Open cart, ' + n + (n === 1 ? ' item' : ' items'));

        list.textContent = '';
        items.forEach(function (item) {
            var li = el('li', 'cart-item');
            li.dataset.id = item.id;

            var img = el('img');
            img.src = item.image;
            img.alt = item.alt || item.name;
            img.width = 56;
            li.appendChild(img);

            var info = el('div', 'cart-info');
            info.appendChild(el('strong', '', item.name));
            info.appendChild(el('span', '', formatRand(item.price) + ' each'));

            var qtyRow = el('div', 'cart-qty');
            var minus = el('button', '', '\u2212');
            minus.type = 'button'; minus.dataset.action = 'minus';
            minus.setAttribute('aria-label', 'Decrease quantity of ' + item.name);
            var qty = el('span', '', String(item.qty));
            var plus = el('button', '', '+');
            plus.type = 'button'; plus.dataset.action = 'plus';
            plus.setAttribute('aria-label', 'Increase quantity of ' + item.name);
            var remove = el('button', 'cart-remove', 'Remove');
            remove.type = 'button'; remove.dataset.action = 'remove';
            remove.setAttribute('aria-label', 'Remove ' + item.name + ' from cart');
            qtyRow.appendChild(minus); qtyRow.appendChild(qty);
            qtyRow.appendChild(plus); qtyRow.appendChild(remove);
            info.appendChild(qtyRow);
            li.appendChild(info);

            li.appendChild(el('span', 'cart-line', formatRand(item.price * item.qty)));
            list.appendChild(li);
        });

        var sum = total();
        empty.hidden = n !== 0;
        foot.hidden = n === 0;
        shipText.hidden = shipBar.hidden = n === 0;
        totalRow.textContent = 'Subtotal: ' + formatRand(sum);
        shipBar.value = Math.min(sum, FREE_SHIPPING);
        shipText.textContent = sum >= FREE_SHIPPING
            ? 'You have unlocked free shipping!'
            : 'Add ' + formatRand(FREE_SHIPPING - sum) + ' more for free shipping';
    }

    /* ---------- actions ---------- */
    function add(product, qty) {
        qty = qty || 1;
        var existing = find(product.id);
        if (existing) {
            existing.qty += qty;
        } else {
            items.push({ id: product.id, name: product.name, price: product.price,
                         image: product.image, alt: product.alt, qty: qty });
        }
        save();
        render();
        badge.classList.remove('bump');
        void badge.offsetWidth;                // restart the CSS animation
        badge.classList.add('bump');
        showToast(product.name + ' added to your cart');
    }

    function changeQty(id, delta) {
        var item = find(id);
        if (!item) { return; }
        item.qty += delta;
        if (item.qty <= 0) { remove(id); return; }
        save(); render();
    }
    function remove(id) {
        items = items.filter(function (i) { return i.id !== id; });
        save(); render();
    }
    function clear() {
        items = [];
        save(); render();
    }

    var toastTimer;
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
    }

    function openDrawer() {
        document.body.classList.add('cart-open');
        drawer.classList.add('open');
        overlay.classList.add('open');
        closeBtn.focus();
    }
    function closeDrawer() {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        document.body.classList.remove('cart-open');
        toggle.focus();
    }

    /* ---------- events ---------- */
    toggle.addEventListener('click', openDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);
    clearBtn.addEventListener('click', clear);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && drawer.classList.contains('open')) { closeDrawer(); }
    });
    // one listener handles every + / - / remove button (event delegation)
    list.addEventListener('click', function (e) {
        var btn = e.target.closest('button[data-action]');
        if (!btn) { return; }
        var id = btn.closest('.cart-item').dataset.id;
        if (btn.dataset.action === 'plus') { changeQty(id, 1); }
        if (btn.dataset.action === 'minus') { changeQty(id, -1); }
        if (btn.dataset.action === 'remove') { remove(id); }
    });
    // keep several open tabs in sync
    window.addEventListener('storage', function (e) {
        if (e.key === KEY) { items = load(); render(); }
    });

    render();

    /* public API for the other scripts */
    window.SkinCart = {
        add: add,
        clear: clear,
        getItems: function () { return items.slice(); },
        getTotal: total,
        formatRand: formatRand
    };
})();