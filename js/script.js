document.addEventListener('DOMContentLoaded', () => {
  // --- Header Scroll Effect ---
  const header = document.querySelector('header');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
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
      
      // Accessibility: trap focus / update accessibility attributes
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
    // Check user preference for motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      // Periodic shift animation simulating shipping changes
      setInterval(() => {
        const rows = manifestBody.querySelectorAll('.manifest-row');
        if (rows.length > 1) {
          const firstRow = rows[0];
          
          // Apply sliding fade effect
          firstRow.style.opacity = '0';
          firstRow.style.transform = 'translateY(-20px)';
          
          setTimeout(() => {
            // Move to end of queue and reset inline styling
            manifestBody.appendChild(firstRow);
            firstRow.style.opacity = '1';
            firstRow.style.transform = 'translateY(0)';
          }, 300);
        }
      }, 4000);
    }
  }

  // --- Contact Form Handling & Validation ---
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const statusAlert = document.getElementById('form-status-alert');

    // Simple email format checker
    const isValidEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Live validation
    const inputs = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
    inputs.forEach(input => {
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

      let valid = true;
      if (input.value.trim() === '') {
        errorEl.textContent = 'This field is required.';
        errorEl.style.display = 'block';
        input.setAttribute('aria-invalid', 'true');
        valid = false;
      } else if (input.type === 'email' && !isValidEmail(input.value)) {
        errorEl.textContent = 'Please enter a valid email address.';
        errorEl.style.display = 'block';
        input.setAttribute('aria-invalid', 'true');
        valid = false;
      } else {
        errorEl.style.display = 'none';
        input.setAttribute('aria-invalid', 'false');
      }
      return valid;
    };

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear alert status
      statusAlert.style.display = 'none';
      statusAlert.className = 'form-status-alert';

      // Honeypot spam test
      const honeyPotValue = contactForm.querySelector('input[name="_honey_pot"]').value;
      if (honeyPotValue) {
        console.warn('Spam submission detected.');
        statusAlert.textContent = 'Your message has been processed successfully.';
        statusAlert.classList.add('form-status-success');
        statusAlert.style.display = 'block';
        contactForm.reset();
        return;
      }

      // Check all required fields
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
        // Announce error to screen readers
        statusAlert.focus();
        return;
      }

      // Submit form
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'SENDING...';

      try {
        const formData = new FormData(contactForm);
        const actionUrl = contactForm.getAttribute('action') || '#';

        // Check if using default placeholder action
        if (actionUrl === '#' || actionUrl === '') {
          // Simulate local network delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          statusAlert.textContent = '[Simulation Mode] Thank you! Your request has been successfully submitted.';
          statusAlert.classList.add('form-status-success');
          statusAlert.style.display = 'block';
          contactForm.reset();
        } else {
          // Actual post request (Formspree / Web3Forms)
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
          } else {
            throw new Error('Form submission failed.');
          }
        }
      } catch (err) {
        statusAlert.textContent = 'An error occurred while sending your message. Please try again later.';
        statusAlert.classList.add('form-status-error');
        statusAlert.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }
});
