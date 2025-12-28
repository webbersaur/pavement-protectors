// ===== Pavement Protectors Main JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
  initMobileMenu();
  initHeroSlideshow();
  initGalleryFilter();
  initLightbox();
  initFaqAccordion();
  initContactForm();
});

// ===== Mobile Menu Toggle =====
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      this.setAttribute('aria-expanded', navMenu.classList.contains('active'));
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// ===== Hero Slideshow =====
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length === 0) return;

  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  // Auto-advance slides every 5 seconds
  setInterval(nextSlide, 5000);
}

// ===== Gallery Filter =====
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.dataset.filter;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      // Filter gallery items
      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// ===== Lightbox =====
function initLightbox() {
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item img');

  if (!lightbox) return;

  galleryItems.forEach(img => {
    img.addEventListener('click', function() {
      lightboxImg.src = this.src;
      lightboxImg.alt = this.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

// ===== FAQ Accordion =====
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    if (question) {
      question.addEventListener('click', function() {
        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });

        // Toggle current item
        item.classList.toggle('active');
      });
    }
  });
}

// ===== Contact Form =====
function initContactForm() {
  const form = document.querySelector('.contact-form form');

  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Basic validation
    let isValid = true;
    const requiredFields = ['name', 'email', 'phone', 'message'];

    requiredFields.forEach(field => {
      const input = form.querySelector(`[name="${field}"]`);
      if (input && !input.value.trim()) {
        isValid = false;
        input.style.borderColor = '#e53e3e';
      } else if (input) {
        input.style.borderColor = '';
      }
    });

    // Email validation
    const emailInput = form.querySelector('[name="email"]');
    if (emailInput && emailInput.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value)) {
        isValid = false;
        emailInput.style.borderColor = '#e53e3e';
      }
    }

    if (isValid) {
      // For now, just show a success message
      // In production, this would submit to a server
      alert('Thank you for your message! We will get back to you within 24 hours.');
      form.reset();
    } else {
      alert('Please fill in all required fields correctly.');
    }
  });
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});
