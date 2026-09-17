/**
 * AFAN LABIB.S — FUTURISTIC PORTFOLIO LOGIC & INTERACTION ENGINE
 * AMIX-inspired dark mode, canvas digital matrix, interactive modals, and copy utilities.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initNavigation();
  initProjectModals();
  initContactInteractions();
  initScrollReveal();
});

/* --------------------------------------------------------------------------
   1. Ambient Canvas Background (Subtle Digital Grid & Particle Nodes)
   -------------------------------------------------------------------------- */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  // Respect user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 24 : 48;
  let mouse = { x: null, y: null, radius: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.8 + 0.8;
      // Slight color variations between cyan, green, and purple
      const colors = ['rgba(77, 255, 184, 0.65)', 'rgba(100, 215, 255, 0.55)', 'rgba(180, 140, 255, 0.45)'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Subtle mouse avoidance / reaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw subtle connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const alpha = (1 - dist / 110) * 0.12;
          ctx.strokeStyle = `rgba(140, 150, 220, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   2. Floating Navigation & Active Section Tracking
   -------------------------------------------------------------------------- */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  const navToggle = document.getElementById('nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  // Mobile Drawer Toggle
  if (navToggle && mobileDrawer) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      mobileDrawer.setAttribute('aria-hidden', !isOpen);
    });

    // Close mobile drawer on link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // Active section indicator using IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        updateActiveLink(currentId);
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  function updateActiveLink(id) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${id}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   3. Project Details Modal (Interactive Showcase)
   -------------------------------------------------------------------------- */
function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const viewButtons = document.querySelectorAll('.btn-project-view');

  const projectData = {
    'modal-project-01': {
      index: 'PROJECT 01',
      title: 'PERSONAL PORTFOLIO',
      status: 'DEPLOYED // LIVE SPEC',
      description: 'A personal website created to showcase my profile, skills, and projects. Designed with an AMIX-inspired dark futuristic aesthetic, high-contrast typography, and smooth micro-interactions.',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive UI', 'Dark Surface'],
      highlights: [
        'Built with zero heavy frameworks for instant page loads and maximum browser compatibility.',
        'Custom Orbitron and Noto Sans JP typography system with tight leading and neon accents.',
        'Interactive real-time canvas star/grid network with mouse reaction.'
      ],
      codeSample: `// System Profile Configuration
const studentIdentity = {
  name: "Afan Labib.S",
  school: "SMK N Tembarak",
  class: "11",
  number: "01",
  focus: ["Technology", "Programming", "Web"]
};`
    },
    'modal-project-02': {
      index: 'PROJECT 02',
      title: 'JAVA PROGRAMMING',
      status: 'COURSEWORK // CLASS 11',
      description: 'Learning project focused on Java and Object-Oriented Programming (PBO). Explores fundamental computer science concepts including encapsulation, inheritance, polymorphism, and algorithmic data manipulation.',
      tech: ['JAVA', 'PBO / OOP', 'Algorithms', 'Console Architecture'],
      highlights: [
        'Structured modular class hierarchies demonstrating real-world problem domain modeling.',
        'Implementation of input validation, exception handling, and memory-safe operations.',
        'Interactive CLI system for student record management and academic calculation.'
      ],
      codeSample: `public class StudentDeveloper {
    private String name = "Afan Labib.S";
    private String school = "SMK N Tembarak";
    private int grade = 11;

    public void executeLogic() {
        System.out.println("Compiling tech knowledge...");
    }
}`
    },
    'modal-project-03': {
      index: 'PROJECT 03',
      title: 'COMPUTER PROJECT',
      status: 'LAB EXPERIMENT // SYSTEMS',
      description: 'Experiments and practical assignments related to computer technology, digital systems, hardware architecture, and network infrastructure fundamentals.',
      tech: ['COMPUTER HARDWARE', 'SYSTEMS & OS', 'NETWORKING', 'TROUBLESHOOTING'],
      highlights: [
        'Component assembly, power budgeting, and diagnostic testing of x86/ARM systems.',
        'Local area network (LAN) setup, IPv4 subnetting, router configuration, and packet verification.',
        'Operating system optimization, command-line management, and system services debugging.'
      ],
      codeSample: `# Network Diagnostic & Configuration
$ ping -c 4 192.168.1.1
$ ip route show
$ traceroute tembarak.edu.id
[STATUS]: ALL HARDWARE & ROUTING PATHS VERIFIED NOMINAL`
    }
  };

  viewButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetKey = btn.getAttribute('data-target');
      const data = projectData[targetKey];
      if (!data) return;

      modalContent.innerHTML = `
        <div style="margin-bottom: 16px;">
          <span style="font-family: var(--font-code); font-size: 12px; font-weight: 700; color: var(--accent-primary); letter-spacing: 1.5px;">${data.index}</span>
          <span style="font-family: var(--font-code); font-size: 11px; color: var(--text-secondary); margin-left: 12px;">// ${data.status}</span>
        </div>
        <h2 style="font-size: 26px; font-weight: 800; margin-bottom: 16px; letter-spacing: 1px; color: var(--text-main);">${data.title}</h2>
        <p style="font-size: 15px; line-height: 1.7; color: var(--text-secondary); margin-bottom: 24px;">${data.description}</p>
        
        <h4 style="font-size: 13px; font-family: var(--font-code); color: var(--accent-blue); letter-spacing: 1px; margin-bottom: 12px;">TECHNOLOGIES &amp; CONCEPTS</h4>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px;">
          ${data.tech.map(t => `<span style="font-family: var(--font-code); font-size: 11px; background: var(--bg-panel-subtle); border: 1px solid var(--border-subtle); color: var(--accent-primary); padding: 5px 12px; border-radius: 100px;">${t}</span>`).join('')}
        </div>

        <h4 style="font-size: 13px; font-family: var(--font-code); color: var(--accent-blue); letter-spacing: 1px; margin-bottom: 12px;">KEY HIGHLIGHTS</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;">
          ${data.highlights.map(h => `<li style="font-size: 14px; color: var(--text-secondary); display: flex; gap: 10px; align-items: flex-start;"><span style="color: var(--accent-primary);">▹</span><span>${h}</span></li>`).join('')}
        </ul>

        <h4 style="font-size: 13px; font-family: var(--font-code); color: var(--accent-blue); letter-spacing: 1px; margin-bottom: 12px;">SOURCE SNIPPET</h4>
        <pre style="background: var(--bg-main); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 16px; overflow-x: auto; font-family: var(--font-code); font-size: 12.5px; color: #64d7ff; line-height: 1.6; margin-bottom: 28px;"><code>${escapeHtml(data.codeSample)}</code></pre>

        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <button class="btn btn-primary" onclick="closeModal()" style="font-size: 12px; padding: 10px 24px;">CLOSE VIEW</button>
        </div>
      `;

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  window.closeModal = function() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  function escapeHtml(string) {
    return String(string).replace(/[&<>"']/g, function(s) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[s];
    });
  }
}

/* --------------------------------------------------------------------------
   4. Contact Actions: Copy Email & Form Simulation
   -------------------------------------------------------------------------- */
function initContactInteractions() {
  const emailItem = document.getElementById('email-action');
  const toast = document.getElementById('toast');
  const emailAddress = 'afanlabib.s@gmail.com';

  if (emailItem) {
    emailItem.addEventListener('click', () => {
      // Copy to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailAddress).then(() => {
          showToast(`COPIED: ${emailAddress}`);
        }).catch(() => {
          fallbackCopy(emailAddress);
        });
      } else {
        fallbackCopy(emailAddress);
      }
    });

    emailItem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        emailItem.click();
      }
    });
  }

  function fallbackCopy(text) {
    const input = document.createElement('textarea');
    input.value = text;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand('copy');
      showToast(`COPIED: ${text}`);
    } catch (err) {
      window.location.href = `mailto:${text}`;
    }
    document.body.removeChild(input);
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // Quick Transmission Form
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  if (form && feedback) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        feedback.style.color = '#ffb340';
        feedback.textContent = '// ERROR: PLEASE FILL ALL TRANSMISSION FIELDS.';
        return;
      }

      feedback.style.color = 'var(--accent-primary)';
      feedback.textContent = '// ENCRYPTING PACKET & TRANSMITTING...';

      setTimeout(() => {
        feedback.textContent = `// TRANSMISSION CONFIRMED! THANK YOU, ${name.toUpperCase()}. MESSAGE LOGGED.`;
        form.reset();
        showToast('MESSAGE TRANSMITTED TO AFAN');
      }, 900);
    });
  }
}

/* --------------------------------------------------------------------------
   5. Scroll Reveal Micro-Interactions
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const cards = document.querySelectorAll('.skill-card, .project-card, .about-panel, .timeline-card, .contact-box');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(card);
  });
}
