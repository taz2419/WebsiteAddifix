// Keep backend decoupled; update later.
const API_BASE = window.location.origin; // Use current domain for API calls

// Visitor counter functionality
async function trackVisitor() {
  try {
    const response = await fetch(`${API_BASE}/api/visitor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      updateVisitorDisplay(data);
    }
  } catch (error) {
    console.error('Error tracking visitor:', error);
  }
}

function updateVisitorDisplay(data) {
  const visitorCountEl = document.getElementById('visitor-count');
  if (visitorCountEl) {
    visitorCountEl.textContent = data.uniqueVisitors.toLocaleString();
  }
  
  const totalVisitsEl = document.getElementById('total-visits');
  if (totalVisitsEl) {
    totalVisitsEl.textContent = data.totalVisits.toLocaleString();
  }
}

// Track visitor when page loads
document.addEventListener('DOMContentLoaded', () => {
  trackVisitor();
});

const form = document.getElementById('request-form');
const statusEl = document.getElementById('status');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      email: (form.email?.value || '').trim(),
      message: (form.message?.value || '').trim()
    };
    if (!payload.name || !payload.phone) {
      if (statusEl) statusEl.textContent = 'Please provide name and phone.';
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/requests`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Submit failed');
      if (statusEl) statusEl.textContent = 'Thanks! Your request was received.';
      form.reset();
    } catch (err) {
      if (statusEl) statusEl.textContent = 'There was a problem submitting the form.';
    }
  });
}

// Newsletter signup functionality
const newsletterForm = document.getElementById('newsletter-form');
const newsletterStatus = document.getElementById('newsletter-status');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const emailInput = document.getElementById('newsletter-email');
    const email = emailInput.value.trim();
    
    if (!email) {
      if (newsletterStatus) newsletterStatus.textContent = 'Please enter a valid email address.';
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (newsletterStatus) newsletterStatus.textContent = 'Please enter a valid email address.';
      return;
    }
    
    try {
      // Send to backend API
      const response = await fetch(`${API_BASE}/api/newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      if (response.ok) {
        if (newsletterStatus) {
          newsletterStatus.textContent = 'Thanks for signing up! You\'ll receive updates about our latest offerings.';
          newsletterStatus.style.color = 'var(--ink)';
        }
        emailInput.value = '';
      } else {
        throw new Error('Signup failed');
      }
    } catch (error) {
      if (newsletterStatus) {
        newsletterStatus.textContent = 'There was a problem signing you up. Please try again.';
        newsletterStatus.style.color = '#ff6b6b';
      }
    }
  });
}
