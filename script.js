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

// Form validation + functional submit (mailto + WhatsApp fallback)
(() => {
  const form = document.getElementById('demoForm');
  const whBtn = document.getElementById('whBtn');

  // Set WhatsApp link dynamically from fields
  const buildWhatsApp = () => {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const org = document.getElementById('org').value.trim();
    const msg = document.getElementById('msg').value.trim();

    // Cambia al número oficial si lo tienes (formato internacional sin +)
    const targetNumber = "15551234567"; // <--- REEMPLAZA AQUÍ EL NÚMERO OFICIAL
    const text = `Hello airCeption,%0A%0AI'm ${name} from ${org}.%0AEmail: ${email}%0APhone: ${phone}%0A%0AMessage:%0A${msg}`;
    return `https://wa.me/${targetNumber}?text=${text}`;
  };

  whBtn.addEventListener('click', (e)=>{
    whBtn.setAttribute('href', buildWhatsApp());
  });

  form.addEventListener('submit', (event) => {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      form.classList.add('was-validated');
      return;
    }
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const org = document.getElementById('org').value.trim();
    const msg = document.getElementById('msg').value.trim();

    // Cambia al correo oficial
    const to = "hello@airception.com"; // <--- REEMPLAZA AQUÍ EL CORREO OFICIAL
    const subject = encodeURIComponent("Demo Request — airCeption Website");
    const body = encodeURIComponent(
`Name: ${name}
Email: ${email}
Phone: ${phone}
Organization: ${org}

Message:
${msg}`
    );

    // Mailto functional open
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  });
})();

// Cerrar navbar en móvil al tocar un link o botón dentro del menú
(() => {
  const nav = document.getElementById('navbarAirception'); // id del collapse
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

<script>
(() => {
  const f = document.getElementById('demoForm');
  if(!f) return;
  f.addEventListener('submit', (e) => {
    e.preventDefault();

    // antispam honeypot
    if (f.website && f.website.value.trim() !== '') return;

    const name = f.name.value.trim();
    const email = f.email.value.trim();
    const org = f.org.value.trim();
    const role = f.role.value.trim();
    const country = f.country.value;
    const phone = f.phone.value.trim();
    const time = f.time.value;
    const msg = f.message.value.trim();

    if (!name || !email || !org || !country || !document.getElementById('consent').checked) {
      alert('Please complete the required fields.');
      return;
    }

    // Construye el cuerpo del correo
    const to = 'hello@airception.com'; // <-- cámbialo si tienes otro correo
    const subject = encodeURIComponent('airCeption — Demo Request');
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

    const mailtoURL = `mailto:${to}?subject=${subject}&body=${body}`;
    // Mensaje y redirección
    document.getElementById('demoFormMsg').classList.remove('d-none');
    window.location.href = mailtoURL;
  });
})();
</script>
