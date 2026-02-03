// Modern Portfolio 2026 - Omar Sleam
// Interactive Features & Data Loading

// ====================
// Data Storage
// ====================
const pageData = {
  experience: [],
  education: [],
  projects: [],
  contact: []
};

// ====================
// Particle Background
// ====================
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const particleCount = 100;
  
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    }
    
    draw() {
      ctx.fillStyle = `rgba(0, 245, 255, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    // Draw connections
    particles.forEach((particle, i) => {
      particles.slice(i + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          ctx.strokeStyle = `rgba(0, 245, 255, ${0.2 * (1 - distance / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.stroke();
        }
      });
    });
    
    requestAnimationFrame(animateParticles);
  }
  
  animateParticles();
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ====================
// Navigation
// ====================
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Update active nav link
    let current = '';
    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  });
  
  // Mobile menu
  hamburger?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
  
  // Smooth scroll
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      targetSection?.scrollIntoView({ behavior: 'smooth' });
      navMenu.classList.remove('active');
    });
  });
}

// ====================
// Typing Effect
// ====================
function initTypingEffect() {
  const typedTextSpan = document.querySelector('.typed-text');
  if (!typedTextSpan) return;
  
  const textArray = ['Game Developer', 'Unity Expert', 'VR Specialist', 'Multiplayer Pro', 'Technical Lead'];
  const typingDelay = 100;
  const erasingDelay = 50;
  const newTextDelay = 2000;
  let textArrayIndex = 0;
  let charIndex = 0;
  
  function type() {
    if (charIndex < textArray[textArrayIndex].length) {
      typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingDelay);
    } else {
      setTimeout(erase, newTextDelay);
    }
  }
  
  function erase() {
    if (charIndex > 0) {
      typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, erasingDelay);
    } else {
      textArrayIndex++;
      if (textArrayIndex >= textArray.length) textArrayIndex = 0;
      setTimeout(type, typingDelay + 500);
    }
  }
  
  setTimeout(type, newTextDelay);
}

// ====================
// Data Loading
// ====================
async function loadData() {
  try {
    console.log('Loading portfolio data...');
    
    const [experience, education, projects, contact] = await Promise.all([
      fetch('data/experience.json').then(res => res.json()),
      fetch('data/education.json').then(res => res.json()),
      fetch('data/projects.json').then(res => res.json()),
      fetch('data/contact.json').then(res => res.json())
    ]);
    
    pageData.experience = experience;
    pageData.education = education;
    pageData.projects = projects;
    pageData.contact = contact;
    
    console.log('Data loaded successfully');
    
    renderExperience();
    renderEducation();
    renderProjects();
    renderContact();
    renderFooterSocial();
    
    initAnimations();
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// ====================
// Render Experience
// ====================
function renderExperience() {
  const container = document.querySelector('[data-section="experience"]');
  if (!container) return;
  
  container.innerHTML = pageData.experience.map(exp => `
    <div class="timeline-item fade-in">
      <div class="timeline-content">
        <div class="timeline-dot"></div>
        <div class="timeline-company">
          <img src="${exp.logo}" alt="${exp.company}" class="timeline-logo">
          <div class="timeline-header">
            <h3><a href="${exp.url}" target="_blank">${exp.company}</a></h3>
            <div class="timeline-position">${exp.position}</div>
            <div class="timeline-date">${exp.startDate} - ${exp.endDate}</div>
          </div>
        </div>
        <div class="timeline-description">
          <ul>
            ${exp.description.map(desc => `<li>${desc}</li>`).join('')}
          </ul>
        </div>
        <div class="timeline-tags">
          ${exp.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

// ====================
// Render Education
// ====================
function renderEducation() {
  const container = document.querySelector('[data-section="education"]');
  if (!container) return;
  
  container.innerHTML = pageData.education.map(edu => `
    <div class="education-card fade-in">
      <h3 class="education-school">${edu.school}</h3>
      <div class="education-degree">${edu.degree}</div>
      <div class="education-date">${edu.startYear} - ${edu.endYear}</div>
      <ul class="education-details">
        ${edu.details.map(detail => `<li><strong>${detail.label}:</strong> ${detail.value}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

// ====================
// Render Projects
// ====================
function renderProjects() {
  const container = document.querySelector('[data-section="projects"]');
  if (!container) return;
  
  container.innerHTML = pageData.projects.map(project => `
    <div class="project-card fade-in" data-project-id="${project.id}" data-filters="${project.filterTags.join(' ')}">
      <img src="${project.image}" alt="${project.name}" class="project-image">
      <div class="project-body">
        <h3 class="project-title">${project.name}</h3>
        <p class="project-description">${project.shortDescription}</p>
        <div class="project-tags">
          ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
  
  // Add click handlers to project cards
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.dataset.projectId;
      const project = pageData.projects.find(p => p.id === projectId);
      if (project) showProjectModal(project);
    });
  });
  
  // Initialize filters
  initProjectFilters();
}

// ====================
// Project Filters
// ====================
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      
      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.filters.includes(filter)) {
          card.style.display = 'block';
          setTimeout(() => card.style.opacity = '1', 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });
}

// ====================
// Project Modal
// ====================
function showProjectModal(project) {
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  
  let sectionsHTML = '';
  if (project.sections) {
    sectionsHTML = project.sections.map(section => {
      let content = '';
      if (section.type === 'iframe') {
        content = section.content;
      } else if (section.type === 'images') {
        content = `<div class="modal-images-grid">${section.images.map(img => `<img src="${img}" alt="${project.name}">`).join('')}</div>`;
      } else {
        content = `<p>${section.content}</p>`;
      }
      return `<h3>${section.title}</h3>${content}`;
    }).join('');
  }
  
  let featuresHTML = '';
  if (project.features) {
    featuresHTML = `
      <h3>Key Features</h3>
      <ul>
        ${project.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
    `;
  }
  
  let subProjectsHTML = '';
  if (project.subProjects) {
    subProjectsHTML = `<h3>Sub Projects</h3>` + project.subProjects.map(sp => `
      <div class="sub-project">
        <h3>${sp.title}</h3>
        <div class="project-tags">
          ${sp.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
        </div>
        <p>${sp.description}</p>
      </div>
    `).join('');
  }
  
  let linksHTML = '';
  if (project.links) {
    linksHTML = `
      <div class="modal-links">
        ${project.links.map(link => `
          <a href="${link.url}" target="${link.target}" class="btn-primary">
            <i class="fas fa-external-link-alt"></i> ${link.text}
          </a>
        `).join('')}
      </div>
    `;
  }
  
  modalBody.innerHTML = `
    <h2>${project.name}</h2>
    <div class="modal-tags-wrapper">
      ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
    </div>
    <div class="modal-description">
      <p>${project.description.replace(/\n/g, '</p><p>')}</p>
    </div>
    ${featuresHTML}
    ${subProjectsHTML}
    ${sectionsHTML}
    ${linksHTML}
  `;
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function initModal() {
  const modal = document.getElementById('projectModal');
  const modalClose = document.querySelector('.modal-close');
  const modalOverlay = document.querySelector('.modal-overlay');
  
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  };
  
  modalClose?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', closeModal);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// ====================
// Render Contact
// ====================
function renderContact() {
  const container = document.querySelector('[data-section="contact"]');
  if (!container) return;
  
  container.innerHTML = pageData.contact.map(contact => `
    <a href="${contact.url}" class="contact-method" target="_blank">
      <div class="contact-icon">
        <i class="${contact.icon}"></i>
      </div>
      <div class="contact-info">
        <div class="contact-title">${contact.title || contact.label}</div>
        <div class="contact-subtitle">${contact.subtitle || contact.label}</div>
        ${contact.description ? `<div class="contact-description">${contact.description}</div>` : ''}
      </div>
    </a>
  `).join('');
}

// ====================
// Render Footer Social
// ====================
function renderFooterSocial() {
  const container = document.querySelector('[data-section="footer-social"]');
  if (!container) return;
  
  container.innerHTML = pageData.contact.map(contact => `
    <a href="${contact.url}" class="social-icon" target="_blank">
      <i class="${contact.icon}"></i>
    </a>
  `).join('');
}

// ====================
// Contact Form
// ====================
function initContactForm() {
  const form = document.getElementById('contactForm');
  
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Create mailto link
    const mailtoLink = `mailto:omarabdelzaher@gmail.com?subject=Portfolio Contact from ${name}&body=${encodeURIComponent(message)}%0A%0AFrom: ${name}%0AEmail: ${email}`;
    
    window.location.href = mailtoLink;
    
    // Show success message (optional)
    alert('Opening your email client...');
  });
}

// ====================
// Scroll Animations
// ====================
function initAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ====================
// Initialize Everything
// ====================
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing portfolio...');
  
  initParticles();
  initNavigation();
  initTypingEffect();
  initModal();
  initContactForm();
  loadData();
  
  console.log('Portfolio initialized!');
});
