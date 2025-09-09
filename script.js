
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

// 3) Form: mailto a 2 destinatarios + honeypot
(() => {
  const f = document.getElementById('demoForm');
  if (!f) return;

  f.addEventListener('submit', (e) => {
    e.preventDefault();

    // honeypot
    if (f.website && f.website.value.trim() !== '') return;

    const name    = (f.name?.value || '').trim();
    const email   = (f.email?.value || '').trim();
    const org     = (f.org?.value || '').trim();
    const role    = (f.role?.value || '').trim();
    const country = f.country?.value || '';
    const phone   = (f.phone?.value || '').trim();
    const time    = f.time?.value || '';
    const msg     = (f.message?.value || '').trim();
    const consent = document.getElementById('consent')?.checked;

    if (!name || !email || !org || !country || !consent) {
      alert('Please complete the required fields.');
      return;
    }

    // Destinatarios (opción A del cliente)
    const to = ['john.kelly@airception.com', 'iain.warner@airception.com'].join(',');

    const subject = encodeURIComponent('New Book a Demo Lead for airCeption');
    const body = encodeURIComponent(
`Name: ${name}
Email: ${email}
Organization: ${org}
Role: ${role || '-'}
Country: ${country}
Phone: ${phone || '-'}
Preferred time: ${time || 'Anytime'}

Message:
${msg || '-'}

(Submitted from website Book a Demo)`
    );

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

  // Cierra al tocar cualquier .nav-link o .btn dentro del collapse
  collapseEl.addEventListener('click', (e) => {
    const el = e.target.closest('.nav-link, .btn');
    if (!el) return;
    if (window.innerWidth < 992) {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false });
      bsCollapse.hide();
    }
  });
})();