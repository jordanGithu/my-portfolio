
document.addEventListener('DOMContentLoaded', function() {
    
    setupBifrostNav();
    
    setupMobileMenu();
    
    setupRealmNavigation();
    
    setupContactForm();
});

function setupParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 40, density: { enable: true, value_area: 800 } },
                color: { value: ["#a4bfd4", "#739bd0"] },
                shape: { type: "circle" },
                opacity: { value: 0.3, random: true },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: "#739bd0", opacity: 0.2, width: 1 },
                move: { enable: true, speed: 0.8, direction: "none", random: true }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "grab" },
                    onclick: { enable: true, mode: "push" }
                }
            }
        });
    }
}

function setupBifrostNav() {
    const bifrostRing = document.querySelector('.bifrost-ring');
    const bifrostNav = document.querySelector('.bifrost-nav');
    
    if (bifrostRing && bifrostNav) {
        bifrostRing.addEventListener('click', function() {
            bifrostNav.classList.toggle('active');
            bifrostRing.classList.toggle('active');
        });
        
        const navLinks = document.querySelectorAll('.bifrost-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                bifrostNav.classList.remove('active');
                bifrostRing.classList.remove('active');
            });
        });
    }
}

function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (mobileMenuBtn) {
        let mobileNav = document.querySelector('.mobile-nav');
        
        if (!mobileNav) {
            mobileNav = document.createElement('div');
            mobileNav.className = 'mobile-nav';
            
            const navItems = document.querySelectorAll('.bifrost-nav ul li');
            const navList = document.createElement('ul');
            
            navItems.forEach(item => {
                const clone = item.cloneNode(true);
                navList.appendChild(clone);
            });
            
            mobileNav.appendChild(navList);
            document.querySelector('header').insertAdjacentElement('afterend', mobileNav);
        }
        
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            mobileNav.classList.toggle('active');
            
            if (mobileMenuBtn.classList.contains('active')) {
                mobileMenuBtn.querySelector('span:nth-child(1)').style.transform = 'rotate(45deg) translate(8px, 8px)';
                mobileMenuBtn.querySelector('span:nth-child(2)').style.opacity = '0';
                mobileMenuBtn.querySelector('span:nth-child(3)').style.transform = 'rotate(-45deg) translate(8px, -8px)';
            } else {
                mobileMenuBtn.querySelector('span:nth-child(1)').style.transform = 'none';
                mobileMenuBtn.querySelector('span:nth-child(2)').style.opacity = '1';
                mobileMenuBtn.querySelector('span:nth-child(3)').style.transform = 'none';
            }
        });
        
        document.addEventListener('click', function(e) {
            if (e.target.closest('.mobile-nav a')) {
                mobileMenuBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                
                mobileMenuBtn.querySelector('span:nth-child(1)').style.transform = 'none';
                mobileMenuBtn.querySelector('span:nth-child(2)').style.opacity = '1';
                mobileMenuBtn.querySelector('span:nth-child(3)').style.transform = 'none';
            }
        });
    }
}

function setupRealmNavigation() {
    const realms = document.querySelectorAll('.realm');
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    if (realms.length > 0) {
        realms[0].classList.add('active-realm');
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                realms.forEach(realm => {
                    realm.classList.remove('active-realm');
                });
                
                targetElement.classList.add('active-realm');
                
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '-10% 0px -10% 0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    realms.forEach(realm => {
                        realm.classList.remove('active-realm');
                    });
                    
                    entry.target.classList.add('active-realm');
                }
            });
        }, observerOptions);
        
        realms.forEach(realm => {
            observer.observe(realm);
        });
    }
}

function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Envoi en cours...';
            
            const formData = new FormData(this);
            
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    alert('Message envoyé avec succès !')
                    
                    contactForm.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwnProperty.call(data, 'errors')) {
                            alert('Erreur lors de l\'envoi: ' + data.errors.map(error => error.message).join(', '));
                        } else {
                            alert('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
                        }
                    });
                }
            })
            .catch(error => {
                alert('Problème de connexion. Veuillez vérifier votre connexion internet et réessayer.');
                console.error('Erreur:', error);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            });
        });
    }
}