/* ============================================================
   BioVR-Investigator — Hero Scene (Three.js)
   Procedural 3D Heart with Blood Particles & Bloom
   ============================================================ */

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

/**
 * Initialize the hero Three.js scene
 * Creates a procedural heart with blood particles and bloom effect
 */
export function initHeroScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) {
    console.warn('Hero canvas not found');
    return;
  }

  // ── Scene Setup ──
  const scene = new THREE.Scene();

  // ── Camera ──
  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0.5, 5);

  // ── Renderer ──
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  // ── Lights ──
  // Ambient — dim blue/purple for base visibility
  const ambient = new THREE.AmbientLight(0x0e0e28, 1.2);
  scene.add(ambient);

  // Strong Directional Light from top-front-right for highlights and definition
  const dirLight = new THREE.DirectionalLight(0xffffff, 4.5);
  dirLight.position.set(5, 8, 8);
  scene.add(dirLight);

  // Secondary Directional Light from top-front-left for color contrast
  const dirLightLeft = new THREE.DirectionalLight(0xff3366, 2.0);
  dirLightLeft.position.set(-5, 6, 4);
  scene.add(dirLightLeft);

  // Red point light — left side (simulates arterial glow)
  const redLight = new THREE.PointLight(0xff3366, 3.5, 12);
  redLight.position.set(-3, 1, 2);
  scene.add(redLight);

  // Cyan point light — right side
  const cyanLight = new THREE.PointLight(0x00d4ff, 3.0, 12);
  cyanLight.position.set(3, -1, 3);
  scene.add(cyanLight);

  // Subtle purple backlight
  const purpleLight = new THREE.PointLight(0x7c3aed, 2.0, 10);
  purpleLight.position.set(0, 4, -4);
  scene.add(purpleLight);

  // ── Heart Group ──
  const heartGroup = new THREE.Group();
  scene.add(heartGroup);

  // ── Procedural Heart ──
  const heartGeo = createHeartGeometry();
  const heartMat = new THREE.MeshPhysicalMaterial({
    color: 0xbb0a26,
    emissive: 0x240409,
    roughness: 0.2,
    metalness: 0.15,
    transmission: 0.4,
    thickness: 1.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    envMapIntensity: 0.8,
    side: THREE.DoubleSide,
  });
  const heartMesh = new THREE.Mesh(heartGeo, heartMat);
  heartGroup.add(heartMesh);

  // Adipose Tissue
  const fatMat = new THREE.MeshPhysicalMaterial({
    color: 0xe5c130, roughness: 0.75, metalness: 0.05, clearcoat: 0.15, side: THREE.DoubleSide,
  });
  const fatCurves = [
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.9, 0.2, 0.1), new THREE.Vector3(-0.5, 0.25, 0.4), new THREE.Vector3(0.0, 0.2, 0.5),
      new THREE.Vector3(0.5, 0.25, 0.4), new THREE.Vector3(0.9, 0.2, 0.1), new THREE.Vector3(0.6, 0.1, -0.4),
      new THREE.Vector3(-0.1, 0.15, -0.45), new THREE.Vector3(-0.6, 0.1, -0.4), new THREE.Vector3(-0.9, 0.2, 0.1),
    ]),
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, 0.2, 0.5), new THREE.Vector3(0.05, -0.2, 0.72), new THREE.Vector3(-0.1, -0.6, 0.65),
      new THREE.Vector3(-0.25, -1.0, 0.4), new THREE.Vector3(-0.35, -1.3, 0.1),
    ])
  ];
  fatCurves.forEach((curve) => {
    const geo = new THREE.TubeGeometry(curve, 48, 0.07, 8, true);
    heartGroup.add(new THREE.Mesh(geo, fatMat));
  });

  // Coronary Vessels
  const coronaryMatRed = new THREE.MeshPhysicalMaterial({ color: 0xff3366, emissive: 0x551122, roughness: 0.2, metalness: 0.1, clearcoat: 1.0 });
  const coronaryMatBlue = new THREE.MeshPhysicalMaterial({ color: 0x00d4ff, emissive: 0x003355, roughness: 0.2, metalness: 0.1, clearcoat: 1.0 });
  const coronaryPaths = [
    { curve: new THREE.CatmullRomCurve3([new THREE.Vector3(-0.1, 0.55, 0.7), new THREE.Vector3(-0.25, 0.25, 0.75), new THREE.Vector3(-0.45, -0.1, 0.65), new THREE.Vector3(-0.35, -0.5, 0.45), new THREE.Vector3(-0.15, -0.8, 0.2)]), material: coronaryMatRed, radius: 0.02 },
    { curve: new THREE.CatmullRomCurve3([new THREE.Vector3(-0.25, 0.25, 0.75), new THREE.Vector3(-0.1, -0.05, 0.85), new THREE.Vector3(0.08, -0.35, 0.72), new THREE.Vector3(0.15, -0.65, 0.45)]), material: coronaryMatRed, radius: 0.015 },
    { curve: new THREE.CatmullRomCurve3([new THREE.Vector3(0.12, 0.5, 0.7), new THREE.Vector3(0.3, 0.2, 0.75), new THREE.Vector3(0.4, -0.15, 0.65), new THREE.Vector3(0.28, -0.55, 0.4)]), material: coronaryMatBlue, radius: 0.018 },
    { curve: new THREE.CatmullRomCurve3([new THREE.Vector3(0.3, 0.2, 0.75), new THREE.Vector3(0.1, -0.1, 0.8), new THREE.Vector3(-0.05, -0.38, 0.72)]), material: coronaryMatBlue, radius: 0.013 }
  ];
  coronaryPaths.forEach(({ curve, material, radius }) => {
    heartGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 32, radius, 8, false), material));
  });

  // ── Aorta (main artery tube) ──
  const aortaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.8, 0),
    new THREE.Vector3(0.2, 1.3, 0.1),
    new THREE.Vector3(0.5, 1.7, -0.1),
    new THREE.Vector3(0.3, 2.2, -0.3),
    new THREE.Vector3(-0.1, 2.5, -0.2),
  ]);
  const aortaGeo = new THREE.TubeGeometry(aortaCurve, 32, 0.12, 12, false);
  const aortaMat = new THREE.MeshPhysicalMaterial({
    color: 0xdd2244,
    roughness: 0.5,
    metalness: 0.05,
    transmission: 0.2,
    thickness: 0.8,
    transparent: true,
    opacity: 0.85,
  });
  const aortaMesh = new THREE.Mesh(aortaGeo, aortaMat);
  heartGroup.add(aortaMesh);

  // ── Pulmonary Arteries (bluish tubes) ──
  const pulmCurveLeft = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.2, 0.9, 0.1),
    new THREE.Vector3(-0.6, 1.4, 0.3),
    new THREE.Vector3(-1.0, 1.8, 0.1),
    new THREE.Vector3(-1.3, 2.1, -0.1),
  ]);
  const pulmCurveRight = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.2, 0.9, 0.15),
    new THREE.Vector3(0.7, 1.5, 0.35),
    new THREE.Vector3(1.1, 1.9, 0.15),
    new THREE.Vector3(1.4, 2.2, 0),
  ]);
  const pulmMat = new THREE.MeshPhysicalMaterial({
    color: 0x3366aa,
    roughness: 0.5,
    metalness: 0.05,
    transmission: 0.25,
    thickness: 0.6,
    transparent: true,
    opacity: 0.75,
  });

  [pulmCurveLeft, pulmCurveRight].forEach((curve) => {
    const geo = new THREE.TubeGeometry(curve, 24, 0.07, 10, false);
    const mesh = new THREE.Mesh(geo, pulmMat);
    heartGroup.add(mesh);
  });

  // ── Vein tubes (smaller, semi-transparent) ──
  const veinCurves = [
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.3, -0.5, 0.2),
      new THREE.Vector3(-0.5, -1.0, 0.3),
      new THREE.Vector3(-0.4, -1.5, 0.1),
    ]),
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.3, -0.5, 0.2),
      new THREE.Vector3(0.5, -1.0, 0.35),
      new THREE.Vector3(0.4, -1.5, 0.15),
    ]),
  ];
  const veinMat = new THREE.MeshPhysicalMaterial({
    color: 0x5533aa,
    roughness: 0.6,
    transmission: 0.3,
    thickness: 0.4,
    transparent: true,
    opacity: 0.6,
  });
  veinCurves.forEach((curve) => {
    const geo = new THREE.TubeGeometry(curve, 20, 0.05, 8, false);
    heartGroup.add(new THREE.Mesh(geo, veinMat));
  });

  // ── Blood Particles ──
  const particleCount = 200;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    // Distribute particles in a sphere around the heart
    const radius = 1.5 + Math.random() * 2.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    // Random velocity for orbital drift
    velocities[i3] = (Math.random() - 0.5) * 0.003;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.003;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.003;

    sizes[i] = Math.random() * 3 + 1;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // Custom shader for particles to make them round
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xff2244,
    size: 0.04,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // Secondary cyan particles (subtle)
  const cyanParticleCount = 80;
  const cyanPositions = new Float32Array(cyanParticleCount * 3);
  for (let i = 0; i < cyanParticleCount; i++) {
    const i3 = i * 3;
    const radius = 2 + Math.random() * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    cyanPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    cyanPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    cyanPositions[i3 + 2] = radius * Math.cos(phi);
  }
  const cyanParticleGeo = new THREE.BufferGeometry();
  cyanParticleGeo.setAttribute('position', new THREE.BufferAttribute(cyanPositions, 3));
  const cyanParticleMat = new THREE.PointsMaterial({
    color: 0x00d4ff,
    size: 0.025,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const cyanParticles = new THREE.Points(cyanParticleGeo, cyanParticleMat);
  scene.add(cyanParticles);

  // ── Post-Processing (Bloom) ──
  // Create custom render target with alpha support to preserve transparent background
  const size = new THREE.Vector2();
  renderer.getSize(size);
  const renderTarget = new THREE.WebGLRenderTarget(size.x, size.y, {
    format: THREE.RGBAFormat,
    type: THREE.HalfFloatType,
  });
  const composer = new EffectComposer(renderer, renderTarget);

  const renderPass = new RenderPass(scene, camera);
  renderPass.clearAlpha = 0; // Prevent clearing background transparency
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),
    1.2,  // increased strength for glowing veins/particles
    0.45, // radius
    0.2   // lower threshold to capture emissive highlights and glow beautifully
  );
  composer.addPass(bloomPass);

  // ── Mouse Tracking ──
  const mouse = { x: 0, y: 0 };
  const targetRotation = { x: 0, y: 0 };

  function onMouseMove(event) {
    // Normalize to -1..1
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // ── Animation Loop ──
  const clock = new THREE.Clock();
  let animationId;

  function animate() {
    animationId = requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();
    const delta = clock.getDelta();

    // ── Heart Rotation (slow Y-axis) ──
    heartGroup.rotation.y += 0.003;

    // ── Heartbeat pulse ──
    const heartbeatCycle = elapsed * 1.2; // beats per second
    const beatPhase = heartbeatCycle % 1;
    let systole = 0;
    let diastole = 0;
    
    if (beatPhase < 0.15) {
      systole = Math.sin((beatPhase / 0.15) * Math.PI);
    } else if (beatPhase > 0.3 && beatPhase < 0.45) {
      diastole = Math.sin(((beatPhase - 0.3) / 0.15) * Math.PI);
    }
    
    // Organic squeeze (non-uniform scale)
    heartGroup.scale.set(
        1.0 - 0.06 * systole + 0.02 * diastole,
        1.0 - 0.02 * systole + 0.03 * diastole,
        1.0 - 0.06 * systole + 0.02 * diastole
    );

    // Subtle breathing/floating movement
    heartGroup.position.y = Math.sin(elapsed * 1.5) * 0.05;

    // ── Mouse parallax ──
    targetRotation.x = mouse.y * 0.15;
    targetRotation.y = mouse.x * 0.15;
    heartGroup.rotation.x += (targetRotation.x - heartGroup.rotation.x) * 0.03;
    // Don't override Y rotation directly, add to the auto rotation
    // heartGroup.rotation.y already accumulates from auto-rotation

    // ── Animate blood particles (orbital drift) ──
    const posAttr = particleGeometry.getAttribute('position');
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Orbit around Y axis
      const x = posAttr.array[i3];
      const z = posAttr.array[i3 + 2];
      const speed = 0.002 + (i % 5) * 0.0005;
      const cos = Math.cos(speed);
      const sin = Math.sin(speed);
      posAttr.array[i3] = x * cos - z * sin;
      posAttr.array[i3 + 2] = x * sin + z * cos;

      // Gentle vertical bob
      posAttr.array[i3 + 1] += Math.sin(elapsed * 0.5 + i) * 0.0005;

      // Keep within bounds
      const dist = Math.sqrt(
        posAttr.array[i3] ** 2 +
        posAttr.array[i3 + 1] ** 2 +
        posAttr.array[i3 + 2] ** 2
      );
      if (dist > 4) {
        const factor = 3.5 / dist;
        posAttr.array[i3] *= factor;
        posAttr.array[i3 + 1] *= factor;
        posAttr.array[i3 + 2] *= factor;
      }
    }
    posAttr.needsUpdate = true;

    // Rotate cyan particles slowly in opposite direction
    cyanParticles.rotation.y -= 0.001;
    cyanParticles.rotation.x = Math.sin(elapsed * 0.2) * 0.1;

    // ── Light animation ──
    redLight.intensity = 2.5 + Math.sin(elapsed * 2) * 0.5;
    cyanLight.intensity = 2 + Math.cos(elapsed * 1.5) * 0.4;

    // ── Render with bloom ──
    composer.render();
  }

  animate();

  // ── Handle Resize ──
  function onResize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (width === 0 || height === 0) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    composer.setSize(width, height);
    bloomPass.resolution.set(width, height);
  }

  window.addEventListener('resize', onResize, { passive: true });

  // ── Cleanup function (for future use) ──
  return function dispose() {
    cancelAnimationFrame(animationId);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onResize);
    renderer.dispose();
    composer.dispose();
  };
}

/**
 * Create a heart-shaped geometry by displacing a sphere
 * Uses mathematical formula for cardioid shape
 */
function createHeartGeometry() {
  const segments = 96;
  const rings = 96;
  const geometry = new THREE.SphereGeometry(1, segments, rings);
  const positionAttr = geometry.getAttribute('position');
  const vertex = new THREE.Vector3();

  for (let i = 0; i < positionAttr.count; i++) {
    vertex.fromBufferAttribute(positionAttr, i);

    // Normalize to get the spherical direction
    const normalized = vertex.clone().normalize();
    const theta = Math.atan2(normalized.x, normalized.z); // angle around Y
    const phi = Math.acos(normalized.y); // angle from top

    // Heart shape formula using cardioid-based displacement
    // r = 1 - sin(phi) for the overall top-indent shape
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);

    // Create the classic heart top bumps
    let r = 1.0;

    // Top bumps (two lobes)
    if (cosPhi > 0) {
      // Upper hemisphere — create indentation at center top and two bumps
      const topBump = Math.abs(Math.sin(theta)) * cosPhi * 0.35;
      r += topBump;

      // Central top indentation
      const indentation = Math.pow(Math.cos(theta), 2) * cosPhi * 0.25;
      r -= indentation;
    }

    // Bottom point (pinch)
    if (cosPhi < -0.2) {
      const bottomFactor = Math.pow(Math.abs(cosPhi), 1.5);
      r *= 1 - bottomFactor * 0.5;

      // Elongate downward
      vertex.y -= bottomFactor * 0.3;
    }

    // Scale Y slightly (make it taller)
    vertex.y *= 1.15;

    // Apply the radial displacement
    const currentR = Math.sqrt(vertex.x ** 2 + vertex.z ** 2);
    if (currentR > 0.001) {
      const scale = r;
      vertex.x *= scale;
      vertex.z *= scale;
    }
    
    // Add muscle-like high-frequency noise for realism
    const freq = 3.5;
    const strength = 0.05; // Muscle bump strength
    const primaryNoise = Math.sin(vertex.x * freq + vertex.y * freq * 0.7) * Math.cos(vertex.z * freq * 1.3 + vertex.x * freq * 0.5);
    const fiberNoise = Math.sin(vertex.y * freq * 8.0) * 0.3; // Horizontal muscle fibers
    const noise = (primaryNoise * 0.8 + fiberNoise * 0.2) * strength;

    // Apply noise directly along the normal vector direction (normalized)
    positionAttr.setXYZ(
      i, 
      vertex.x + normalized.x * noise, 
      vertex.y + normalized.y * noise, 
      vertex.z + normalized.z * noise
    );
  }

  geometry.computeVertexNormals();
  return geometry;
}
