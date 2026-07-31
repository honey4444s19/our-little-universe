/**
 * OUR LITTLE UNIVERSE — 105 DAYS
 * Configuration & Data Object
 */
const CONFIG = {
    timeline: [
        { date: "18 APRIL 2026", title: "Where it all began.", msg: "The very first day we started talking. The spark of our universe." },
        { date: "4 MAY 2026", title: "Lil Meenu ❤️", msg: "A beautiful memory. You'll always be my Lil Meenu." },
        { date: "12 JUNE 2026", title: "Our first I love you.", msg: "12:42 AM. Three words that changed everything for us." },
        { date: "4 JULY 2026", title: "Our first dinner date.", msg: "Virtual, but it felt so real. The distance meant nothing." },
        { date: "19 JULY 2026", title: "Our brunch date.", msg: "Eating together across the miles. Moments I cherish." },
        { date: "1 AUGUST 2026", title: "Dinner Date #2.", msg: "105 Days together. 15 Weeks. And still counting." }
    ],
    starMessages: [
        "I love the way your mind works.",
        "A memory I never want to forget: Hearing your voice for the first time.",
        "Your smile literally lights up my world.",
        "I want to experience late-night drives with you.",
        "One day, we're going to visit that place you always talk about.",
        "I love how safe you make me feel.",
        "Even miles away, you feel like home.",
        "I want to hold your hand and just walk with no destination.",
        "You are my favourite notification.",
        "I fall for you a little more every single day."
    ],
    gardenSeeds: ["LOVE", "CARE", "TRUST", "LAUGHTER", "US"]
};

const FLOWER_EMOJIS = ["🌸", "🌹", "🌷", "🌻", "🌺"];

/**
 * AUDIO MANAGEMENT
 */
const musicBtn = document.getElementById('music-toggle');
const musicText = document.getElementById('music-text');
const bgMusic = document.getElementById('bg-music');
let isMusicPlaying = false;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playHeartbeat() {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(50, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
}

musicBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicText.innerText = "Play Music";
    } else {
        bgMusic.play().catch(e => console.log("No audio file found, skipping music."));
        musicText.innerText = "Pause Music";
    }
    isMusicPlaying = !isMusicPlaying;
});

/**
 * CANVAS PARTICLE SYSTEM
 */
const canvas = document.getElementById('universe');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];
let backgroundStars = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initBackgroundStars();
}
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor(x, y, color, speed, size, life) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = { x: (Math.random() - 0.5) * speed, y: (Math.random() - 0.5) * speed };
        this.size = size;
        this.life = life;
        this.opacity = 1;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }
    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.life--;
        this.opacity = Math.max(0, this.life / 50);
        this.draw();
    }
}

class BgStar {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5;
        this.speedY = (Math.random() * 0.2) + 0.05;
        this.opacity = Math.random();
    }
    update() {
        this.y -= this.speedY;
        if (this.y < 0) {
            this.y = height;
            this.x = Math.random() * width;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initBackgroundStars() {
    backgroundStars = [];
    const numStars = window.innerWidth < 768 ? 100 : 250;
    for (let i = 0; i < numStars; i++) backgroundStars.push(new BgStar());
}

function createExplosion(x, y, colorStr = "255,192,203") {
    for (let i = 0; i < 30; i++) {
        particles.push(new Particle(x, y, `rgba(${colorStr},1)`, 5, Math.random() * 3 + 1, 50));
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    backgroundStars.forEach(star => star.update());
    
    if (mouse.x) {
        particles.push(new Particle(mouse.x, mouse.y, 'rgba(255, 255, 255, 0.8)', 1, 1.5, 30));
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].life <= 0) particles.splice(i, 1);
    }
    requestAnimationFrame(animateParticles);
}

// Interactions
window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });
window.addEventListener('touchmove', e => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; });
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });
window.addEventListener('touchend', () => { mouse.x = null; mouse.y = null; });
window.addEventListener('click', e => {
    createExplosion(e.x, e.y, "255,255,255");
    playHeartbeat();
});

resizeCanvas();
animateParticles();

/**
 * SCENE MANAGEMENT & GSAP TRANSITIONS
 */
const scenes = document.querySelectorAll('.scene');

function switchScene(targetId) {
    const currentScene = document.querySelector('.scene.active');
    const targetScene = document.getElementById(targetId);
    
    gsap.to(currentScene, {
        opacity: 0, duration: 1, onComplete: () => {
            currentScene.classList.remove('active');
            currentScene.classList.add('hidden');
            
            targetScene.classList.remove('hidden');
            targetScene.classList.add('active');
            gsap.fromTo(targetScene, {opacity: 0}, {opacity: 1, duration: 1.5});
            
            triggerSceneLogic(targetId);
        }
    });
}

document.querySelectorAll('.next-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        const target = e.target.getAttribute('data-target');
        if (target) switchScene(target);
    });
});

function triggerSceneLogic(sceneId) {
    if (sceneId === 'scene-105') initScene105();
    if (sceneId === 'scene-timeline') initTimelineScene();
    if (sceneId === 'scene-stars') initStarsScene();
    if (sceneId === 'scene-hearts') initHeartCatcher();
    if (sceneId === 'scene-garden') initGarden();
    if (sceneId === 'scene-ring') initRingScene();
    if (sceneId === 'scene-tonight') initTonightScene();
    if (sceneId === 'scene-final') initFinalScene();
}

/** 
 * SCENE 0: OPENING 
 */
setTimeout(() => {
    document.getElementById('opening-subtitle').classList.remove('hidden');
    gsap.fromTo('#opening-subtitle', {opacity: 0, y: 20}, {opacity: 1, y: 0, duration: 2, delay: 0.5});
    
    setTimeout(() => {
        const btnEnter = document.getElementById('btn-enter');
        btnEnter.classList.remove('hidden');
        gsap.fromTo(btnEnter, {opacity: 0, scale: 0.8}, {opacity: 1, scale: 1, duration: 1});
        
        btnEnter.addEventListener('click', (e) => {
            e.stopPropagation();
            if(!isMusicPlaying) musicBtn.click(); 
            gsap.to('#scene-opening', {scale: 3, opacity: 0, duration: 1.5, ease: "power2.inOut", onComplete: () => switchScene('scene-105')});
        });
    }, 2000);
}, 2000);

/**
 * SCENE 1: 105 DAYS
 */
function initScene105() {
    const tl = gsap.timeline();
    tl.fromTo('.huge-number', {opacity: 0, scale: 0.5, filter: 'blur(10px)'}, {opacity: 1, scale: 1, filter: 'blur(0px)', duration: 2, ease: "back.out(1.7)"})
      .fromTo('.subtitle', {opacity: 0, y: 20}, {opacity: 1, y: 0, duration: 1}, "-=1")
      .fromTo('.sub-subtitle', {opacity: 0, y: 20}, {opacity: 1, y: 0, duration: 1}, "-=0.5")
      .fromTo('.counting', {opacity: 0}, {opacity: 1, duration: 1})
      .fromTo('#scene-105 .next-btn', {opacity: 0}, {opacity: 1, duration: 1});
    
    const rect = document.querySelector('.huge-number').getBoundingClientRect();
    createExplosion(rect.left + rect.width/2, rect.top + rect.height/2, "147,51,234");
}

/**
 * SCENE 2: TIMELINE
 */
function initTimelineScene() {
    const track = document.getElementById('timeline-track');
    if (track.children.length === 0) {
        CONFIG.timeline.forEach((item, index) => {
            const nodeContainer = document.createElement('div');
            nodeContainer.style.textAlign = 'center';
            nodeContainer.style.width = '120px';
            
            const node = document.createElement('div');
            node.className = 'timeline-node';
            node.innerHTML = `<span>✨</span>`;
            
            const label = document.createElement('div');
            label.innerText = item.date;
            label.style.marginTop = '10px';
            label.style.fontSize = '0.8rem';
            
            nodeContainer.appendChild(node);
            nodeContainer.appendChild(label);
            track.appendChild(nodeContainer);

            gsap.fromTo(nodeContainer, {opacity: 0, y: 50}, {opacity: 1, y: 0, duration: 0.8, delay: index * 0.2});

            node.addEventListener('click', (e) => {
                e.stopPropagation();
                createExplosion(e.clientX, e.clientY, "255,215,0");
                showTimelineModal(item);
            });
        });
    }
}

function showTimelineModal(item) {
    const modal = document.getElementById('timeline-modal');
    document.getElementById('modal-date').innerText = item.date;
    document.getElementById('modal-desc').innerText = item.title;
    document.getElementById('modal-msg').innerText = item.msg;
    modal.classList.remove('hidden');
    modal.classList.add('show');
    
    const btnNext = document.getElementById('btn-timeline-next');
    if(btnNext.classList.contains('hidden')) {
        btnNext.classList.remove('hidden');
        gsap.fromTo(btnNext, {opacity: 0}, {opacity: 1, duration: 1});
    }
}

document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('timeline-modal').classList.remove('show');
});

/**
 * SCENE 3: STAR FIELD
 */
let starsFound = 0;
function initStarsScene() {
    const field = document.getElementById('star-field');
    if (field.children.length === 0) {
        for(let i=0; i<30; i++) { createDOMStar(field, false); }
        for(let i=0; i<10; i++) { createDOMStar(field, true, CONFIG.starMessages[i]); }
    }
}

function createDOMStar(container, isSpecial, msg = "") {
    const star = document.createElement('div');
    star.className = 'clickable-star';
    if(isSpecial) star.classList.add('special');
    
    star.style.left = Math.random() * 90 + 5 + '%';
    star.style.top = Math.random() * 90 + 5 + '%';
    
    container.appendChild(star);

    star.addEventListener('click', (e) => {
        e.stopPropagation();
        if(star.classList.contains('found')) return;
        
        createExplosion(e.clientX, e.clientY, isSpecial ? "236,72,153" : "255,255,255");
        
        if (isSpecial) {
            star.classList.add('found');
            starsFound++;
            document.getElementById('stars-found').innerText = starsFound;
            
            gsap.to(star, {left: '50%', top: '50%', scale: 3, opacity: 0, duration: 0.8, onComplete: () => {
                showStarModal(msg);
                if (starsFound >= 10) {
                    document.querySelector('#scene-stars .scene-title').innerText = "You found all the stars ❤️";
                    const btn = document.getElementById('btn-stars-next');
                    btn.classList.remove('hidden');
                    gsap.fromTo(btn, {opacity: 0}, {opacity: 1, duration: 1});
                }
            }});
        } else {
            gsap.to(star, {scale: 0, opacity: 0, duration: 0.3});
        }
    });
}

function showStarModal(msg) {
    const modal = document.getElementById('star-modal');
    document.getElementById('star-msg-text').innerText = msg;
    modal.classList.remove('hidden');
    modal.classList.add('show');
}
document.querySelector('.close-modal-star').addEventListener('click', () => {
    document.getElementById('star-modal').classList.remove('show');
});

/**
 * SCENE 4: CATCH THE HEARTS
 */
let heartsCaught = 0;
let heartInterval;
function initHeartCatcher() {
    const area = document.getElementById('heart-catcher-area');
    heartsCaught = 0;
    
    function spawnHeart() {
        if(heartsCaught >= 5) return;
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerText = "❤️";
        heart.style.left = Math.random() * 90 + 5 + '%';
        heart.style.top = '100%';
        area.appendChild(heart);

        const speed = Math.random() * 3 + 3; 

        gsap.to(heart, {
            top: '-10%', 
            duration: speed, 
            ease: "linear",
            onComplete: () => heart.remove()
        });

        heart.addEventListener('click', (e) => {
            e.stopPropagation();
            createExplosion(e.clientX, e.clientY, "255,0,0");
            heart.remove();
            heartsCaught++;
            document.getElementById('hearts-caught').innerText = heartsCaught;
            if(heartsCaught >= 5) endHeartGame();
        });
    }
    heartInterval = setInterval(spawnHeart, 800);
}

function endHeartGame() {
    clearInterval(heartInterval);
    document.getElementById('heart-game-ui').classList.add('hidden');
    document.getElementById('heart-catcher-area').innerHTML = ''; 
    
    const endUI = document.getElementById('heart-game-end');
    endUI.classList.remove('hidden');
    
    const tl = gsap.timeline();
    tl.fromTo('#hg-msg-1', {opacity: 0, y: 20}, {opacity: 1, y: 0, duration: 1.5})
      .to('#hg-msg-2', {display: 'block', opacity: 1, duration: 1.5, delay: 1})
      .to('#hg-msg-3', {display: 'block', opacity: 1, duration: 1.5, delay: 1.5});
      
    setTimeout(() => {
        const btn = document.getElementById('btn-hearts-next');
        btn.classList.remove('hidden');
        gsap.fromTo(btn, {opacity: 0}, {opacity: 1, duration: 1});
    }, 6000);
}

/**
 * SCENE 5: OUR LITTLE GARDEN (ANIMATED SVG/EMOJIS)
 */
function initGarden() {
    const bed = document.getElementById('garden-bed');
    let seedsGrown = 0;

    if (bed.children.length === 0) {
        CONFIG.gardenSeeds.forEach((labelTxt, i) => {
            const container = document.createElement('div');
            container.className = 'seed-container';

            container.innerHTML = `
                <div class="flower-wrapper">
                    <div class="stem"></div>
                    <div class="bloom">${FLOWER_EMOJIS[i]}</div>
                </div>
                <div class="seed-label">${labelTxt}</div>
            `;

            bed.appendChild(container);

            gsap.fromTo(container, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: i * 0.15 });

            container.addEventListener('click', (e) => {
                if (container.classList.contains('grown')) return;
                e.stopPropagation();

                container.classList.add('grown');
                seedsGrown++;

                const rect = container.getBoundingClientRect();
                createExplosion(rect.left + rect.width / 2, rect.top + 40, "255, 105, 180");
                spawnFloatingEmoji(rect.left + rect.width / 2, rect.top, FLOWER_EMOJIS[i]);

                if (seedsGrown === CONFIG.gardenSeeds.length) {
                    setTimeout(() => {
                        const endUI = document.getElementById('garden-end');
                        endUI.classList.remove('hidden');
                        gsap.fromTo(endUI, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.5 });
                        startPetalRain();
                    }, 1200);
                }
            });
        });
    }
}

function spawnFloatingEmoji(x, y, emojiStr) {
    for (let i = 0; i < 4; i++) {
        const elem = document.createElement('div');
        elem.innerText = emojiStr;
        elem.style.position = 'fixed';
        elem.style.left = `${x}px`;
        elem.style.top = `${y}px`;
        elem.style.fontSize = '1.5rem';
        elem.style.pointerEvents = 'none';
        elem.style.zIndex = '90';
        document.body.appendChild(elem);

        gsap.to(elem, {
            x: (Math.random() - 0.5) * 150,
            y: -100 - Math.random() * 100,
            opacity: 0,
            scale: 1.5,
            rotation: Math.random() * 360,
            duration: 2,
            ease: "power2.out",
            onComplete: () => elem.remove()
        });
    }
}

function startPetalRain() {
    const petals = ["🌸", "🍃", "✨", "💖"];
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const p = document.createElement('div');
            p.innerText = petals[Math.floor(Math.random() * petals.length)];
            p.style.position = 'fixed';
            p.style.left = `${Math.random() * 100}vw`;
            p.style.top = `-5%`;
            p.style.fontSize = `${Math.random() * 1.5 + 1}rem`;
            p.style.zIndex = '80';
            p.style.pointerEvents = 'none';
            document.body.appendChild(p);

            gsap.to(p, {
                top: '105%',
                x: `+=${Math.random() * 100 - 50}`,
                rotation: 360,
                duration: Math.random() * 3 + 4,
                ease: "none",
                onComplete: () => p.remove()
            });
        }, i * 300);
    }
}

/**
 * SCENE 6: STARDUST RING & TIMED REVEALS
 */
function initRingScene() {
    const tl = gsap.timeline();

    tl.to('#ring-msg-1', { display: 'block', opacity: 1, y: 0, duration: 1.5, delay: 0.5 })
      .to('#ring-msg-2', { display: 'block', opacity: 1, y: 0, duration: 1.5, delay: 1 })
      .to('#ring-msg-3', { display: 'block', opacity: 1, y: 0, duration: 1.5, delay: 1 })
      .to('#ring-msg-4', { display: 'block', opacity: 1, scale: 1.1, duration: 2, delay: 1 });

    backgroundStars.forEach(s => s.speedY *= 4);

    setTimeout(() => {
        const btn = document.getElementById('btn-ring-next');
        btn.classList.remove('hidden');
        gsap.fromTo(btn, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 });
    }, 7500);
}

/**
 * SCENE 7: MERGING SOUL STARS & COSMIC FLASH
 */
function initTonightScene() {
    const me = document.getElementById('soul-me');
    const meenu = document.getElementById('soul-meenu');

    backgroundStars.forEach(s => s.speedY /= 4);

    gsap.to(me, { left: '110px', duration: 4.5, ease: "power2.inOut" });
    gsap.to(meenu, { right: '110px', duration: 4.5, ease: "power2.inOut", onComplete: () => {
        
        const stage = document.querySelector('.cosmos-stage').getBoundingClientRect();
        const centerX = stage.left + stage.width / 2;
        const centerY = stage.top + stage.height / 2;

        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                createExplosion(centerX, centerY, "255, 182, 193");
                spawnFloatingEmoji(centerX, centerY, "💖");
            }, i * 150);
        }

        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.inset = '0';
        flash.style.background = 'radial-gradient(circle, #ffffff 0%, rgba(255,192,203,0.8) 100%)';
        flash.style.zIndex = '999';
        document.body.appendChild(flash);

        gsap.to(flash, { opacity: 0, duration: 2.5, onComplete: () => flash.remove() });

        me.style.opacity = '0';
        meenu.style.opacity = '0';

        const msg = document.getElementById('tonight-msg');
        msg.classList.remove('hidden');
        gsap.fromTo(msg, { opacity: 0, scale: 0.9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 2 });
    }});
}

/**
 * SCENE 8: COZMO ROBOT
 */
const btnDance = document.getElementById('btn-dance');
const cozmo = document.getElementById('cozmo');
btnDance.addEventListener('click', () => {
    cozmo.classList.add('dancing');
    btnDance.innerText = "HE'S DANCING! 🤖";
    setTimeout(() => {
        cozmo.classList.remove('dancing');
        btnDance.innerText = "MAKE HIM DANCE 🤖";
    }, 4000);
});

/**
 * SCENE 9: FINAL
 */
function initFinalScene() {
    const headings = document.querySelectorAll('.final-summary h2');
    const tl = gsap.timeline();
    
    headings.forEach((h, i) => {
        tl.fromTo(h, {opacity: 0, y: 20}, {opacity: 1, y: 0, duration: 1.2}, i * 0.8);
    });
    
    tl.to('.divider', {opacity: 1, width: '150px', duration: 1})
      .fromTo('.final-summary p', {opacity: 0}, {opacity: 1, duration: 1.5})
      .fromTo('.infinity', {opacity: 0, scale: 0.5}, {opacity: 1, scale: 1, duration: 2, ease: "elastic.out(1, 0.3)"})
      .fromTo('#scene-final button', {opacity: 0}, {opacity: 1, duration: 1});
}
