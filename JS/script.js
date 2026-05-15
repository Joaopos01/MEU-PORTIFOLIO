/* ============================================================
   PORTFOLIO — script.js
   ============================================================ */

/* ---------- 1. HAMBURGER MENU ---------- */
const botaoMenu = document.getElementById('botao-menu');
const navMenu   = document.getElementById('nav-menu');

botaoMenu.addEventListener('click', () => {
  navMenu.classList.toggle('aberto');
  botaoMenu.classList.toggle('ativo');
});

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('aberto');
    botaoMenu.classList.remove('ativo');
  });
});

document.addEventListener('click', (e) => {
  if (!navMenu.contains(e.target) && !botaoMenu.contains(e.target)) {
    navMenu.classList.remove('aberto');
    botaoMenu.classList.remove('ativo');
  }
});

/* ---------- 2. SMOOTH SCROLL ---------- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ---------- 3. NAV HIGHLIGHT ON SCROLL ---------- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('#nav-menu a');

const highlightNav = () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('nav-ativo', link.getAttribute('href') === `#${current}`);
  });
};
window.addEventListener('scroll', highlightNav);

/* ---------- 4. SCROLL REVEAL (IntersectionObserver) ---------- */
const revealEls = document.querySelectorAll(
  '.card-projeto, .carta, .frontend, .backend, .informaçoes, .foto-perfil'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visivel');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach((el, i) => {
  el.style.transitionDelay = `${i * 60}ms`;
  observer.observe(el);
});

/* ---------- 5. TYPED EFFECT (hero) ---------- */
const typedEl = document.querySelector('.profissao');
if (typedEl) {
  const words = ['Engenheiro de Software', 'Desenvolvedor Full Stack', 'Back-end Developer'];
  let wi = 0, ci = 0, deleting = false;

  const type = () => {
    const word = words[wi];
    typedEl.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);

    if (!deleting && ci === word.length + 1) {
      deleting = true;
      setTimeout(type, 1800);
    } else if (deleting && ci === 0) {
      deleting = false;
      wi = (wi + 1) % words.length;
      setTimeout(type, 400);
    } else {
      setTimeout(type, deleting ? 50 : 90);
    }
  };
  setTimeout(type, 1200);
}

/* ---------- 6. PARTICLE CANVAS BACKGROUND ---------- */
const canvas = document.createElement('canvas');
canvas.id = 'particles';
document.body.prepend(canvas);

const ctx = canvas.getContext('2d');
let W, H, particles;

const resize = () => {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
};
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = Math.random() * 1.2 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.a  = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,255,255,${this.a})`;
    ctx.fill();
  }
}

particles = Array.from({ length: 90 }, () => new Particle());

const connectParticles = () => {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,255,255,${0.12 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
};

const animParticles = () => {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animParticles);
};
animParticles();

/* ---------- 7. CURSOR GLOW ---------- */
const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
document.body.appendChild(cursorGlow);

document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});

/* ---------- 8. CARD PROJECT — LED BORDER TRAIL ---------- */
document.querySelectorAll('.card-projeto').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
  });
});

/* ---------- 9. PROJECT PREVIEWS ---------- */
document.querySelectorAll('.card-projeto').forEach(card => {
  const preview = card.querySelector('.project-preview');
  if (!preview) return;

  preview.dataset.title = card.dataset.previewTitle || card.querySelector('h3')?.textContent || 'Projeto';
  preview.dataset.kind = card.dataset.previewKind || '';

  if (card.dataset.previewImage) {
    const image = document.createElement('img');
    image.src = card.dataset.previewImage;
    image.alt = `Preview de ${preview.dataset.title}`;
    preview.replaceChildren(image);
  }

  if (card.dataset.previewUrl) {
    const frame = document.createElement('iframe');
    frame.src = card.dataset.previewUrl;
    frame.title = `Preview de ${preview.dataset.title}`;
    frame.loading = 'lazy';
    preview.replaceChildren(frame);
  }
});

/* ---------- 10. HEADER SHADOW ON SCROLL ---------- */
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
});

/* ---------- 11. SECTION TITLE ANIMATION ---------- */
document.querySelectorAll('h2 span').forEach((span, i) => {
  span.style.animationDelay = `${i * 0.15}s`;
  span.classList.add('titulo-animado');
});
