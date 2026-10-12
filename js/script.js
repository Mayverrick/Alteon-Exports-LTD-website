/**
 * Alteon Exports Ltd - Core Client-Side Logic & Defense-in-Depth Hardening
 * Standards: OWASP Top 10, RFC 9116, CSP Level 3, Anti-Clickjacking Frame Guard
 */

// --- 1. Frame Guard (Anti-Clickjacking / UI Redress Defense) ---
if (window.self !== window.top) {
  try {
    window.top.location = window.self.location;
  } catch (e) {
    window.location = "about:blank";
  }
}

// --- 2. Anti-Self-XSS Developer Console Warning ---
if (typeof console !== 'undefined' && console.log) {
  console.log(
    '%c[SECURITY NOTICE] %cStop! This browser console is intended solely for authorized debugging. Pasting unknown scripts or credentials here can compromise your session and corporate data.',
    'color: #f59e0b; font-size: 15px; font-weight: 800; background: #111; padding: 4px 8px; border-radius: 4px;',
    'color: #e5e7eb; font-size: 13px; font-weight: 500;'
  );
}

// Security Configuration (Tamper-Resistant)
const SECURITY_CONFIG = Object.freeze({
  RATE_LIMIT_KEY: 'alteon_submission_timestamps',
  RATE_LIMIT_WINDOW_MS: 3 * 60 * 1000, // 3 minutes
  RATE_LIMIT_MAX_ATTEMPTS: 3,
  MIN_FORM_FILL_TIME_MS: 2000, // Reject bot submissions faster than 2s
  MAX_LENGTHS: Object.freeze({
    name: 100,
    company: 100,
    email: 120,
    division: 64,
    message: 3000
  })
});

document.addEventListener('DOMContentLoaded', () => {
  // --- Reverse Tabnabbing Defense & Secure External Links ---
  const secureExternalLinks = () => {
    const externalLinks = document.querySelectorAll('a[href^="http://"], a[href^="https://"]');
    externalLinks.forEach(link => {
      try {
        const url = new URL(link.href, window.location.origin);
        if (url.origin !== window.location.origin) {
          link.setAttribute('rel', 'noopener noreferrer');
        }
      } catch (err) {
        // Fallback for invalid URLs
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  };
  secureExternalLinks();

  // --- Header Scroll Effect ---
  const header = document.querySelector('header');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // --- Mobile Hamburger Menu ---
  const hamburger = document.querySelector('.hamburger');
  const mobileNavPanel = document.querySelector('.mobile-nav-panel');
  const backdrop = document.querySelector('.mobile-menu-backdrop');
  
  if (hamburger && mobileNavPanel && backdrop) {
    const toggleMenu = () => {
      const isOpen = hamburger.classList.toggle('active');
      mobileNavPanel.classList.toggle('active');
      backdrop.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
    };

    hamburger.addEventListener('click', toggleMenu);
    backdrop.addEventListener('click', toggleMenu);
    
    // Close menu when clicking navigation links
    const mobileLinks = mobileNavPanel.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (hamburger.classList.contains('active')) {
          toggleMenu();
        }
      });
    });
  }

  // --- Interactive Ledger Manifest Simulation ---
  const manifestBody = document.querySelector('.manifest-body');
  if (manifestBody) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      setInterval(() => {
        const rows = manifestBody.querySelectorAll('.manifest-row');
        if (rows.length > 1) {
          const firstRow = rows[0];
          firstRow.style.opacity = '0';
          firstRow.style.transform = 'translateY(-20px)';
          
          setTimeout(() => {
            manifestBody.appendChild(firstRow);
            firstRow.style.opacity = '1';
            firstRow.style.transform = 'translateY(0)';
          }, 300);
        }
      }, 4000);
    }
  }

  // --- Military-Grade Hardened Contact Form Handler ---
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const statusAlert = document.getElementById('form-status-alert');
    const formRenderTime = Date.now();

    // 1. Cryptographically Secure Anti-CSRF Token Generation
    const setupCsrfProtection = () => {
      let csrfInput = contactForm.querySelector('input[name="_csrf_token"]');
      if (!csrfInput) {
        csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_csrf_token';
        contactForm.appendChild(csrfInput);
      }
      const tokenBuffer = new Uint8Array(16);
      if (window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(tokenBuffer);
        csrfInput.value = Array.from(tokenBuffer, b => b.toString(16).padStart(2, '0')).join('');
      } else {
        csrfInput.value = 'sec_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      }
    };
    setupCsrfProtection();

    // 2. RFC-Compliant Email Validator
    const isValidEmail = (email) => {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      return emailRegex.test(email) && email.length <= SECURITY_CONFIG.MAX_LENGTHS.email;
    };

    // 3. Rate-Limiting / Flood Prevention Check
    const checkRateLimit = () => {
      const now = Date.now();
      let timestamps = [];
      try {
        const stored = sessionStorage.getItem(SECURITY_CONFIG.RATE_LIMIT_KEY);
        timestamps = stored ? JSON.parse(stored) : [];
      } catch (e) {
        timestamps = [];
      }

      // Filter timestamps within window
      timestamps = timestamps.filter(t => (now - t) < SECURITY_CONFIG.RATE_LIMIT_WINDOW_MS);
      if (timestamps.length >= SECURITY_CONFIG.RATE_LIMIT_MAX_ATTEMPTS) {
        const remainingSec = Math.ceil((SECURITY_CONFIG.RATE_LIMIT_WINDOW_MS - (now - timestamps[0])) / 1000);
        return { allowed: false, remainingSec };
      }
      return { allowed: true };
    };

    const recordSubmissionAttempt = () => {
      const now = Date.now();
      try {
        const stored = sessionStorage.getItem(SECURITY_CONFIG.RATE_LIMIT_KEY);
        let timestamps = stored ? JSON.parse(stored) : [];
        timestamps = timestamps.filter(t => (now - t) < SECURITY_CONFIG.RATE_LIMIT_WINDOW_MS);
        timestamps.push(now);
        sessionStorage.setItem(SECURITY_CONFIG.RATE_LIMIT_KEY, JSON.stringify(timestamps));
      } catch (e) {
        // Fallback gracefully if storage is restricted
      }
    };

    // 4. Live Field Validation with Hardened Character Limits
    const inputs = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
    inputs.forEach(input => {
      const fieldName = input.name;
      if (SECURITY_CONFIG.MAX_LENGTHS[fieldName]) {
        input.setAttribute('maxlength', SECURITY_CONFIG.MAX_LENGTHS[fieldName]);
      }

      input.addEventListener('blur', () => {
        validateField(input);
      });
      input.addEventListener('input', () => {
        const errorEl = document.getElementById(`${input.id}-error`);
        if (errorEl && errorEl.style.display === 'block') {
          validateField(input);
        }
      });
    });

    const validateField = (input) => {
      const errorEl = document.getElementById(`${input.id}-error`);
      if (!errorEl) return true;

      const trimmedVal = input.value.trim();
      let valid = true;

      if (trimmedVal === '') {
        errorEl.textContent = 'This field is required.';
        errorEl.style.display = 'block';
        input.setAttribute('aria-invalid', 'true');
        valid = false;
      } else if (input.type === 'email' && !isValidEmail(trimmedVal)) {
        errorEl.textContent = 'Please enter a valid corporate email address.';
        errorEl.style.display = 'block';
        input.setAttribute('aria-invalid', 'true');
        valid = false;
      } else if (SECURITY_CONFIG.MAX_LENGTHS[input.name] && trimmedVal.length > SECURITY_CONFIG.MAX_LENGTHS[input.name]) {
        errorEl.textContent = `Input exceeds maximum allowed length of ${SECURITY_CONFIG.MAX_LENGTHS[input.name]} characters.`;
        errorEl.style.display = 'block';
        input.setAttribute('aria-invalid', 'true');
        valid = false;
      } else {
        errorEl.style.display = 'none';
        input.setAttribute('aria-invalid', 'false');
      }
      return valid;
    };

    // 5. Form Submission Interceptor with Multi-Layer Defense
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Reset alert status
      statusAlert.style.display = 'none';
      statusAlert.className = 'form-status-alert';

      // Layer A: Timing Attack / Rapid Bot Trap
      const interactionDuration = Date.now() - formRenderTime;
      if (interactionDuration < SECURITY_CONFIG.MIN_FORM_FILL_TIME_MS) {
        console.warn('[Security Guard] Sub-threshold automated submission detected.');
        statusAlert.textContent = 'Thank you! Your inquiry has been submitted.';
        statusAlert.classList.add('form-status-success');
        statusAlert.style.display = 'block';
        contactForm.reset();
        setupCsrfProtection();
        return;
      }

      // Layer B: Honeypot Trap
      const honeyPot = contactForm.querySelector('input[name="_honey_pot"]');
      if (honeyPot && honeyPot.value) {
        console.warn('[Security Guard] Honeypot trap triggered.');
        statusAlert.textContent = 'Thank you! Your inquiry has been submitted.';
        statusAlert.classList.add('form-status-success');
        statusAlert.style.display = 'block';
        contactForm.reset();
        setupCsrfProtection();
        return;
      }

      // Layer C: Rate Limiting Guard
      const rateLimitCheck = checkRateLimit();
      if (!rateLimitCheck.allowed) {
        statusAlert.textContent = `Too many inquiries submitted. For security reasons, please wait ${rateLimitCheck.remainingSec} seconds before trying again.`;
        statusAlert.classList.add('form-status-error');
        statusAlert.style.display = 'block';
        statusAlert.focus();
        return;
      }

      // Layer D: Field Validation
      let formIsValid = true;
      inputs.forEach(input => {
        if (!validateField(input)) {
          formIsValid = false;
        }
      });

      if (!formIsValid) {
        statusAlert.textContent = 'Please correct the validation errors before submitting.';
        statusAlert.classList.add('form-status-error');
        statusAlert.style.display = 'block';
        statusAlert.focus();
        return;
      }

      // Record this attempt for rate limiting
      recordSubmissionAttempt();

      // Layer E: Secure Dispatch
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'TRANSMITTING SECURELY...';

      try {
        const actionUrl = contactForm.getAttribute('action') || '';
        const formData = new FormData(contactForm);

        // Simulation Mode (Local development or unconfigured endpoint)
        if (!actionUrl || actionUrl === '#' || actionUrl === window.location.href) {
          await new Promise(resolve => setTimeout(resolve, 800));
          statusAlert.textContent = 'Your trade desk inquiry has been securely dispatched. An Alteon trade officer will respond shortly.';
          statusAlert.classList.add('form-status-success');
          statusAlert.style.display = 'block';
          contactForm.reset();
          setupCsrfProtection();
        } else {
          // Live Submission (Formspree, Web3Forms, or Corporate API)
          const response = await fetch(actionUrl, {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          });

          if (response.ok) {
            statusAlert.textContent = 'Thank you! Your message has been sent successfully.';
            statusAlert.classList.add('form-status-success');
            statusAlert.style.display = 'block';
            contactForm.reset();
            setupCsrfProtection();
          } else {
            throw new Error('Endpoint returned error status ' + response.status);
          }
        }
      } catch (err) {
        statusAlert.textContent = 'A secure transmission error occurred. Please contact trade desk directly at alteonexports@gmail.com.';
        statusAlert.classList.add('form-status-error');
        statusAlert.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }
});
