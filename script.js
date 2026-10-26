/* Existing main website behavior. */
if (!document.body.classList.contains("families-page")) {
// 1) Year (tolerante si no existe el span#year)
(() => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// 2) Smooth scroll con offset por navbar fija (una sola vez, sin duplicados)
(() => {
  const nav = document.getElementById('topnav');
  const offset = nav ? nav.offsetHeight : 72;

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id.length <= 1) return;
      const el = document.querySelector(id);
      if (!el) return;

      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      history.replaceState(null, '', id);
    });
  });
})();

// 3) Form: mailto a 1 destinatario + honeypot + copia al portapapeles
(() => {
  const f = document.getElementById('demoForm');
  if (!f) return;

  // util: copiar texto al portapapeles con fallback
  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    } catch (e) {
      return false;
    }
  };

  f.addEventListener('submit', async (e) => {
    e.preventDefault();

    // honeypot
    if (f.website && f.website.value.trim() !== '') return;

    const name    = (f.name?.value || '').trim();
    const email   = (f.email?.value || '').trim();
    const org     = (f.org?.value || '').trim();
    const role    = (f.role?.value || '').trim();
    const country = f.country?.value || '';
    atob
    const phone   = (f.phone?.value || '').trim();
    const time    = f.time?.value || '';
    const msg     = (f.message?.value || '').trim();
    const consent = document.getElementById('consent')?.checked;

    if (!name || !email || !org || !country || !consent) {
      alert('Please complete the required fields.');
      return;
    }

    // Destinatario actualizado por el cliente
    const to = 'demo@airception.com';

    const subject = encodeURIComponent('New Book a Demo Lead for airCeption');
    const plainBody =
`Name: ${name}
Email: ${email}
Organization: ${org}
Role: ${role || '-'}
Country: ${country}
Phone: ${phone || '-'}
Preferred time: ${time || 'Anytime'}

Message:
${msg || '-'}

(Submitted from website Book a Demo)`;

    const body = encodeURIComponent(plainBody);

    // Copia al portapapeles (silencioso; no frena el flujo si falla)
    await copyToClipboard(plainBody);

    // Mostrar aviso y abrir cliente de correo
    const msgNode = document.getElementById('demoFormMsg');
    if (msgNode) msgNode.classList.remove('d-none');

    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  });
})();

// 4) Cerrar el menú colapsable en móvil al hacer click en links/botones
(() => {
  const collapseEl = document.getElementById('navMenu');
  if (!collapseEl) return;

  collapseEl.addEventListener('click', (e) => {
    const el = e.target.closest('.nav-link, .btn');
    if (!el) return;
    if (window.innerWidth < 992) {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false });
      bsCollapse.hide();
    }
  });
})();
}

/* Families pilot behavior. */
(() => {
if (!document.body.classList.contains("families-page")) return;
const dialog=document.querySelector('#info');
function showInfo(title,copy){document.querySelector('#dialog-title').textContent=title;document.querySelector('#dialog-copy').textContent=copy;dialog.showModal()}
document.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
const privacyPolicy = `
<p class="privacy-updated">Last updated: September 2025</p>
<p>airCeption ("we," "our," or "us") respects your privacy and is committed to protecting it. This Privacy Policy explains how we collect, use, and safeguard information when you visit our website.</p>
<h3>Information We Collect</h3>
<ul><li>Personal information you provide (such as name, email, phone number) when you contact us or request a demo.</li><li>Technical data such as IP address, browser type, and pages visited, collected via standard web analytics.</li></ul>
<h3>How We Use Information</h3>
<ul><li>To respond to inquiries and provide requested information.</li><li>To improve our website and user experience.</li><li>To communicate with you about airCeption?s services, events, and updates (with your consent).</li></ul>
<h3>Sharing of Information</h3>
<p>We do not sell or rent personal information. We may share information with trusted service providers who support our operations, or if required by law.</p>
<h3>Data Security</h3>
<p>We use reasonable technical and organizational measures to safeguard your information. However, no system is completely secure.</p>
<h3>Your Rights</h3>
<p>Depending on your location, you may have rights to access, correct, or delete your personal data. To exercise these rights, please contact us via the form on this site.</p>`;
document.querySelector('#privacy-open').addEventListener('click',()=>{
  document.querySelector('#dialog-title').textContent='Privacy Policy';
  document.querySelector('#dialog-copy').innerHTML=privacyPolicy;
  dialog.showModal();
  dialog.scrollTop=0;
});
const form = document.querySelector('#interest-form');
const submitButton = form.querySelector('[type="submit"]');
let formToken = '';
async function loadToken() {
  try {
    const response = await fetch('/api/families', { cache: 'no-store' });
    if (!response.ok) return;
    const data = await response.json();
    formToken = data.token || '';
  } catch { formToken = ''; }
}
loadToken();
form.addEventListener('submit', async event => {
  event.preventDefault();
  const status = document.querySelector('#form-status');
  status.hidden = false;
  status.textContent = 'Sending your registration?';
  submitButton.disabled = true;
  form.setAttribute('aria-busy', 'true');
  const data = new FormData(form);
  const payload = Object.fromEntries(data.entries());
  payload.consent = form.elements.consent.checked;
  payload.token = formToken;
  try {
    if (!formToken) throw new Error('Registration is unavailable. Please refresh the page or try again later.');
    const response = await fetch('/api/families', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), signal: AbortSignal.timeout(20000)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Unable to send. Please try again later.');
    status.textContent = 'Thank you. Your interest has been registered. The airCeption team will be in touch.';
    form.reset();
    await loadToken();
  } catch (error) {
    status.textContent = error.name === 'TimeoutError' ? 'The request timed out. Please try again.' : error.message;
  } finally {
    submitButton.disabled = false;
    form.removeAttribute('aria-busy');
    status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});

})();
