// Static GitHub Pages version - simulates visitor counter
function simulateVisitorCounter() {
  const visitorCountEl = document.getElementById('visitor-count');
  const totalVisitsEl = document.getElementById('total-visits');
  
  if (visitorCountEl && totalVisitsEl) {
    // Get or initialize visitor counts from localStorage
    let unique = parseInt(localStorage.getItem('github-pages-unique') || '127');
    let total = parseInt(localStorage.getItem('github-pages-total') || '243');
    
    // Small chance to increment unique visitors (30% chance)
    if (Math.random() < 0.3) {
      unique += 1;
    }
    total += 1;
    
    // Store updated counts
    localStorage.setItem('github-pages-unique', unique.toString());
    localStorage.setItem('github-pages-total', total.toString());
    
    // Update display
    visitorCountEl.textContent = unique.toLocaleString();
    totalVisitsEl.textContent = total.toLocaleString();
  }
}

// Track visitor when page loads
document.addEventListener('DOMContentLoaded', () => {
  simulateVisitorCounter();
});

// Contact form handling with Formspree integration
const form = document.getElementById('request-form');
const statusEl = document.getElementById('status');

// Check if page loaded with success parameter
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('success') === 'true') {
    if (statusEl) {
      statusEl.textContent = 'Thanks! Your message has been sent successfully.';
      statusEl.style.color = 'var(--ink)';
    }
    // Remove success parameter from URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const name = formData.get('name')?.trim();
    const phone = formData.get('phone')?.trim();
    
    if (!name || !phone) {
      if (statusEl) {
        statusEl.textContent = 'Please provide name and phone.';
        statusEl.style.color = '#ff6b6b';
      }
      return;
    }
    
    // Show loading message
    if (statusEl) {
      statusEl.textContent = 'Sending your message...';
      statusEl.style.color = 'var(--muted)';
    }
    
    try {
      // First attempt: Use fetch with proper headers
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        if (statusEl) {
          statusEl.textContent = 'Thanks! Your message has been sent successfully. We\'ll get back to you soon.';
          statusEl.style.color = 'var(--ink)';
        }
        form.reset();
        
        // Track form submission in Google Analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'contact_form_submit', {
            'event_category': 'engagement',
            'event_label': 'contact_form',
            'value': 1
          });
        }
      } else if (response.status === 422) {
        // Formspree validation error
        const data = await response.json();
        if (statusEl) {
          statusEl.textContent = 'Please check your form and try again.';
          statusEl.style.color = '#ff6b6b';
        }
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Fallback: Allow natural form submission to Formspree
      if (statusEl) {
        statusEl.textContent = 'Redirecting to complete your submission...';
        statusEl.style.color = 'var(--muted)';
      }
      
      // Remove preventDefault and submit naturally
      setTimeout(() => {
        form.removeEventListener('submit', arguments.callee);
        form.submit();
      }, 1000);
    }
  });
}

// Newsletter signup functionality with EmailJS integration
const newsletterForm = document.getElementById('newsletter-form');
const newsletterStatus = document.getElementById('newsletter-status');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const emailInput = document.getElementById('newsletter-email');
    const email = emailInput.value.trim();
    
    if (!email) {
      if (newsletterStatus) {
        newsletterStatus.textContent = 'Please enter a valid email address.';
        newsletterStatus.style.color = '#ff6b6b';
      }
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (newsletterStatus) {
        newsletterStatus.textContent = 'Please enter a valid email address.';
        newsletterStatus.style.color = '#ff6b6b';
      }
      return;
    }
    
    // Show loading message
    if (newsletterStatus) {
      newsletterStatus.textContent = 'Subscribing...';
      newsletterStatus.style.color = 'var(--muted)';
    }
    
    try {
      // Check if EmailJS is configured
      if (typeof emailjs !== 'undefined' && window.EMAILJS_SERVICE_ID) {
        // Send email notification to you about new signup
        await emailjs.send(
          window.EMAILJS_SERVICE_ID,
          window.EMAILJS_TEMPLATE_ID,
          {
            to_email: 'your-email@domain.com', // Replace with your email
            subscriber_email: email,
            signup_date: new Date().toLocaleDateString(),
            signup_time: new Date().toLocaleTimeString()
          }
        );
        
        if (newsletterStatus) {
          newsletterStatus.textContent = 'Thanks for signing up! You\'ll receive updates about our latest offerings.';
          newsletterStatus.style.color = 'var(--ink)';
        }
        
        // Track newsletter signup in Google Analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'newsletter_signup', {
            'event_category': 'engagement',
            'event_label': 'newsletter'
          });
        }
      } else {
        // Demo mode - store locally
        const emails = JSON.parse(localStorage.getItem('newsletter-emails') || '[]');
        
        // Check if email already exists
        if (emails.includes(email.toLowerCase())) {
          if (newsletterStatus) {
            newsletterStatus.textContent = 'This email is already subscribed!';
            newsletterStatus.style.color = '#ffb84d';
          }
          return;
        }
        
        // Add new email
        emails.push(email.toLowerCase());
        localStorage.setItem('newsletter-emails', JSON.stringify(emails));
        
        if (newsletterStatus) {
          newsletterStatus.textContent = 'Demo mode: Email stored locally. Set up EmailJS for real notifications.';
          newsletterStatus.style.color = 'var(--ink)';
        }
      }
      
      // Clear the form
      emailInput.value = '';
      
    } catch (error) {
      if (newsletterStatus) {
        newsletterStatus.textContent = 'There was a problem with your subscription. Please try again.';
        newsletterStatus.style.color = '#ff6b6b';
      }
    }
  });
}
