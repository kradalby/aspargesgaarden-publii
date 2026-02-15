(function() {
    'use strict';

    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    var galleryLinks = document.querySelectorAll('.gallery__item a[data-size]');
    if (!galleryLinks.length) return;

    var overlay = document.getElementById('lightbox-overlay');
    var image = document.getElementById('lightbox-img');
    var credit = document.getElementById('lightbox-credit');
    var description = document.getElementById('lightbox-desc');
    var closeBtn = document.getElementById('lightbox-close');
    var prevBtn = document.getElementById('lightbox-prev');
    var nextBtn = document.getElementById('lightbox-next');

    var items = [];
    var currentIndex = 0;

    galleryLinks.forEach(function(link, index) {
        var fullUrl = link.getAttribute('href') || '';
        var caption = '';
        var figcaption = link.closest('.gallery__item').querySelector('figcaption');
        if (figcaption) {
            caption = figcaption.textContent || '';
        }

        items.push({ full: fullUrl, caption: caption });

        link.addEventListener('click', function(e) {
            e.preventDefault();
            openLightbox(index);
        });
    });

    function openLightbox(index) {
        currentIndex = index;
        updateSlide();
        lightbox.classList.add('is-active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('is-active');
        document.body.style.overflow = '';
    }

    function updateSlide() {
        var item = items[currentIndex];
        if (!item) return;

        image.src = item.full;
        image.alt = item.caption || '';
        credit.textContent = '';
        description.textContent = item.caption || '';

        // Preload adjacent images
        preload((currentIndex + 1) % items.length);
        preload((currentIndex - 1 + items.length) % items.length);
    }

    function preload(index) {
        var item = items[index];
        if (item && item.full) {
            var img = new Image();
            img.src = item.full;
        }
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % items.length;
        updateSlide();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateSlide();
    }

    // Event listeners
    overlay.addEventListener('click', closeLightbox);
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('is-active')) return;
        if (e.key === 'ArrowRight') nextSlide();
        else if (e.key === 'ArrowLeft') prevSlide();
        else if (e.key === 'Escape') closeLightbox();
    });

    // Touch swipe support
    var touchStartX = 0;
    var touchEndX = 0;

    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
    }, { passive: true });
})();
