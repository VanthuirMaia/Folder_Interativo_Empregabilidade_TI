// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas as funcionalidades
    initScrollProgress();
    initSmoothScrolling();
    initActiveNavigation();
    initInteractiveCards();
    initAnimatedCounters();
    initFadeInAnimations();
    initChecklistFunctionality();
});

// Barra de progresso do scroll
function initScrollProgress() {
    // Criar elemento da barra de progresso
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    scrollIndicator.appendChild(scrollProgress);
    document.body.appendChild(scrollIndicator);

    // Atualizar progresso no scroll
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    });
}

// Navegação suave
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Compensar altura da nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navegação ativa baseada no scroll
function initActiveNavigation() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Cards interativos
function initInteractiveCards() {
    // Cards de opções (quebra-gelo)
    const optionCards = document.querySelectorAll('.option-card');
    optionCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remover expanded de todos os cards
            optionCards.forEach(c => c.classList.remove('expanded'));
            // Adicionar expanded ao card clicado
            this.classList.add('expanded');
        });
    });
    
    // Cards de áreas
    const areaCards = document.querySelectorAll('.area-card');
    areaCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });
    
    // Ferramentas (hard skills)
    const toolItems = document.querySelectorAll('.tool-item');
    toolItems.forEach(tool => {
        tool.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });
}

// Contadores animados
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000; // 2 segundos
    const stepTime = duration / 100;
    
    const timer = setInterval(function() {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Formatação especial para valores grandes
        if (target >= 1000) {
            element.textContent = Math.floor(current).toLocaleString('pt-BR');
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// Animações de fade-in
function initFadeInAnimations() {
    // Adicionar classe fade-in a elementos que devem animar
    const animatedElements = document.querySelectorAll(
        '.section-title, .section-subtitle, .option-card, .area-card, ' +
        '.tool-item, .soft-skill-card, .strategy-step, .use-case, .checklist-item'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
    });
    
    // Observer para detectar quando elementos entram na viewport
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Funcionalidade do checklist
function initChecklistFunctionality() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const item = this.closest('.checklist-item');
            
            if (this.checked) {
                item.style.background = 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)';
                
                // Adicionar efeito de confete (simulado)
                createConfettiEffect(item);
                
                // Salvar no localStorage
                localStorage.setItem(this.id, 'checked');
            } else {
                item.style.background = 'white';
                localStorage.removeItem(this.id);
            }
        });
        
        // Restaurar estado do localStorage
        if (localStorage.getItem(checkbox.id) === 'checked') {
            checkbox.checked = true;
            const item = checkbox.closest('.checklist-item');
            item.style.background = 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)';
        }
    });
}

// Efeito de confete simples
function createConfettiEffect(element) {
    const colors = ['#2563eb', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];
    
    for (let i = 0; i < 10; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '8px';
        confetti.style.height = '8px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '1000';
        
        const rect = element.getBoundingClientRect();
        confetti.style.left = (rect.left + Math.random() * rect.width) + 'px';
        confetti.style.top = (rect.top + window.scrollY) + 'px';
        
        document.body.appendChild(confetti);
        
        // Animar confete
        const animation = confetti.animate([
            { 
                transform: 'translateY(0px) rotate(0deg)', 
                opacity: 1 
            },
            { 
                transform: `translateY(-100px) rotate(${Math.random() * 360}deg)`, 
                opacity: 0 
            }
        ], {
            duration: 1000,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => {
            confetti.remove();
        };
    }
}

// Adicionar efeitos de hover dinâmicos
document.addEventListener('mousemove', function(e) {
    const cards = document.querySelectorAll('.option-card, .area-card, .tool-item, .soft-skill-card');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        }
    });
});

// Resetar transformações quando o mouse sai
document.addEventListener('mouseleave', function() {
    const cards = document.querySelectorAll('.option-card, .area-card, .tool-item, .soft-skill-card');
    cards.forEach(card => {
        card.style.transform = '';
    });
});

// Adicionar partículas flutuantes no header
function createFloatingParticles() {
    const header = document.querySelector('.header');
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        header.appendChild(particle);
        
        // Animar partícula
        particle.animate([
            { transform: 'translateY(0px)', opacity: 0.3 },
            { transform: 'translateY(-20px)', opacity: 0.7 },
            { transform: 'translateY(0px)', opacity: 0.3 }
        ], {
            duration: 3000 + Math.random() * 2000,
            iterations: Infinity,
            easing: 'ease-in-out'
        });
    }
}

// Inicializar partículas após carregamento
setTimeout(createFloatingParticles, 1000);

// Adicionar funcionalidade de busca rápida (Easter egg)
let searchSequence = '';
document.addEventListener('keydown', function(e) {
    searchSequence += e.key.toLowerCase();
    
    if (searchSequence.includes('tech')) {
        // Ativar modo "tech" com efeitos especiais
        document.body.classList.add('tech-mode');
        setTimeout(() => {
            document.body.classList.remove('tech-mode');
        }, 3000);
        searchSequence = '';
    }
    
    if (searchSequence.length > 10) {
        searchSequence = searchSequence.slice(-10);
    }
});

// CSS para modo tech (adicionado dinamicamente)
const techModeCSS = `
.tech-mode {
    animation: matrix-rain 3s ease-in-out;
}

@keyframes matrix-rain {
    0% { filter: hue-rotate(0deg) contrast(1); }
    50% { filter: hue-rotate(120deg) contrast(1.5); }
    100% { filter: hue-rotate(0deg) contrast(1); }
}
`;

const style = document.createElement('style');
style.textContent = techModeCSS;
document.head.appendChild(style);

