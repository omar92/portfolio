// Data paths
const DATA_PATHS = {
    profile: './data/profile.json',
    skills: './data/skills.json',
    experience: './data/experience.json',
    education: './data/education.json',
    projects: './data/projects.json'
};

// Global data storage
let allData = {};

// Initialize the application
async function init() {
    try {
        // Load all data
        await loadData();

        // Render sections
        renderSkills();
        renderExperience();
        renderProjects();

        // Setup event listeners
        setupEventListeners();

        // Setup animations
        setupAnimations();
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

// Load all JSON data
async function loadData() {
    try {
        const profile = await fetch(DATA_PATHS.profile).then(r => r.json());
        const skills = await fetch(DATA_PATHS.skills).then(r => r.json());
        const experience = await fetch(DATA_PATHS.experience).then(r => r.json());
        const education = await fetch(DATA_PATHS.education).then(r => r.json());
        const projects = await fetch(DATA_PATHS.projects).then(r => r.json());

        allData = {
            profile,
            skills,
            experience,
            education,
            projects
        };
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Render skills section
function renderSkills() {
    const skillsGrid = document.getElementById('skillsGrid');
    const skillCategories = allData.skills.skillCategories;

    skillsGrid.innerHTML = skillCategories.map(category => `
        <div class="skill-category">
            <div class="skill-header">
                <span class="icon">${category.icon}</span>
                <h3>${category.name}</h3>
            </div>
            <div class="skill-list">
                ${category.skills.map(skill => `
                    <div class="skill-item">
                        <div class="skill-name">${skill.name}</div>
                        <div class="skill-level">
                            <span>${skill.level}</span>
                            <span>${skill.proficiency}%</span>
                        </div>
                        <div class="skill-bar">
                            <div class="skill-fill" style="width: ${skill.proficiency}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Render experience section
function renderExperience() {
    const experienceTimeline = document.getElementById('experienceTimeline');
    const experiences = allData.experience;

    experienceTimeline.innerHTML = experiences.map((exp, index) => `
        <div class="experience-item">
            <div class="experience-content">
                <div class="experience-header">
                    <div>
                        <div class="experience-position">${exp.position}</div>
                        <a href="${exp.url}" target="_blank" class="experience-company">${exp.company}</a>
                    </div>
                    <div class="experience-duration">${exp.startDate} - ${exp.endDate}</div>
                </div>
                <p class="experience-description">${exp.responsibilities[0]}</p>
                <div class="experience-skills">
                    ${exp.skills.slice(0, 5).map(skill => `
                        <span class="skill-tag">${skill}</span>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// Render projects section
function renderProjects(filter = 'all') {
    const projectsGrid = document.getElementById('projectsGrid');
    let projects = allData.projects;

    // Filter projects
    if (filter !== 'all') {
        projects = projects.filter(p => p.category.includes(filter));
    }

    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card" onclick="openProjectModal('${project.id}')">
            <div class="project-image" style="background-image: url('${project.image}'); background-size: cover; background-position: center;">
            </div>
            <div class="project-content">
                <span class="project-category">${project.status}</span>
                <h3 class="project-title">${project.name}</h3>
                <p class="project-tagline">${project.tagline}</p>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.slice(0, 3).map(tech => `
                        <span class="tech-tag">${tech}</span>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');

    // Re-attach click listeners for modal
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.cursor = 'pointer';
    });
}

// Get emoji for project category
function getProjectEmoji(category) {
    const emojis = {
        'Professional': '💼',
        'Published': '🎮',
        'Open Source': '⭐',
        'Game in Development': '🚀'
    };
    return emojis[category] || '📁';
}

// Open project modal
function openProjectModal(projectId) {
    const project = allData.projects.find(p => p.id === projectId);
    if (!project) return;

    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');

    let content = `
        <h2>${project.name}</h2>
        <p><strong>${project.tagline}</strong></p>
        <p>${project.longDescription}</p>
    `;

    if (project.achievements && project.achievements.length > 0) {
        content += `
            <h3 style="margin-top: 20px; color: var(--primary);">Key Achievements</h3>
            <ul>
                ${project.achievements.map(a => `<li>${a}</li>`).join('')}
            </ul>
        `;
    }

    if (project.responsibilities && project.responsibilities.length > 0) {
        content += `
            <h3 style="margin-top: 20px; color: var(--primary);">Responsibilities</h3>
            <ul>
                ${project.responsibilities.map(r => `<li>${r}</li>`).join('')}
            </ul>
        `;
    }

    if (project.subProjects && project.subProjects.length > 0) {
        content += `
            <h3 style="margin-top: 20px; color: var(--primary);">Sub-Projects</h3>
            <ul>
                ${project.subProjects.map(sp => `<li><strong>${sp.name}</strong>: ${sp.description}</li>`).join('')}
            </ul>
        `;
    }

    if (project.sections && project.sections.length > 0) {
        project.sections.forEach(section => {
            content += `<h3 style="margin-top: 20px; color: var(--primary);">${section.title}</h3>`;
            
            if (section.type === 'iframe') {
                content += `
                    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin: 20px 0;">
                        <iframe 
                            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; border-radius: 10px;"
                            src="${section.content}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    </div>
                `;
            } else if (section.type === 'images') {
                content += `
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
                        ${section.images.map(img => `
                            <img src="${img}" alt="Screenshot" style="width: 100%; border-radius: 10px; border: 1px solid rgba(99, 102, 241, 0.3);">
                        `).join('')}
                    </div>
                `;
            }
        });
    }

    if (project.links && project.links.length > 0) {
        content += `
            <div style="margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
                ${project.links.map(link => `
                    <a href="${link.url}" target="_blank" class="btn btn-primary" style="margin-right: 10px;">
                        ${link.text}
                    </a>
                `).join('')}
            </div>
        `;
    }

    modalBody.innerHTML = content;
    modal.classList.add('active');
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when nav link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Project filter
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            renderProjects(filter === 'all' ? 'all' : filter);
        });
    });

    // Modal close
    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');

    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.borderBottomColor = 'rgba(99, 102, 241, 0.3)';
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        } else {
            navbar.style.borderBottomColor = 'rgba(99, 102, 241, 0.1)';
            navbar.style.background = 'rgba(15, 23, 42, 0.8)';
        }
    });
}

// Setup scroll animations with GSAP
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Animate sections on scroll
    const sections = document.querySelectorAll('.about, .skills, .experience, .projects, .contact');

    sections.forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Animate skill cards
    const skillCards = document.querySelectorAll('.skill-category');
    skillCards.forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            x: index % 2 === 0 ? -50 : 50,
            duration: 0.6,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: '.skills',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Animate project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.6,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: '.projects',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
