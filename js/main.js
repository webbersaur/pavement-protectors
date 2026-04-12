/* ============================================
   Pavement Protectors
   Main JavaScript
   ============================================ */

(function () {
  'use strict';

  // --- Mobile Navigation ---
  var hamburger = document.querySelector('.hamburger');
  var navLinks = document.querySelector('.nav-links');
  var navOverlay = document.querySelector('.nav-overlay');

  function openNav() {
    hamburger.classList.add('active');
    navLinks.classList.add('active');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      if (navLinks.classList.contains('active')) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeNav);
  }

  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  // --- Sticky Header ---
  var header = document.querySelector('.site-header');
  var scrollThreshold = 60;

  function handleScroll() {
    if (!header) return;
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- Active Nav Link ---
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a:not(.btn)').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Scroll Reveal Animations ---
  var reveals = document.querySelectorAll('.reveal');

  if (reveals.length > 0 && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = entry.target.getAttribute('data-delay') || 0;
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, parseInt(delay));
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // --- Hero Slideshow ---
  var heroSlides = document.querySelectorAll('.hero-slide');
  if (heroSlides.length > 1) {
    var currentSlide = 0;

    function showSlide(index) {
      heroSlides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
    }

    setInterval(function () {
      currentSlide = (currentSlide + 1) % heroSlides.length;
      showSlide(currentSlide);
    }, 5000);
  }

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Gallery Filter ---
  var filterBtns = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var category = this.getAttribute('data-category');

      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');

      galleryItems.forEach(function (item) {
        if (category === 'all' || item.getAttribute('data-category') === category) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // --- Lightbox ---
  var lightbox = document.querySelector('.lightbox');
  var lightboxImg = lightbox ? lightbox.querySelector('.lightbox-content img') : null;
  var lightboxCaption = lightbox ? lightbox.querySelector('.lightbox-caption') : null;
  var lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  var lightboxPrev = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
  var lightboxNext = lightbox ? lightbox.querySelector('.lightbox-next') : null;
  var currentLightboxIndex = 0;

  function getVisibleGalleryItems() {
    return Array.from(galleryItems).filter(function (item) {
      return !item.classList.contains('hidden');
    });
  }

  function openLightbox(index) {
    var visible = getVisibleGalleryItems();
    if (!visible[index]) return;

    currentLightboxIndex = index;
    var img = visible[index].querySelector('img');
    var caption = visible[index].querySelector('.gallery-item-caption p');

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    if (lightboxCaption && caption) {
      lightboxCaption.textContent = caption.textContent;
    }

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateLightbox(direction) {
    var visible = getVisibleGalleryItems();
    currentLightboxIndex += direction;
    if (currentLightboxIndex < 0) currentLightboxIndex = visible.length - 1;
    if (currentLightboxIndex >= visible.length) currentLightboxIndex = 0;
    openLightbox(currentLightboxIndex);
  }

  if (lightbox && galleryItems.length > 0) {
    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var visible = getVisibleGalleryItems();
        var visibleIndex = visible.indexOf(item);
        openLightbox(visibleIndex);
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', function () { navigateLightbox(-1); });
    if (lightboxNext) lightboxNext.addEventListener('click', function () { navigateLightbox(1); });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // --- Keyboard Navigation ---
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeNav();
      closeLightbox();
    }
    if (lightbox && lightbox.classList.contains('active')) {
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    }
  });

  // --- FAQ Accordion ---
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function () {
        faqItems.forEach(function (otherItem) {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
        item.classList.toggle('active');
      });
    }
  });

  // --- Contact Form ---
  var form = document.querySelector('.contact-form form');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var isValid = true;
      var requiredFields = ['name', 'email', 'phone', 'message'];

      requiredFields.forEach(function (field) {
        var input = form.querySelector('[name="' + field + '"]');
        if (input && !input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#e53e3e';
        } else if (input) {
          input.style.borderColor = '';
        }
      });

      var emailInput = form.querySelector('[name="email"]');
      if (emailInput && emailInput.value) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
          isValid = false;
          emailInput.style.borderColor = '#e53e3e';
        }
      }

      if (isValid) {
        alert('Thank you for your message! We will get back to you within 24 hours.');
        form.reset();
      } else {
        alert('Please fill in all required fields correctly.');
      }
    });
  }

})();
