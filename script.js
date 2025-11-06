// Keep backend decoupled; update later.
const API_BASE = 'https://your-backend.example.com'; // TODO

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
