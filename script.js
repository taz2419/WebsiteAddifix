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

// Language Switcher
const translations = {
  en: {
    // Navigation
    'contact': 'Contact',
    
    // Hero Section
    'headline': 'Vintage Precision Re-engineered',
    'collector-btn': 'Are you a collector?',
    'mechanic-btn': 'Are you a mechanic?',
    
    // Gallery
    'gallery-title-1': 'Additive Manufacturing parts with classic precision',
    'gallery-subtitle-1': 'Pure form. Subtle detail.',
    'gallery-title-2': 'Enduring craft.',
    'gallery-subtitle-2': 'Modern methods. Vintage soul.',
    
    // Process Section
    'process-title': 'Our Precision Manufacturing Process',
    'process-subtitle': 'From vintage blueprints to modern precision - discover how we bring classic automotive parts back to life',
    
    // Step 1
    'step1-title': 'Consultation with the Team',
    'step1-desc': 'Our expert team conducts comprehensive laser scanning of vintage components through either on-site consultation visits or secure part submission to our facility for detailed analysis and technical documentation.',
    'step1-feat1': '3D scanning technology',
    'step1-feat2': 'Material composition analysis',
    'step1-feat3': 'Historical research',
    
    // Step 2
    'step2-title': 'Precision CAD Design',
    'step2-desc': 'Our engineers create exact digital replicas using advanced CAD software, optimizing designs for modern manufacturing while preserving authentic specifications.',
    'step2-feat1': 'Computer-aided design',
    'step2-feat2': 'Stress analysis simulation',
    'step2-feat3': 'Dimensional accuracy verification',
    
    // Step 3
    'step3-title': 'Additive Manufacturing',
    'step3-desc': 'Using state-of-the-art 3D printing technology, we manufacture parts with incredible precision, utilizing materials that match or exceed original specifications.',
    'step3-feat1': 'Industrial-grade 3D printers',
    'step3-feat2': 'Premium material selection',
    'step3-feat3': 'Layer-by-layer precision',
    
    // Step 4
    'step4-title': 'Quality Control & Finishing',
    'step4-desc': 'Every part undergoes rigorous quality control and precise finishing processes to ensure it meets our exacting standards and your expectations.',
    'step4-feat1': 'Multi-point inspection',
    'step4-feat2': 'Surface finishing',
    'step4-feat3': 'Performance testing',
    
    // Step 5
    'step5-title': 'Secure Packaging & Delivery',
    'step5-desc': 'Your precision-manufactured vintage parts are carefully packaged and delivered with detailed documentation and installation guidance.',
    'step5-feat1': 'Protective packaging',
    'step5-feat2': 'Installation instructions',
    'step5-feat3': 'Authenticity certification',
    
    // Newsletter
    'newsletter-title': 'Sign up with your email to stay up to date with more news and new product offerings',
    'newsletter-placeholder': 'Enter your email address',
    'newsletter-btn': 'Subscribe',
    
    // Footer
    'visitor-label': 'Unique Visitors',
    'visits-label': 'Total Visits'
  },
  
  it: {
    // Navigation
    'contact': 'Contatto',
    
    // Hero Section
    'headline': 'Precisione Vintage Ri-ingegnerizzata',
    'collector-btn': 'Sei un collezionista?',
    'mechanic-btn': 'Sei un meccanico?',
    
    // Gallery
    'gallery-title-1': 'Produzione additiva con precisione classica',
    'gallery-subtitle-1': 'Forma pura. Dettaglio sottile.',
    'gallery-title-2': 'Artigianato duraturo.',
    'gallery-subtitle-2': 'Metodi moderni. Anima vintage.',
    
    // Process Section
    'process-title': 'Il Nostro Processo di Produzione di Precisione',
    'process-subtitle': 'Dai progetti vintage alla precisione moderna - scopri come riportiamo in vita i pezzi automobilistici classici',
    
    // Step 1
    'step1-title': 'Consulenza con il Team',
    'step1-desc': 'Il nostro team di esperti conduce scansioni laser complete dei componenti vintage attraverso visite di consulenza in loco o invio sicuro dei pezzi alla nostra struttura per analisi dettagliate e documentazione tecnica.',
    'step1-feat1': 'Tecnologia di scansione 3D',
    'step1-feat2': 'Analisi della composizione materiale',
    'step1-feat3': 'Ricerca storica',
    
    // Step 2
    'step2-title': 'Progettazione CAD di Precisione',
    'step2-desc': 'I nostri ingegneri creano repliche digitali esatte utilizzando software CAD avanzati, ottimizzando i progetti per la produzione moderna preservando le specifiche autentiche.',
    'step2-feat1': 'Progettazione assistita da computer',
    'step2-feat2': 'Simulazione analisi stress',
    'step2-feat3': 'Verifica precisione dimensionale',
    
    // Step 3
    'step3-title': 'Produzione Additiva',
    'step3-desc': 'Utilizzando tecnologia di stampa 3D all\'avanguardia, produciamo pezzi con incredibile precisione, utilizzando materiali che eguagliano o superano le specifiche originali.',
    'step3-feat1': 'Stampanti 3D di livello industriale',
    'step3-feat2': 'Selezione materiali premium',
    'step3-feat3': 'Precisione strato per strato',
    
    // Step 4
    'step4-title': 'Controllo Qualità e Finitura',
    'step4-desc': 'Ogni pezzo subisce rigorosi controlli di qualità e processi di finitura precisi per garantire che soddisfi i nostri standard esigenti e le vostre aspettative.',
    'step4-feat1': 'Ispezione multi-punto',
    'step4-feat2': 'Finitura superficiale',
    'step4-feat3': 'Test delle prestazioni',
    
    // Step 5
    'step5-title': 'Imballaggio Sicuro e Consegna',
    'step5-desc': 'I vostri pezzi vintage di precisione sono accuratamente imballati e consegnati con documentazione dettagliata e istruzioni di installazione.',
    'step5-feat1': 'Imballaggio protettivo',
    'step5-feat2': 'Istruzioni di installazione',
    'step5-feat3': 'Certificazione di autenticità',
    
    // Newsletter
    'newsletter-title': 'Iscriviti con la tua email per rimanere aggiornato con più notizie e nuove offerte di prodotti',
    'newsletter-placeholder': 'Inserisci il tuo indirizzo email',
    'newsletter-btn': 'Iscriviti',
    
    // Footer
    'visitor-label': 'Visitatori Unici',
    'visits-label': 'Visite Totali'
  }
};

let currentLang = localStorage.getItem('preferred-language') || 'en';

function updateLanguageLabels() {
  const enLabel = document.getElementById('lang-en');
  const itLabel = document.getElementById('lang-it');
  
  if (enLabel && itLabel) {
    enLabel.classList.toggle('active', currentLang === 'en');
    itLabel.classList.toggle('active', currentLang === 'it');
  }
}

function translatePage(lang) {
  const elements = document.querySelectorAll('[data-translate]');
  
  elements.forEach(element => {
    const key = element.getAttribute('data-translate');
    if (translations[lang] && translations[lang][key]) {
      if (element.tagName === 'INPUT' && element.type === 'email') {
        element.placeholder = translations[lang][key];
      } else {
        element.textContent = translations[lang][key];
      }
    }
  });
  
  currentLang = lang;
  localStorage.setItem('preferred-language', lang);
  updateLanguageLabels();
}

// Initialize language switcher
document.addEventListener('DOMContentLoaded', () => {
  const langToggle = document.getElementById('langToggle');
  
  if (langToggle) {
    // Set initial state
    langToggle.checked = currentLang === 'it';
    updateLanguageLabels();
    
    // Add event listener
    langToggle.addEventListener('change', (e) => {
      const newLang = e.target.checked ? 'it' : 'en';
      translatePage(newLang);
    });
  }
  
  // Apply saved language preference
  if (currentLang === 'it') {
    translatePage('it');
  }
});

// Part card click-through to product detail page
document.addEventListener('DOMContentLoaded', () => {
  const partCards = document.querySelectorAll('.part-card');
  if (!partCards.length) return;

  partCards.forEach((card) => {
    card.addEventListener('click', (event) => {
      const link = card.querySelector('a');
      if (link) return;

      const titleEl = card.querySelector('h3');
      const descEl = card.querySelector('p');
      const imgEl = card.querySelector('img');

      const name = titleEl?.textContent?.trim() || 'Ferrari Part';
      const desc = descEl?.textContent?.trim() || 'Authentic replacement part produced to match factory specifications.';
      const image = imgEl?.getAttribute('src') || 'process_images/ferrari_logo.png';
      const alt = imgEl?.getAttribute('alt') || name;

      const params = new URLSearchParams({ name, desc, image, alt });
      window.location.href = `product.html?${params.toString()}`;
    });
  });
});
