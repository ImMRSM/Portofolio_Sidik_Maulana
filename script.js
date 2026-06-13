// Rotating text effect
class TxtRotate {
    constructor(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    }
    tick() {
        let i = this.loopNum % this.toRotate.length;
        let fullTxt = this.toRotate[i];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

        let that = this;
        let delta = 300 - Math.random() * 100;

        if (this.isDeleting) { delta /= 2; }

        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }

        setTimeout(function() {
            that.tick();
        }, delta);
    }
}

window.onload = function() {
    let elements = document.getElementsByClassName('txt-rotate');
    for (let i=0; i<elements.length; i++) {
        let toRotate = elements[i].getAttribute('data-rotate');
        let period = elements[i].getAttribute('data-period');
        if (toRotate) {
          new TxtRotate(elements[i], JSON.parse(toRotate), period);
        }
    }
    // Load skills from Python API
    loadSkillsFromPython();
};

async function loadSkillsFromPython() {
    const container = document.getElementById('skills-container');
    container.innerHTML = '<div class="col-12 text-center text-info">Mengunduh data dari Python API ...</div>';
    try {
        const response = await fetch('/api/skills');
        if (!response.ok) throw new Error('API Python tidak merespon');
        const skills = await response.json();
        displaySkills(skills);
    } catch (error) {
        console.warn('Fallback ke static data karena:', error);
        const fallback = [
            { name: "PHP & Backend", icon: "bi-filetype-php", level: 90 },
            { name: "Python (Flask)", icon: "bi-filetype-py", level: 88 },
            { name: "JavaScript ES6+", icon: "bi-filetype-js", level: 92 },
            { name: "Bootstrap 5", icon: "bi-bootstrap", level: 95 },
            { name: "Git & Vercel", icon: "bi-github", level: 87 },
            { name: "Responsive Design", icon: "bi-phone", level: 94 }
        ];
        displaySkills(fallback);
    }
}

function displaySkills(skillsArray) {
    const container = document.getElementById('skills-container');
    container.innerHTML = '';
    skillsArray.forEach(skill => {
        const col = document.createElement('div');
        col.className = 'col-md-4 col-lg-3';
        col.innerHTML = `
            <div class="skill-card">
                <i class="bi ${skill.icon || 'bi-cpu'} skill-icon"></i>
                <h5 class="mt-3">${skill.name}</h5>
                <div class="progress mt-2" style="height: 6px;">
                    <div class="progress-bar bg-info" style="width: ${skill.level}%; box-shadow: 0 0 6px cyan;"></div>
                </div>
                <small class="text-muted">Proficiency ${skill.level}%</small>
            </div>
        `;
        container.appendChild(col);
    });
}

// Handle form submission ke PHP
const contactForm = document.getElementById('neonContactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const feedbackDiv = document.getElementById('formFeedback');

        if (!name || !email || !message) {
            feedbackDiv.innerHTML = '<div class="alert alert-danger">⚠️ Lengkapi semua field!</div>';
            return;
        }

        feedbackDiv.innerHTML = '<div class="alert alert-info">Mengirim pesan ke handler PHP ...</div>';
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('message', message);

            const response = await fetch('handler.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.status === 'success') {
                feedbackDiv.innerHTML = `<div class="alert alert-success">✨ ${result.message} ✨</div>`;
                contactForm.reset();
            } else {
                feedbackDiv.innerHTML = `<div class="alert alert-danger">❌ ${result.message}</div>`;
            }
        } catch (err) {
            feedbackDiv.innerHTML = `<div class="alert alert-danger">Gagal terhubung ke server PHP: ${err.message}</div>`;
        }
    });
}

// Smooth scroll for nav
document.querySelectorAll('.nav-link').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if(href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if(target) target.scrollIntoView({behavior: 'smooth'});
        }
    });
});