/* =========================================================
   Skin Theory - products.js
   Loads products.json, builds the product cards with DOM
   methods, adds live search, filter and sort, plus the
   Add to cart buttons and the Quick view modal.
   ========================================================= */
(function () {
    'use strict';

    var grid = document.getElementById('product-grid');
    if (!grid) { return; }               // only run on products.html

    var searchInput = document.getElementById('product-search');
    var categorySelect = document.getElementById('category-filter');
    var sortSelect = document.getElementById('sort-by');
    var fragranceFree = document.getElementById('fragrance-free');
    var resetBtn = document.getElementById('reset-filters');
    var countEl = document.getElementById('results-count');
    var emptyEl = document.getElementById('no-results');
    var headerSearch = document.getElementById('site-search');

    var products = [];

    var CATEGORY_LABELS = {
        'oil': 'Tissue oil',
        'lotion': 'Body lotion',
        'gift-set': 'Gift set'
    };

    /* ---------- 1. Load the data (asynchronous fetch) ---------- */
    fetch('products.json')
        .then(function (response) {
            if (!response.ok) { throw new Error('HTTP ' + response.status); }
            return response.json();
        })
        .then(function (data) {
            products = data;
            applyUrlParams();
            render();
            scrollToHash();
        })
        .catch(function (error) {
            console.error('Could not load products:', error);
            countEl.textContent = '';
            grid.textContent = '';
            var msg = document.createElement('p');
            msg.className = 'form-error';
            msg.textContent = 'Sorry, the products could not be loaded. Please refresh the page or try again later.';
            grid.appendChild(msg);
        });

    /* ---------- 2. Read ?q= and ?category= from the URL ---------- */
    function applyUrlParams() {
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        var cat = params.get('category');
        if (q) {
            searchInput.value = q;
            if (headerSearch) { headerSearch.value = q; }
        }
        if (cat && CATEGORY_LABELS[cat]) { categorySelect.value = cat; }
    }

    /* ---------- 3. Filter + sort ---------- */
    function getVisibleProducts() {
        var term = searchInput.value.trim().toLowerCase();
        var cat = categorySelect.value;

        var list = products.filter(function (p) {
            if (cat !== 'all' && p.category !== cat) { return false; }
            if (fragranceFree.checked && p.tags.indexOf('fragrance-free') === -1) { return false; }
            if (term) {
                var haystack = [p.name, p.description, CATEGORY_LABELS[p.category],
                                p.tags.join(' '), (p.includes || []).join(' ')]
                                .join(' ').toLowerCase();
                // every word typed must appear somewhere
                return term.split(/\s+/).every(function (word) {
                    return haystack.indexOf(word) !== -1;
                });
            }
            return true;
        });

        var sort = sortSelect.value;
        if (sort === 'price-asc') { list.sort(function (a, b) { return a.price - b.price; }); }
        if (sort === 'price-desc') { list.sort(function (a, b) { return b.price - a.price; }); }
        if (sort === 'name-asc') { list.sort(function (a, b) { return a.name.localeCompare(b.name); }); }
        return list;
    }

    /* ---------- 4. Build one card with DOM methods ---------- */
    function buildCard(p) {
        var card = document.createElement('article');
        card.className = 'product-card';
        card.id = p.id;

        var img = document.createElement('img');
        img.src = p.image;
        img.alt = p.alt;
        img.width = 250;
        img.loading = 'lazy';
        card.appendChild(img);

        var h3 = document.createElement('h3');
        h3.textContent = p.name;
        card.appendChild(h3);

        var meta = document.createElement('p');
        meta.className = 'product-meta';
        meta.textContent = CATEGORY_LABELS[p.category] + ' \u00B7 ' + p.size;
        card.appendChild(meta);

        var desc = document.createElement('p');
        desc.textContent = p.description;
        card.appendChild(desc);

        if (p.includes) {
            var ul = document.createElement('ul');
            ul.className = 'product-includes';
            p.includes.forEach(function (item) {
                var li = document.createElement('li');
                li.textContent = item;
                ul.appendChild(li);
            });
            card.appendChild(ul);
        }

        var price = document.createElement('p');
        price.className = 'product-price';
        price.textContent = 'R' + p.price.toLocaleString('en-ZA');
        card.appendChild(price);

        var actions = document.createElement('div');
        actions.className = 'card-actions';

        var viewBtn = document.createElement('button');
        viewBtn.type = 'button';
        viewBtn.className = 'btn-secondary';
        viewBtn.textContent = 'Quick view';
        viewBtn.setAttribute('aria-label', 'Quick view of ' + p.name);
        viewBtn.addEventListener('click', function () { openQuickView(p); });

        actions.appendChild(viewBtn);
        actions.appendChild(buildAddButton(p));
        card.appendChild(actions);

        var link = document.createElement('a');
        link.href = 'enquiry.html?product=' + encodeURIComponent(p.name);
        link.textContent = 'Enquire about this product';
        card.appendChild(link);

        return card;
    }

    /* "Add to cart" button, shared by the card and the modal */
    function buildAddButton(p) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-primary';
        btn.textContent = 'Add to cart';
        btn.setAttribute('aria-label', 'Add ' + p.name + ' to cart');
        btn.addEventListener('click', function () {
            if (window.SkinCart) { window.SkinCart.add(p); }
            btn.textContent = 'Added \u2713';
            setTimeout(function () { btn.textContent = 'Add to cart'; }, 1200);
        });
        return btn;
    }

    /* ---------- Quick-view modal (native <dialog>) ---------- */
    var dialog = document.createElement('dialog');
    dialog.className = 'quick-view';
    dialog.setAttribute('aria-label', 'Product quick view');
    document.body.appendChild(dialog);

    // click on the dark backdrop closes it
    dialog.addEventListener('click', function (e) {
        if (e.target === dialog) { dialog.close(); }
    });

    function openQuickView(p) {
        dialog.textContent = '';

        var close = document.createElement('button');
        close.type = 'button';
        close.className = 'modal-close';
        close.setAttribute('aria-label', 'Close quick view');
        close.textContent = '\u2715';
        close.addEventListener('click', function () { dialog.close(); });

        var img = document.createElement('img');
        img.src = p.image;
        img.alt = p.alt;

        var body = document.createElement('div');
        body.className = 'modal-body';

        var h2 = document.createElement('h2');
        h2.textContent = p.name;
        var meta = document.createElement('p');
        meta.className = 'product-meta';
        meta.textContent = CATEGORY_LABELS[p.category] + ' \u00B7 ' + p.size;
        var desc = document.createElement('p');
        desc.textContent = p.description;
        body.appendChild(h2);
        body.appendChild(meta);
        body.appendChild(desc);

        if (p.includes) {
            var inc = document.createElement('p');
            inc.innerHTML = '<strong>This set includes:</strong>';
            body.appendChild(inc);
            var ul = document.createElement('ul');
            p.includes.forEach(function (item) {
                var li = document.createElement('li');
                li.textContent = item;
                ul.appendChild(li);
            });
            body.appendChild(ul);
        }

        var chips = document.createElement('p');
        chips.className = 'chips';
        p.tags.forEach(function (tag) {
            var chip = document.createElement('span');
            chip.textContent = tag;
            chips.appendChild(chip);
        });
        body.appendChild(chips);

        var price = document.createElement('p');
        price.className = 'product-price';
        price.textContent = 'R' + p.price.toLocaleString('en-ZA');
        body.appendChild(price);
        body.appendChild(buildAddButton(p));

        dialog.appendChild(close);
        dialog.appendChild(img);
        dialog.appendChild(body);
        dialog.showModal();
    }

    /* ---------- 5. Render ---------- */
    function render() {
        var list = getVisibleProducts();
        grid.textContent = '';                       // clear old cards
        var fragment = document.createDocumentFragment();
        list.forEach(function (p) { fragment.appendChild(buildCard(p)); });
        grid.appendChild(fragment);

        countEl.textContent = 'Showing ' + list.length + ' of ' + products.length + ' products';
        emptyEl.hidden = list.length !== 0;
    }

    function scrollToHash() {
        var id = window.location.hash.slice(1);
        if (!id) { return; }
        var target = document.getElementById(id);
        if (target && target.classList.contains('product-card')) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            target.classList.add('highlight');
        }
    }

    /* ---------- 6. Events ---------- */
    var timer;
    searchInput.addEventListener('input', function () {
        clearTimeout(timer);                          // debounce typing
        timer = setTimeout(render, 150);
    });
    categorySelect.addEventListener('change', render);
    sortSelect.addEventListener('change', render);
    fragranceFree.addEventListener('change', render);

    // pressing Enter in the search box must not reload the page
    document.getElementById('product-controls').addEventListener('submit', function (e) {
        e.preventDefault();
        render();
    });

    resetBtn.addEventListener('click', function () {
        searchInput.value = '';
        categorySelect.value = 'all';
        sortSelect.value = 'featured';
        fragranceFree.checked = false;
        render();
    });
})();