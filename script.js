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
