// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll (native via anchors; extra offset for fixed nav)
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if(id.length>1){
      const el = document.querySelector(id);
      if(el){
        e.preventDefault();
        const top = el.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({top, behavior:'smooth'});
        history.replaceState(null,'',id);
      }
    }
  });
});

// Smooth scroll (con offset por navbar fija)
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if(id.length>1){
      const el = document.querySelector(id);
      if(el){
        e.preventDefault();
        const top = el.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({top, behavior:'smooth'});
        history.replaceState(null,'',id);
      }
    }
  });
});

// Form: mailto a 2 destinatarios + honeypot
(() => {
  const f = document.getElementById('demoForm');
  if(!f) return;

  f.addEventListener('submit', (e) => {
    e.preventDefault();

    // honeypot
    if (f.website && f.website.value.trim() !== '') return;

    const name    = f.name.value.trim();
    const email   = f.email.value.trim();
    const org     = f.org.value.trim();
    const role    = f.role.value.trim();
    const country = f.country.value;
    const phone   = f.phone.value.trim();
    const time    = f.time.value;
    const msg     = f.message.value.trim();
    const consent = document.getElementById('consent').checked;

    if (!name || !email || !org || !country || !consent) {
      alert('Please complete the required fields.');
      return;
    }

    // Destinatarios aprobados por el cliente (Opción A)
    const to = 'john.kelly@airception.com,iain.warner@airception.com';
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

    document.getElementById('demoFormMsg').classList.remove('d-none');
    window.location.href = mailto:${to}?subject=${subject}&body=${body};
  });
})();

    (() => {
      const nav = document.getElementById('navMenu');
      if (!nav) return;
      nav.addEventListener('click', (e) => {
        const el = e.target.closest('.nav-link, .btn');
        if (!el) return;
        if (window.innerWidth < 992) {
          const inst = bootstrap.Collapse.getInstance(nav) || new bootstrap.Collapse(nav, { toggle: false });
          inst.hide();
        }
      });
    })();

 