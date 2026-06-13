import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

import { HeartModel } from './heart-model.js';
import { BloodFlow } from './blood-flow.js';
import { AnatomyLabels } from './labels.js';
import { BioBot } from './biobot.js';

let scene, camera, renderer, composer, controls;
let heart, bloodFlow, labels, biobot;
let raycaster, mouse;
let isDiagnosticMode = false;
let clock;

// UI Elements
const infoPanel = document.getElementById('info-panel');
const infoName = document.getElementById('info-name');
const infoDesc = document.getElementById('info-description');
const infoColor = document.getElementById('info-color-dot');
const infoFactsList = document.getElementById('info-facts-list');
const loadingOverlay = document.getElementById('loading-overlay');

function init() {
  clock = new THREE.Clock();

  // 1. Setup Scene
  const canvas = document.getElementById('explore-canvas');
  scene = new THREE.Scene();
  scene.background = null;
  scene.fog = new THREE.FogExp2(0x050810, 0.02);

  // 2. Setup Camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 15);

  // 3. Setup Renderer
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  
  // Enable WebXR VR Support
  renderer.xr.enabled = true;
  document.body.appendChild(VRButton.createButton(renderer));

  // 4. Setup Post-processing (Bloom)
  const renderScene = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
  bloomPass.threshold = 0.2;
  bloomPass.strength = 1.0; // Glow intensity
  bloomPass.radius = 0.5;

  composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  // 5. Setup Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 5;
  controls.maxDistance = 30;

  // 6. Setup Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1);
  mainLight.position.set(5, 5, 5);
  scene.add(mainLight);

  const backLight = new THREE.PointLight(0x00d4ff, 2, 50);
  backLight.position.set(-5, 0, -5);
  scene.add(backLight);

  const rimLight = new THREE.PointLight(0xff3366, 2, 50);
  rimLight.position.set(5, -5, -5);
  scene.add(rimLight);

  // 7. Initialize Components
  heart = new HeartModel(scene);
  bloodFlow = new BloodFlow(scene);
  labels = new AnatomyLabels(camera, renderer);
  
  biobot = new BioBot(document.getElementById('biobot-panel'), (partName) => {
    heart.highlightPart(partName);
    labels.highlightLabel(partName);
  });

  // Setup raycaster for interaction
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  
  window.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('resize', onWindowResize);
  
  setupUIControls();

  // Hide loading after a short delay
  setTimeout(() => {
    loadingOverlay.style.opacity = '0';
    setTimeout(() => loadingOverlay.style.display = 'none', 500);
  }, 1500);

  // Start Animation
  renderer.setAnimationLoop(animate);
}

function onPointerDown(event) {
  // Ignore clicks on UI
  if (event.target.tagName !== 'CANVAS') return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(heart.getInteractiveObjects());

  if (intersects.length > 0) {
    const object = intersects[0].object;
    const data = object.userData;
    
    if (data && data.name) {
      heart.highlightPart(data.name);
      showInfoPanel(data);
    }
  } else {
    heart.resetHighlight();
  }
}

function showInfoPanel(data) {
  document.getElementById('info-welcome').classList.add('hidden');
  document.getElementById('info-detail').classList.remove('hidden');
  
  infoName.textContent = data.name;
  infoDesc.textContent = data.description || 'Tidak ada deskripsi.';
  
  infoFactsList.innerHTML = '';
  if (data.facts && data.facts.length > 0) {
    data.facts.forEach(fact => {
      const li = document.createElement('li');
      li.textContent = fact;
      infoFactsList.appendChild(li);
    });
  }
  
  infoPanel.classList.add('active');
}

function setupUIControls() {
  // Mode toggle
  document.getElementById('mode-explore-btn').addEventListener('click', (e) => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    e.currentTarget.classList.add('active');
    isDiagnosticMode = false;
    bloodFlow.setMode('normal');
    biobot.addMessage('Mode Eksplorasi diaktifkan. Jantung berdetak normal.', 'bot');
  });

  document.getElementById('mode-diagnostic-btn').addEventListener('click', (e) => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    e.currentTarget.classList.add('active');
    isDiagnosticMode = true;
    bloodFlow.setMode('anemia'); // Start with a scenario
    biobot.addMessage('Misi Diagnostik dimulai! Pasien mengeluh lemas. Coba perhatikan jumlah sel darah merah yang mengalir...', 'bot');
  });

  // Layer toggles
  document.getElementById('toggle-chambers-btn').addEventListener('click', (e) => {
    e.currentTarget.classList.toggle('active');
    heart.toggleLayer('chambers');
  });

  document.getElementById('toggle-valves-btn').addEventListener('click', (e) => {
    e.currentTarget.classList.toggle('active');
    heart.toggleLayer('valves');
  });

  document.getElementById('toggle-vessels-btn').addEventListener('click', (e) => {
    e.currentTarget.classList.toggle('active');
    heart.toggleLayer('vessels');
  });

  // Action buttons
  document.getElementById('reset-view-btn').addEventListener('click', () => {
    gsap.to(camera.position, { x: 0, y: 0, z: 15, duration: 1, ease: 'power2.inOut' });
    controls.target.set(0, 0, 0);
  });

  document.getElementById('toggle-labels-btn').addEventListener('click', (e) => {
    e.currentTarget.classList.toggle('active');
    labels.toggle();
  });

  document.getElementById('toggle-bloodflow-btn').addEventListener('click', (e) => {
    e.currentTarget.classList.toggle('active');
    bloodFlow.toggle();
  });
  
  document.getElementById('toggle-cutaway-btn').addEventListener('click', (e) => {
    const isActive = e.currentTarget.classList.toggle('active');
    heart.setCutaway(isActive);
  });

  // Info panel
  document.getElementById('info-reset-btn').addEventListener('click', () => {
    document.getElementById('info-detail').classList.add('hidden');
    document.getElementById('info-welcome').classList.remove('hidden');
    heart.resetHighlight();
  });

  document.getElementById('info-panel-close').addEventListener('click', () => {
    infoPanel.classList.remove('active');
  });

  // Biobot toggle
  const biobotPanel = document.getElementById('biobot-panel');
  document.getElementById('biobot-toggle-btn').addEventListener('click', () => {
    biobotPanel.classList.toggle('minimized');
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  controls.update();
  
  if (heart) heart.animate(time);
  if (bloodFlow) bloodFlow.animate(time);
  if (labels) labels.update();

  // In VR, bypass EffectComposer (post-processing is not standard in WebXR)
  if (renderer.xr.isPresenting) {
    renderer.render(scene, camera);
  } else {
    composer.render();
  }
}

// Start app
init();
