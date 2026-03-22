// ── Typewriter Reveal Effect ────────────────────────────────
function initTypewriter() {
  const elements = document.querySelectorAll('.typewriter-reveal');
  
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Clean up source formatting whitespace
        const html = el.innerHTML.replace(/\s*<br\s*\/?>\s*/gi, '<br>').trim();
        // Match HTML tags or individual characters
        const tokens = html.match(/(<[^>]+>|.)/g) || [];
        
        el.innerHTML = ''; 
        el.style.opacity = '1';
        
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        el.appendChild(cursor);

        let i = 0;
        function typeNext() {
          if (i < tokens.length) {
            const token = tokens[i];
            if (token.startsWith('<')) {
              cursor.insertAdjacentHTML('beforebegin', token);
            } else {
              cursor.insertAdjacentText('beforebegin', token);
            }
            i++;
            // Randomize typing speed for realism (30ms - 70ms)
            const delay = token === ' ' ? 20 : 30 + Math.random() * 40;
            setTimeout(typeNext, delay);
          } else {
            // Hide cursor after a few seconds when finished
            setTimeout(() => cursor.style.display = 'none', 3000);
          }
        }
        
        // Start typing after a brief delay
        setTimeout(typeNext, 300);
        
        // Stop observing this element once it starts typing
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 }); // Trigger when 50% visible

  elements.forEach(el => observer.observe(el));
}

// Run immediately before Three.js
initTypewriter();

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// 1. Setup Scene, Camera, Renderer
const scene = new THREE.Scene();
// No background color, allow the CSS white background to show through
scene.background = null;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Position the camera so the robot is to the right
camera.position.set(0, 5, 25);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  alpha: true,
  antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// 2. Add Lighting (Premium aesthetic)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // soft global light
scene.add(ambientLight);

// Main directional light (sun key light)
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(10, 20, 10);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
scene.add(dirLight);

// Accent lights to give that modern tech vibe and contrast against the white background
const pointLightBlue = new THREE.PointLight(0x4285F4, 2, 50);
pointLightBlue.position.set(-10, 5, 5);
scene.add(pointLightBlue);

const pointLightPurple = new THREE.PointLight(0xA855F7, 2, 50);
pointLightPurple.position.set(10, -5, 5);
scene.add(pointLightPurple);

// 3. Create the Robot
const robotGroup = new THREE.Group();
scene.add(robotGroup);

// Position the whole robot out of the hero text center — bottom right
robotGroup.position.set(14, -8, 0);
robotGroup.scale.setScalar(0.75); // Slightly smaller — background decoration

// Shared materials for the cute robot
const whiteMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.1,
  roughness: 0.3,
});

const darkMat = new THREE.MeshStandardMaterial({
  color: 0x1a1a24,
  metalness: 0.6,
  roughness: 0.4,
});

const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff }); // Glowing Cyan

// A. Robot Body Group
const bodyGroup = new THREE.Group();
bodyGroup.position.set(0, 3.5, 0);
robotGroup.add(bodyGroup);

// Torso (Rounded Box)
const torsoGeo = new RoundedBoxGeometry(3.6, 3, 2.8, 6, 0.6);
const torsoMesh = new THREE.Mesh(torsoGeo, whiteMat);
torsoMesh.castShadow = true;
torsoMesh.receiveShadow = true;
bodyGroup.add(torsoMesh);

// Belly (Dark Hemisphere floating below)
const bellyGeo = new THREE.SphereGeometry(1.6, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
const bellyMesh = new THREE.Mesh(bellyGeo, darkMat);
bellyMesh.position.y = -1.0;
bodyGroup.add(bellyMesh);

// Chest Detail (Little screen/panel)
const panelGeo = new THREE.PlaneGeometry(0.8, 0.6);
const panelMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.5 });
const panelMesh = new THREE.Mesh(panelGeo, panelMat);
panelMesh.position.set(0.8, 0.5, 1.41);
bodyGroup.add(panelMesh);

// Little dots on panel
const dotGeo = new THREE.CircleGeometry(0.06, 16);
const dotRed = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color: 0xff4444 }));
dotRed.position.set(0.65, 0.6, 1.42);
bodyGroup.add(dotRed);
const dotBlue = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color: 0x4444ff }));
dotBlue.position.set(0.95, 0.6, 1.42);
bodyGroup.add(dotBlue);


// B. Robot Head Group (This will rotate based on mouse)
const headGroup = new THREE.Group();
headGroup.position.set(0, 7.5, 0); // Position relative to body base
robotGroup.add(headGroup);

// The head casing
const headGeo = new RoundedBoxGeometry(4.2, 3.8, 3.8, 6, 0.6);
const headMesh = new THREE.Mesh(headGeo, whiteMat);
headMesh.castShadow = true;
headMesh.receiveShadow = true;
headGroup.add(headMesh);

// The Eyes (Glowing cute shapes)
const eyeGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
eyeGeo.rotateX(Math.PI / 2);
const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
leftEye.position.set(-0.9, 0.3, 1.85);
headGroup.add(leftEye);

const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
rightEye.position.set(0.9, 0.3, 1.85);
headGroup.add(rightEye);

// The Mouth (Happy smile)
const mouthGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.2, 32, 1, false, 0, Math.PI);
mouthGeo.rotateX(Math.PI / 2);
mouthGeo.rotateZ(Math.PI); // Flip to make it a smile
const mouthMesh = new THREE.Mesh(mouthGeo, darkMat);
mouthMesh.position.set(0, -0.6, 1.85);
headGroup.add(mouthMesh);

// Ear muffs
const earGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 32);
earGeo.rotateZ(Math.PI / 2);
const leftEar = new THREE.Mesh(earGeo, darkMat);
leftEar.position.set(-2.2, 0, 0);
headGroup.add(leftEar);
const rightEar = new THREE.Mesh(earGeo, darkMat);
rightEar.position.set(2.2, 0, 0);
headGroup.add(rightEar);

const earCapGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.45, 32);
earCapGeo.rotateZ(Math.PI / 2);
const leftEarCap = new THREE.Mesh(earCapGeo, whiteMat);
leftEarCap.position.set(-2.2, 0, 0);
headGroup.add(leftEarCap);
const rightEarCap = new THREE.Mesh(earCapGeo, whiteMat);
rightEarCap.position.set(2.2, 0, 0);
headGroup.add(rightEarCap);

// Antennae
const antGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8);
const leftAnt = new THREE.Mesh(antGeo, darkMat);
leftAnt.position.set(-1.5, 2.3, 0);
headGroup.add(leftAnt);
const rightAnt = new THREE.Mesh(antGeo, darkMat);
rightAnt.position.set(1.5, 2.3, 0);
headGroup.add(rightAnt);

const antTopGeo = new THREE.SphereGeometry(0.18, 16, 16);
const leftAntTop = new THREE.Mesh(antTopGeo, darkMat);
leftAntTop.position.set(-1.5, 2.9, 0);
headGroup.add(leftAntTop);
const rightAntTop = new THREE.Mesh(antTopGeo, darkMat);
rightAntTop.position.set(1.5, 2.9, 0);
headGroup.add(rightAntTop);

// C. Arms
const createArm = (isLeft) => {
  const armGroup = new THREE.Group();
  const sign = isLeft ? -1 : 1;
  armGroup.position.set(sign * 2.4, 4.5, 0); // Relative to entire robotGroup
  
  // Shoulder joint
  const shoulderGeo = new THREE.SphereGeometry(0.6, 32, 32);
  const shoulder = new THREE.Mesh(shoulderGeo, darkMat);
  armGroup.add(shoulder);

  // Upper arm
  const upperArmGeo = new THREE.CapsuleGeometry(0.4, 1.2, 16, 16);
  const upperArm = new THREE.Mesh(upperArmGeo, darkMat);
  upperArm.position.set(sign * 0.6, -1.0, 0);
  upperArm.rotation.z = sign * Math.PI / 5;
  armGroup.add(upperArm);

  // Lower arm cuff
  const lowerArmGeo = new THREE.CapsuleGeometry(0.5, 1.2, 16, 16);
  const lowerArm = new THREE.Mesh(lowerArmGeo, whiteMat);
  lowerArm.position.set(sign * 1.3, -2.5, 0);
  lowerArm.rotation.z = sign * Math.PI / 8;
  armGroup.add(lowerArm);

  // Hand
  const handGeo = new THREE.SphereGeometry(0.5, 32, 32);
  const hand = new THREE.Mesh(handGeo, darkMat);
  hand.position.set(sign * 1.6, -3.5, 0);
  armGroup.add(hand);

  // Fingers
  const fingerGeo = new THREE.CapsuleGeometry(0.12, 0.6, 8, 8);
  const f1 = new THREE.Mesh(fingerGeo, darkMat);
  f1.position.set(sign * 1.4, -4.1, 0.3);
  f1.rotation.x = -Math.PI / 8;
  armGroup.add(f1);
  const f2 = new THREE.Mesh(fingerGeo, darkMat);
  f2.position.set(sign * 1.8, -4.2, 0);
  armGroup.add(f2);
  const f3 = new THREE.Mesh(fingerGeo, darkMat);
  f3.position.set(sign * 1.4, -4.1, -0.3);
  f3.rotation.x = Math.PI / 8;
  armGroup.add(f3);

  return armGroup;
};

robotGroup.add(createArm(true));
robotGroup.add(createArm(false));

// Hover animation variables
let clock = new THREE.Clock();

// 4. Mouse interaction
// We want the head to point at the mouse pointer correctly using 3D raycasting.
let mouse = new THREE.Vector2();
const dummyHead = new THREE.Object3D();
dummyHead.position.set(0, 7.5, 0); // Same position as headGroup relative to robotGroup
robotGroup.add(dummyHead);
const targetPosition = new THREE.Vector3();

// Start with mouse centered
mouse.x = 0;
mouse.y = 0;

window.addEventListener('mousemove', (event) => {
  // Normalize mouse coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// 5. Window Resize Handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Corner Movement State Machine ---
const STATE_MOVING = 0;
const STATE_PAUSED = 1;
let currentState = STATE_MOVING;

// Define corners at screen EDGES so the robot never obscures the center hero text
// X is pushed further out; Y is pushed higher/lower
const corners = [
  new THREE.Vector3( 16,  8, 0), // Far Top Right
  new THREE.Vector3(-16,  8, 0), // Far Top Left
  new THREE.Vector3(-16, -8, 0), // Far Bottom Left
  new THREE.Vector3( 16, -8, 0)  // Far Bottom Right
];

let currentCornerIndex = 0; // The corner we are moving to
let previousPosition = new THREE.Vector3().copy(robotGroup.position); // Starting point
let targetBasePosition = corners[currentCornerIndex];

// Timers for interpolation and waiting
let moveProgress = 0;
const MOVE_DURATION = 4.0; // Seconds it takes to move between corners
let pauseTimer = 0;
const PAUSE_DURATION = 2.0; // Seconds to wait at a corner

// Helper to ease movement (smoothstep)
function smoothstep(min, max, value) {
  let x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}


// 6. Animation Loop
function animate() {
  requestAnimationFrame(animate);

  const deltaTime = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();

  // --- Corner Movement Logic ---
  if (currentState === STATE_MOVING) {
    moveProgress += deltaTime / MOVE_DURATION;
    
    if (moveProgress >= 1.0) {
      // Reached destination
      moveProgress = 1.0;
      currentState = STATE_PAUSED;
      pauseTimer = 0; // Reset pause timer
    }

    // Interpolate smoothly between previous corner and new corner
    const t = smoothstep(0, 1, moveProgress);
    const baseX = THREE.MathUtils.lerp(previousPosition.x, targetBasePosition.x, t);
    const baseY = THREE.MathUtils.lerp(previousPosition.y, targetBasePosition.y, t);
    const baseZ = THREE.MathUtils.lerp(previousPosition.z, targetBasePosition.z, t);

    // Apply the floating offsets ON TOP of the base position
    robotGroup.position.x = baseX + Math.sin(elapsedTime * 0.4) * 1.5 + Math.cos(elapsedTime * 0.3) * 1.0;
    robotGroup.position.y = baseY + Math.sin(elapsedTime * 0.5) * 1.0 + Math.sin(elapsedTime * 0.8) * 0.5;
    robotGroup.position.z = baseZ + Math.cos(elapsedTime * 0.4) * 1.0;

  } else if (currentState === STATE_PAUSED) {
    pauseTimer += deltaTime;
    
    if (pauseTimer >= PAUSE_DURATION) {
      // Done pausing, pick a new random corner
      currentState = STATE_MOVING;
      moveProgress = 0;
      
      // Save current base position before starting new move
      previousPosition.copy(targetBasePosition);
      
      // Pick a random NEXT corner that isn't the current one
      let nextIndex = currentCornerIndex;
      while (nextIndex === currentCornerIndex) {
        nextIndex = Math.floor(Math.random() * corners.length);
      }
      currentCornerIndex = nextIndex;
      targetBasePosition = corners[currentCornerIndex];
    }

    // While paused, still apply the floating offsets
    robotGroup.position.x = targetBasePosition.x + Math.sin(elapsedTime * 0.4) * 1.5 + Math.cos(elapsedTime * 0.3) * 1.0;
    robotGroup.position.y = targetBasePosition.y + Math.sin(elapsedTime * 0.5) * 1.0 + Math.sin(elapsedTime * 0.8) * 0.5;
    robotGroup.position.z = targetBasePosition.z + Math.cos(elapsedTime * 0.4) * 1.0;
  }

  // --- Rotational Floating (Always On) ---
  robotGroup.rotation.x = Math.sin(elapsedTime * 0.8) * 0.05;
  robotGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.1;
  robotGroup.rotation.z = Math.cos(elapsedTime * 0.6) * 0.05;

  // --- Head Tracking (Always On) ---
  // Create a plane at the robot's Z depth to raycast against
  const depthPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -dummyHead.position.z - robotGroup.position.z);
  
  // Set up a raycaster from the camera
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  // Find where the ray intersects the plane
  raycaster.ray.intersectPlane(depthPlane, targetPosition);

  // Make the dummy head look at the target position in world space
  dummyHead.lookAt(targetPosition);

  // Transfer the dummy head's world rotation softly to the actual head group
  const targetQuaternion = dummyHead.quaternion;
  headGroup.quaternion.slerp(targetQuaternion, 0.1);

  renderer.render(scene, camera);
}

animate();

// ============================================================
// PARTICLE CONFETTI SYSTEM (Google Antigravity-style dots)
// ============================================================
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Resize canvas to match window
  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Google brand colours for confetti dashes
  const COLORS = [
    '#4285F4', '#EA4335', '#FBBC04', '#34A853',
    '#4285F4', '#EA4335', '#FBBC04', '#34A853',
    '#4285F4', // more blue weight, matches reference
  ];

  // Create particles
  const PARTICLE_COUNT = 160;
  const particles = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x:      Math.random() * window.innerWidth,
      y:      Math.random() * window.innerHeight,
      length: 6 + Math.random() * 8,          // dash length
      angle:  Math.random() * Math.PI * 2,    // rotation
      color:  COLORS[Math.floor(Math.random() * COLORS.length)],
      speed:  0.08 + Math.random() * 0.15,    // drift speed
      drift:  (Math.random() - 0.5) * 0.3,   // horizontal wobble
      alpha:  0.4 + Math.random() * 0.5,      // opacity
      alphaDir: Math.random() > 0.5 ? 1 : -1, // pulse direction
    });
  }

  // Scroll parallax factor
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  function drawParticles(ts) {
    // Re-size on next frame if needed
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      // Slowly drift upward + gentle horizontal wobble
      p.y -= p.speed;
      p.x += Math.sin(ts * 0.0005 + p.drift * 100) * 0.2;

      // Wrap around
      if (p.y < -20) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
      }

      // Pulse alpha
      p.alpha += p.alphaDir * 0.003;
      if (p.alpha >= 0.9) p.alphaDir = -1;
      if (p.alpha <= 0.2) p.alphaDir = 1;

      // Parallax: particles drift slightly faster than scroll
      const parallaxY = p.y - scrollY * 0.15;

      // Draw a small rotated dash
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.strokeStyle = p.color;
      ctx.lineWidth   = 2.5;
      ctx.lineCap     = 'round';
      ctx.translate(p.x, parallaxY);
      ctx.rotate(p.angle);
      ctx.beginPath();
      ctx.moveTo(-p.length / 2, 0);
      ctx.lineTo(p.length / 2, 0);
      ctx.stroke();
      ctx.restore();
    });

    requestAnimationFrame(drawParticles);
  }

  requestAnimationFrame(drawParticles);
}

// ============================================================
// SCROLL REVEAL — fade + slide-up on viewport entry
// ============================================================
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // fire once
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

// ============================================================
// STICKY HEADER — hide on scroll down, reveal on scroll up
// ============================================================
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let lastScrollY = window.scrollY;

  function onScroll() {
    const currentY = window.scrollY;
    const diff = currentY - lastScrollY;

    // Glass background once past 50px
    if (currentY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Hide when scrolling DOWN (past a small threshold to avoid jitter)
    if (diff > 6 && currentY > 120) {
      header.classList.add('hidden');
    }
    // Show when scrolling UP
    else if (diff < -4) {
      header.classList.remove('hidden');
    }

    lastScrollY = currentY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

// ============================================================
// MOBILE BURGER MENU
// ============================================================
function initBurger() {
  const burger    = document.getElementById('burger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!burger || !mobileNav) return;

  burger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);
  });
}

// ============================================================
// INIT ALL
// ============================================================
initParticles();
initScrollReveal();
initStickyHeader();
initBurger();
