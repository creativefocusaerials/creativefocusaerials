/* ============================================
   CREATIVE FOCUS AERIALS — Main JavaScript
   Navigation, Animations, Form, Smooth Scroll
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Sticky Nav on Scroll ----------
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  const handleNavScroll = () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run on load

  // ---------- Mobile Hamburger Menu ----------
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile nav when a link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---------- Smooth Scroll for Anchor Links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---------- Scroll Reveal Animations ----------
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));

  // ---------- Contact Form Handling ----------
  const form = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      let valid = true;

      [name, email].forEach(input => {
        if (input && !input.value.trim()) {
          input.style.borderColor = '#ef5350';
          valid = false;
        } else if (input) {
          input.style.borderColor = '';
        }
      });

      // Email format check
      if (email && email.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
          email.style.borderColor = '#ef5350';
          valid = false;
        }
      }

      if (!valid) return;

      // Simulate submission
      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
      }

      const formData = new FormData(form);

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })
      .then(() => {
        form.reset();
        if (formSuccess) {
          formSuccess.classList.add('visible');
          formSuccess.textContent = "✓ Thank you! We'll be in touch within 24 hours.";
          formSuccess.style.color = "#4caf50";
        }
        if (submitBtn) {
          submitBtn.textContent = 'Send Message';
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        }

        // Hide success message after 5 seconds
        setTimeout(() => {
          if (formSuccess) {
            formSuccess.classList.remove('visible');
          }
        }, 5000);
      })
      .catch((error) => {
        console.error(error);
        if (formSuccess) {
          formSuccess.classList.add('visible');
          formSuccess.textContent = "Oops! There was a problem submitting your form.";
          formSuccess.style.color = "#ef5350";
        }
        if (submitBtn) {
          submitBtn.textContent = 'Send Message';
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        }
      });
    });

    // Remove error styling on input
    form.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', function () {
        this.style.borderColor = '';
      });
    });
  }

  // ---------- Parallax-like Hero Subtle Effect ----------
  const hero = document.querySelector('.hero');
  if (hero) {
    const heroBg = hero.querySelector('.hero-bg img');
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        const offset = window.scrollY * 0.3;
        if (heroBg) {
          heroBg.style.transform = `scale(1.05) translateY(${offset}px)`;
        }
      }
    }, { passive: true });
  }

  // ---------- Active Nav Link Highlighting ----------
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else if (href !== '#contact') {
      link.classList.remove('active');
    }
  });

  // ---------- Lazy Load Background Videos ----------
  const lazyVideos = document.querySelectorAll('video.lazy-video');
  if (lazyVideos.length > 0) {
    const videoObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target;
          video.src = video.getAttribute('data-src');
          video.load();
          video.play().catch(e => console.log('Autoplay prevented', e));
          observer.unobserve(video);
        }
      });
    }, { rootMargin: '200px 0px' });
    
    lazyVideos.forEach(video => {
      videoObserver.observe(video);
    });
  }

});
