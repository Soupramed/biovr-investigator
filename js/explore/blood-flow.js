/* ============================================================
   BioVR-Investigator — Blood Flow Particle Simulation
   Red blood cells flowing through heart & vessels using
   InstancedMesh and CatmullRomCurve3 paths.
   ============================================================ */

import * as THREE from 'three';

/** Number of particles per path */
const PARTICLES_PER_PATH = 80;

/** Red blood cell (flattened disc) geometry */
function createRBCGeometry() {
  const geo = new THREE.SphereGeometry(0.025, 8, 6);
  // Flatten to disc shape
  geo.scale(1.0, 0.35, 1.0);
  return geo;
}

/** White blood cell geometry (slightly larger sphere) */
function createWBCGeometry() {
  return new THREE.SphereGeometry(0.03, 8, 6);
}

/**
 * Blood flow paths through the heart anatomy.
 * Each path is an array of Vector3 control points.
 */
const FLOW_PATHS = {
  // Path 1: Vena Kava Superior → Atrium Kanan → Ventrikel Kanan
  venaKavaSuperiorToVentrikel: [
    new THREE.Vector3(0.7, 2.0, -0.05),
    new THREE.Vector3(0.65, 1.6, -0.02),
    new THREE.Vector3(0.6, 1.2, 0),
    new THREE.Vector3(0.55, 0.7, 0),
    new THREE.Vector3(0.55, 0.3, 0),
    new THREE.Vector3(0.57, 0.0, 0),
    new THREE.Vector3(0.6, -0.3, 0.05),
    new THREE.Vector3(0.6, -0.5, 0.05),
  ],
  // Path 2: Vena Kava Inferior → Atrium Kanan → Ventrikel Kanan
  venaKavaInferiorToVentrikel: [
    new THREE.Vector3(0.6, -1.6, -0.1),
    new THREE.Vector3(0.58, -1.2, -0.05),
    new THREE.Vector3(0.55, -0.8, 0),
    new THREE.Vector3(0.55, -0.2, 0),
    new THREE.Vector3(0.55, 0.2, 0),
    new THREE.Vector3(0.55, 0.5, 0),
    new THREE.Vector3(0.55, 0.0, 0),
    new THREE.Vector3(0.6, -0.5, 0.05),
  ],
  // Path 3: Ventrikel Kanan → Arteri Pulmonalis (to lungs)
  ventrikelKananToPulmo: [
    new THREE.Vector3(0.6, -0.3, 0.05),
    new THREE.Vector3(0.5, 0.2, 0.1),
    new THREE.Vector3(0.35, 0.9, 0.2),
    new THREE.Vector3(0.2, 1.3, 0.35),
    new THREE.Vector3(-0.1, 1.55, 0.3),
    new THREE.Vector3(-0.5, 1.6, 0.2),
  ],
  // Path 4: Vena Pulmonalis → Atrium Kiri → Ventrikel Kiri
  venaPulmonalisToVentrikel: [
    new THREE.Vector3(-1.3, 1.0, 0.15),
    new THREE.Vector3(-1.0, 0.85, 0.1),
    new THREE.Vector3(-0.75, 0.7, 0.05),
    new THREE.Vector3(-0.5, 0.5, 0),
    new THREE.Vector3(-0.5, 0.2, 0),
    new THREE.Vector3(-0.5, 0.0, 0),
    new THREE.Vector3(-0.55, -0.3, 0.05),
    new THREE.Vector3(-0.55, -0.55, 0.05),
  ],
  // Path 5: Ventrikel Kiri → Aorta (to body)
  ventrikelKiriToAorta: [
    new THREE.Vector3(-0.55, -0.3, 0.05),
    new THREE.Vector3(-0.5, 0.3, 0.1),
    new THREE.Vector3(-0.45, 0.95, 0.15),
    new THREE.Vector3(-0.4, 1.4, 0.15),
    new THREE.Vector3(-0.2, 1.8, 0.1),
    new THREE.Vector3(0.15, 2.1, 0.0),
    new THREE.Vector3(0.5, 2.0, -0.1),
    new THREE.Vector3(0.6, 1.7, -0.2),
  ],
  // Path 6: Secondary vena pulmonalis path
  venaPulmonalis2: [
    new THREE.Vector3(-1.3, 0.5, 0.2),
    new THREE.Vector3(-1.0, 0.5, 0.12),
    new THREE.Vector3(-0.75, 0.5, 0.06),
    new THREE.Vector3(-0.55, 0.5, 0),
    new THREE.Vector3(-0.5, 0.2, 0),
    new THREE.Vector3(-0.5, 0.0, 0),
    new THREE.Vector3(-0.55, -0.3, 0.05),
  ],
  // Path 7: Circulating around aortic arch
  aorticCirculation: [
    new THREE.Vector3(0.6, 1.7, -0.2),
    new THREE.Vector3(0.55, 1.2, -0.3),
    new THREE.Vector3(0.5, 0.8, -0.25),
    new THREE.Vector3(0.55, 0.4, -0.15),
    new THREE.Vector3(0.6, 0.0, -0.05),
  ],
};

/**
 * BloodFlow class — manages particle simulation along heart paths.
 */
export class BloodFlow {
  /**
   * @param {THREE.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'BloodFlow';
    this.visible = true;
    this.mode = 'normal';
    this.pathSystems = [];
    this.plaqueMesh = null;
    this.wbcSystems = [];

    this._buildPaths();
    this.scene.add(this.group);
  }

  /**
   * Build InstancedMesh systems for each flow path.
   */
  _buildPaths() {
    const rbcGeo = createRBCGeometry();
    const pathKeys = Object.keys(FLOW_PATHS);

    for (const key of pathKeys) {
      const points = FLOW_PATHS[key];
      const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);

      // Determine color based on path (oxygenated vs deoxygenated)
      const isOxygenated =
        key.includes('Pulmonalis') && key.includes('vena') ||
        key.includes('Aorta') || key.includes('aortic') ||
        key.includes('venaPulmonalis');
      const color = isOxygenated ? 0xee3344 : 0x7755cc;

      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.85,
      });

      const count = PARTICLES_PER_PATH;
      const instancedMesh = new THREE.InstancedMesh(rbcGeo, mat, count);
      instancedMesh.frustumCulled = false;

      // Initialize particle positions along the curve
      const particles = [];
      for (let i = 0; i < count; i++) {
        const t = i / count;
        const speed = 0.15 + Math.random() * 0.1; // Slight variation
        const offset = (Math.random() - 0.5) * 0.06; // Lateral offset
        particles.push({
          t,
          speed,
          offsetX: offset,
          offsetZ: (Math.random() - 0.5) * 0.06,
          rotationSpeed: Math.random() * 2 - 1,
        });
      }

      this.pathSystems.push({
        key,
        curve,
        instancedMesh,
        particles,
        count,
        isOxygenated,
        originalColor: color,
      });

      this.group.add(instancedMesh);
    }
  }

  /**
   * Animate all particles along their respective curves.
   * @param {number} time — elapsed time in ms from the animation loop
   */
  animate(time) {
    if (!this.visible) return;

    const delta = 0.001;
    const dummy = new THREE.Object3D();
    const speedMultiplier = this.mode === 'atherosclerosis' ? 0.5 : 1.0;

    for (const system of this.pathSystems) {
      const { curve, instancedMesh, particles, count } = system;

      for (let i = 0; i < count; i++) {
        const p = particles[i];

        // Advance along curve
        p.t += p.speed * delta * speedMultiplier;
        if (p.t > 1) p.t -= 1;
        if (p.t < 0) p.t += 1;

        // Get position on curve
        const point = curve.getPointAt(p.t);

        // Apply lateral offset for natural spread
        dummy.position.set(
          point.x + p.offsetX,
          point.y,
          point.z + p.offsetZ
        );

        // Rotate disc to face forward along curve
        const tangent = curve.getTangentAt(p.t);
        dummy.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          tangent.normalize()
        );
        // Add tumbling rotation
        dummy.rotateZ(time * 0.001 * p.rotationSpeed);

        // Scale variation (anemia mode: some cells are smaller/paler)
        let scale = 1.0;
        if (this.mode === 'anemia' && i % 3 === 0) {
          scale = 0.6;
        }
        dummy.scale.set(scale, scale, scale);

        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);

        // Anemia: make some cells pale
        if (this.mode === 'anemia' && i % 3 === 0) {
          instancedMesh.setColorAt(i, new THREE.Color(0xffaaaa));
        }
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.instanceColor) {
        instancedMesh.instanceColor.needsUpdate = true;
      }
    }

    // Animate WBC systems in leukemia mode
    for (const wbc of this.wbcSystems) {
      const { curve, instancedMesh, particles, count } = wbc;
      for (let i = 0; i < count; i++) {
        const p = particles[i];
        p.t += p.speed * delta * 0.8;
        if (p.t > 1) p.t -= 1;

        const point = curve.getPointAt(p.t);
        dummy.position.set(point.x + p.offsetX, point.y, point.z + p.offsetZ);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
      }
      instancedMesh.instanceMatrix.needsUpdate = true;
    }
  }

  /**
   * Toggle blood flow visibility.
   */
  toggle() {
    this.visible = !this.visible;
    this.group.visible = this.visible;
    return this.visible;
  }

  /**
   * Set simulation mode.
   * @param {'normal'|'anemia'|'atherosclerosis'|'leukemia'} mode
   */
  setMode(mode) {
    this.mode = mode;

    // Clean up previous mode artifacts
    this._removeWBC();
    this._removePlaque();

    // Reset colors
    for (const system of this.pathSystems) {
      system.instancedMesh.material.color.set(system.originalColor);
      // Reset instance colors
      if (system.instancedMesh.instanceColor) {
        for (let i = 0; i < system.count; i++) {
          system.instancedMesh.setColorAt(i, new THREE.Color(system.originalColor));
        }
        system.instancedMesh.instanceColor.needsUpdate = true;
      }
    }

    switch (mode) {
      case 'anemia':
        // Colors handled in animate() — pale cells
        for (const system of this.pathSystems) {
          // Initialize instance colors for anemia
          for (let i = 0; i < system.count; i++) {
            const color = i % 3 === 0
              ? new THREE.Color(0xffaaaa)
              : new THREE.Color(system.originalColor);
            system.instancedMesh.setColorAt(i, color);
          }
          system.instancedMesh.instanceColor.needsUpdate = true;
        }
        break;

      case 'atherosclerosis':
        this._addPlaque();
        break;

      case 'leukemia':
        this._addWBC();
        break;

      default:
        break;
    }
  }

  /**
   * Add yellow plaque blockage mesh for atherosclerosis mode.
   */
  _addPlaque() {
    const geo = new THREE.SphereGeometry(0.15, 16, 12);
    geo.scale(1.6, 0.7, 1.2);
    deformGeo(geo, 0.04, 5);
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xddaa44,
      roughness: 0.7,
      metalness: 0.0,
      clearcoat: 0.2,
      emissive: 0xddaa44,
      emissiveIntensity: 0.15,
      transparent: true,
      opacity: 0.85,
    });
    this.plaqueMesh = new THREE.Mesh(geo, mat);
    // Place on aorta path (about 40% along)
    this.plaqueMesh.position.set(-0.35, 1.5, 0.13);
    this.plaqueMesh.name = 'Plaque';
    this.group.add(this.plaqueMesh);
  }

  _removePlaque() {
    if (this.plaqueMesh) {
      this.group.remove(this.plaqueMesh);
      this.plaqueMesh.geometry.dispose();
      this.plaqueMesh.material.dispose();
      this.plaqueMesh = null;
    }
  }

  /**
   * Add excessive white blood cells for leukemia mode.
   */
  _addWBC() {
    const wbcGeo = createWBCGeometry();
    const wbcMat = new THREE.MeshBasicMaterial({
      color: 0xeeeeff,
      transparent: true,
      opacity: 0.9,
    });

    const pathKeys = Object.keys(FLOW_PATHS);
    for (const key of pathKeys.slice(0, 4)) {
      const points = FLOW_PATHS[key];
      const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
      const count = 30; // Excess WBCs

      const instancedMesh = new THREE.InstancedMesh(wbcGeo, wbcMat, count);
      instancedMesh.frustumCulled = false;

      const particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          t: Math.random(),
          speed: 0.1 + Math.random() * 0.08,
          offsetX: (Math.random() - 0.5) * 0.08,
          offsetZ: (Math.random() - 0.5) * 0.08,
        });
      }

      this.wbcSystems.push({ curve, instancedMesh, particles, count });
      this.group.add(instancedMesh);
    }
  }

  _removeWBC() {
    for (const wbc of this.wbcSystems) {
      this.group.remove(wbc.instancedMesh);
      wbc.instancedMesh.geometry.dispose();
      wbc.instancedMesh.material.dispose();
    }
    this.wbcSystems = [];
  }
}

/* ── Helper: simple vertex deformation for plaque ── */
function deformGeo(geometry, strength, freq) {
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const noise = Math.sin(x * freq) * Math.cos(z * freq * 1.3) * strength;
    pos.setX(i, x + noise);
    pos.setY(i, y + noise * 0.5);
    pos.setZ(i, z + noise * 0.3);
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
}
