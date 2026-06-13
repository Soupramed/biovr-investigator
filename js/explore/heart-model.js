/* ============================================================
   BioVR-Investigator — Procedural 3D Heart Model
   Anatomically-inspired heart built with Three.js primitives,
   deformed geometries, and MeshPhysicalMaterial for organic look.
   ============================================================ */

import * as THREE from 'three';

/**
 * Anatomical data for each heart component.
 * Used for userData and info panel content.
 */
const ANATOMY_DATA = {
  'Atrium Kanan': {
    description: 'Ruang jantung bagian atas kanan yang menerima darah kotor (miskin oksigen) dari seluruh tubuh melalui Vena Kava Superior dan Inferior.',
    facts: [
      'Dinding atrium kanan lebih tipis dibanding ventrikel karena hanya memompa darah ke paru-paru.',
      'Nodus SA (sinoatrial) terletak di atrium kanan — pemacu detak jantung alami.',
      'Volume darah yang ditampung sekitar 57 mL.',
    ],
  },
  'Atrium Kiri': {
    description: 'Ruang jantung bagian atas kiri yang menerima darah bersih (kaya oksigen) dari paru-paru melalui empat Vena Pulmonalis.',
    facts: [
      'Dinding atrium kiri sedikit lebih tebal dari atrium kanan.',
      'Darah yang masuk ke sini telah diperkaya oksigen di alveolus paru.',
      'Fibrilasi atrium (Afib) sering berasal dari atrium kiri.',
    ],
  },
  'Ventrikel Kanan': {
    description: 'Ruang jantung bagian bawah kanan yang memompa darah miskin oksigen ke paru-paru melalui Arteri Pulmonalis.',
    facts: [
      'Dinding ventrikel kanan lebih tipis (3-5 mm) karena tekanan pompa ke paru lebih rendah.',
      'Bentuknya menyerupai bulan sabit jika dilihat dari potongan melintang.',
      'Gagal jantung kanan menyebabkan pembengkakan kaki dan perut.',
    ],
  },
  'Ventrikel Kiri': {
    description: 'Ruang jantung terbesar dan paling kuat. Memompa darah beroksigen ke seluruh tubuh melalui Aorta.',
    facts: [
      'Dinding ventrikel kiri 3× lebih tebal (12-15 mm) dari ventrikel kanan.',
      'Menghasilkan tekanan sistolik hingga 120 mmHg.',
      'Kegagalan ventrikel kiri adalah penyebab utama gagal jantung kongestif.',
    ],
  },
  'Septum': {
    description: 'Dinding pemisah antara sisi kiri dan kanan jantung, mencegah pencampuran darah beroksigen dan tanpa oksigen.',
    facts: [
      'Septum interventrikuler adalah bagian tertebal dari septum.',
      'Cacat septum (lubang di septum) adalah kelainan jantung bawaan paling umum.',
      'Terdiri dari bagian otot dan membranosa.',
    ],
  },
  'Katup Mitral': {
    description: 'Katup bikuspid (berdaun dua) antara atrium kiri dan ventrikel kiri. Memastikan darah mengalir searah.',
    facts: [
      'Satu-satunya katup jantung dengan dua daun katup (bikuspid).',
      'Prolaps katup mitral terjadi pada 2-3% populasi.',
      'Korda tendinea mengikat daun katup ke otot papilaris agar tidak terbalik.',
    ],
  },
  'Katup Trikuspid': {
    description: 'Katup berdaun tiga antara atrium kanan dan ventrikel kanan. Mencegah aliran balik darah ke atrium.',
    facts: [
      'Memiliki tiga daun katup: anterior, posterior, dan septal.',
      'Regurgitasi trikuspid sering terjadi akibat pelebaran ventrikel kanan.',
      'Terletak lebih rendah dari katup mitral.',
    ],
  },
  'Katup Aorta': {
    description: 'Katup semilunar di pangkal aorta. Mencegah darah kembali ke ventrikel kiri setelah dipompa keluar.',
    facts: [
      'Memiliki tiga daun berbentuk bulan sabit (semilunar).',
      'Stenosis aorta adalah penyempitan katup paling umum pada lansia.',
      'Tekanan membuka katup ini sekitar 80 mmHg.',
    ],
  },
  'Katup Pulmonal': {
    description: 'Katup semilunar di pangkal arteri pulmonalis. Mencegah aliran balik darah dari arteri pulmonalis ke ventrikel kanan.',
    facts: [
      'Tekanan membuka katup ini jauh lebih rendah (~10 mmHg) dibanding katup aorta.',
      'Stenosis pulmonal biasanya bersifat kongenital.',
      'Terletak paling anterior (depan) dari keempat katup jantung.',
    ],
  },
  'Aorta': {
    description: 'Arteri terbesar dalam tubuh. Membawa darah beroksigen dari ventrikel kiri ke seluruh tubuh.',
    facts: [
      'Diameter aorta sekitar 2,5 cm dan panjang total sekitar 30 cm.',
      'Lengkung aorta (arcus aorta) bercabang ke arteri kepala dan lengan.',
      'Aneurisma aorta bisa pecah dan mengancam jiwa.',
    ],
  },
  'Vena Kava Superior': {
    description: 'Vena besar yang mengalirkan darah miskin oksigen dari kepala, leher, dan lengan ke atrium kanan.',
    facts: [
      'Panjangnya sekitar 7 cm dengan diameter 2 cm.',
      'Tidak memiliki katup internal.',
      'Sindrom Vena Kava Superior menyebabkan pembengkakan wajah dan leher.',
    ],
  },
  'Vena Kava Inferior': {
    description: 'Vena terbesar dalam tubuh yang mengalirkan darah dari bagian bawah tubuh ke atrium kanan.',
    facts: [
      'Mengumpulkan darah dari hati, ginjal, dan kaki.',
      'Panjangnya sekitar 22 cm.',
      'Trombus di vena kava inferior bisa menyebabkan emboli paru.',
    ],
  },
  'Arteri Pulmonalis': {
    description: 'Satu-satunya arteri yang membawa darah miskin oksigen — dari ventrikel kanan ke paru-paru untuk pertukaran gas.',
    facts: [
      'Bercabang menjadi arteri pulmonalis kanan dan kiri.',
      'Tekanan darahnya hanya 25/10 mmHg (jauh lebih rendah dari aorta).',
      'Hipertensi pulmonal terjadi saat tekanan di arteri ini meningkat.',
    ],
  },
  'Vena Pulmonalis': {
    description: 'Satu-satunya vena yang membawa darah kaya oksigen — dari paru-paru ke atrium kiri.',
    facts: [
      'Ada 4 vena pulmonalis (2 dari tiap paru).',
      'Tidak memiliki katup.',
      'Fibrilasi atrium sering dipicu oleh sinyal listrik abnormal dari vena pulmonalis.',
    ],
  },
};

/**
 * Custom deformation: applies procedural noise to sphere geometry vertices
 * to simulate organic muscle fibers and uneven fleshy surface.
 */
function deformGeometry(geometry, strength = 0.15, freq = 2.5) {
  const pos = geometry.attributes.position;
  const normal = geometry.attributes.normal;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const nx = normal.getX(i);
    const ny = normal.getY(i);
    const nz = normal.getZ(i);
    
    // Complex noise combining multiple frequencies for muscle-like texture
    const primaryNoise = Math.sin(x * freq + y * freq * 0.7) * Math.cos(z * freq * 1.3 + x * freq * 0.5);
    const detailNoise = Math.sin(x * freq * 4.0) * Math.cos(y * freq * 4.0) * Math.sin(z * freq * 4.0);
    const fiberNoise = Math.sin(y * freq * 8.0) * 0.3; // Horizontal muscle fibers
    
    const noise = (primaryNoise * 0.8 + detailNoise * 0.15 + fiberNoise * 0.05) * strength;
    
    pos.setX(i, x + nx * noise);
    pos.setY(i, y + ny * noise);
    pos.setZ(i, z + nz * noise);
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
}

/**
 * Creates a highly realistic 'wet, fleshy' material using MeshPhysicalMaterial
 */
function createFleshyMaterial(colorHex, opacity = 0.95) {
  return new THREE.MeshPhysicalMaterial({
    color: colorHex,
    roughness: 0.25,          // Lower roughness for wet look
    metalness: 0.15,
    clearcoat: 1.0,           // High clearcoat for specular highlights (wetness)
    clearcoatRoughness: 0.1,
    transmission: 0.35,       // Subsurface scattering effect
    thickness: 2.0,           // Volume for light to scatter through
    transparent: true,
    opacity: opacity,
    side: THREE.DoubleSide,
    emissive: colorHex,
    emissiveIntensity: 0.05,  // Slight organic glow
  });
}

/**
 * Create a tube mesh along a CatmullRomCurve3 path.
 */
function createTube(points, radius, color, opacity = 0.85) {
  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.TubeGeometry(curve, 32, radius, 12, false);
  const mat = new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.55,
    metalness: 0.05,
    clearcoat: 0.3,
    clearcoatRoughness: 0.4,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
  });
  return new THREE.Mesh(geo, mat);
}

/**
 * Create a valve disc mesh.
 */
function createValve(position, rotation, scaleX, scaleY, color = 0xee8899) {
  const geo = new THREE.TorusGeometry(0.22, 0.06, 12, 24);
  const mat = new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.4,
    metalness: 0.05,
    clearcoat: 0.5,
    clearcoatRoughness: 0.3,
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.copy(position);
  if (rotation) mesh.rotation.set(rotation.x, rotation.y, rotation.z);
  if (scaleX) mesh.scale.set(scaleX, scaleY || scaleX, 1);
  return mesh;
}

/* ── HeartModel Class ── */
export class HeartModel {
  /**
   * @param {THREE.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'HeartModel';
    this.interactiveObjects = [];
    this.layers = { chambers: [], valves: [], vessels: [] };
    this.originalMaterials = new Map();
    this.heartbeatPhase = 0;

    this._loadModelOrFallback();

    // Slight tilt for natural orientation
    this.group.rotation.set(0.1, 0, -0.15);
    this.scene.add(this.group);
  }

  _loadModelOrFallback() {
    // We use the highly detailed procedural model for best interactivity and anatomy data
    this._buildChambers();
    this._buildSeptum();
    this._buildValves();
    this._buildVessels();
    this._buildFatAndCoronaries();
  }

  /* ────────────────────────────────────────
     CHAMBERS
     ──────────────────────────────────────── */
  _buildChambers() {
    // ── Atrium Kanan ──
    const arGeo = new THREE.SphereGeometry(0.55, 64, 64); // Increased resolution for better noise
    arGeo.scale(1, 0.85, 0.9);
    deformGeometry(arGeo, 0.08, 3.5);
    const arMat = createFleshyMaterial(0x58448c); // Rich organic deoxygenated purple-blue
    const atriumKanan = new THREE.Mesh(arGeo, arMat);
    atriumKanan.position.set(0.55, 0.5, 0);
    atriumKanan.name = 'Atrium Kanan';
    this._setUserData(atriumKanan);
    this.group.add(atriumKanan);
    this.interactiveObjects.push(atriumKanan);
    this.layers.chambers.push(atriumKanan);
    this.originalMaterials.set(atriumKanan, arMat);

    // ── Atrium Kiri ──
    const alGeo = new THREE.SphereGeometry(0.52, 64, 64);
    alGeo.scale(1, 0.85, 0.9);
    deformGeometry(alGeo, 0.08, 3.8);
    const alMat = createFleshyMaterial(0xc54165); // Rich organic oxygenated crimson pink
    const atriumKiri = new THREE.Mesh(alGeo, alMat);
    atriumKiri.position.set(-0.5, 0.5, 0);
    atriumKiri.name = 'Atrium Kiri';
    this._setUserData(atriumKiri);
    this.group.add(atriumKiri);
    this.interactiveObjects.push(atriumKiri);
    this.layers.chambers.push(atriumKiri);
    this.originalMaterials.set(atriumKiri, alMat);

    // ── Ventrikel Kanan ──
    const vrGeo = new THREE.SphereGeometry(0.65, 64, 64);
    vrGeo.scale(0.95, 1.15, 0.9);
    deformGeometry(vrGeo, 0.1, 3.0);
    const vrMat = createFleshyMaterial(0x4d3b80); // Fleshy deoxygenated blue-purple
    const ventrikelKanan = new THREE.Mesh(vrGeo, vrMat);
    ventrikelKanan.position.set(0.6, -0.5, 0.05);
    ventrikelKanan.name = 'Ventrikel Kanan';
    this._setUserData(ventrikelKanan);
    this.group.add(ventrikelKanan);
    this.interactiveObjects.push(ventrikelKanan);
    this.layers.chambers.push(ventrikelKanan);
    this.originalMaterials.set(ventrikelKanan, vrMat);

    // ── Ventrikel Kiri ──
    const vlGeo = new THREE.SphereGeometry(0.72, 64, 64);
    vlGeo.scale(1.0, 1.25, 0.95);
    deformGeometry(vlGeo, 0.09, 2.8);
    const vlMat = createFleshyMaterial(0xb81432); // Deep fleshy oxygenated red
    const ventrikelKiri = new THREE.Mesh(vlGeo, vlMat);
    ventrikelKiri.position.set(-0.55, -0.55, 0.05);
    ventrikelKiri.name = 'Ventrikel Kiri';
    this._setUserData(ventrikelKiri);
    this.group.add(ventrikelKiri);
    this.interactiveObjects.push(ventrikelKiri);
    this.layers.chambers.push(ventrikelKiri);
    this.originalMaterials.set(ventrikelKiri, vlMat);
  }

  /* ────────────────────────────────────────
     SEPTUM
     ──────────────────────────────────────── */
  _buildSeptum() {
    const sGeo = new THREE.BoxGeometry(0.12, 1.6, 1.1, 16, 32, 16);
    deformGeometry(sGeo, 0.04, 4);
    const sMat = createFleshyMaterial(0xa82442, 0.85); // Organic septum color
    const septum = new THREE.Mesh(sGeo, sMat);
    septum.position.set(0.03, -0.05, 0.02);
    septum.name = 'Septum';
    this._setUserData(septum);
    this.group.add(septum);
    this.interactiveObjects.push(septum);
    this.layers.chambers.push(septum);
    this.originalMaterials.set(septum, sMat);
  }

  /* ────────────────────────────────────────
     VALVES
     ──────────────────────────────────────── */
  _buildValves() {
    const valveColor = 0xee8899;

    // Katup Mitral — between atrium kiri & ventrikel kiri
    const mitral = createValve(
      new THREE.Vector3(-0.5, 0.0, 0),
      new THREE.Euler(Math.PI / 2, 0, 0.1),
      1.2, 1.0, valveColor
    );
    mitral.name = 'Katup Mitral';
    this._setUserData(mitral);
    this.group.add(mitral);
    this.interactiveObjects.push(mitral);
    this.layers.valves.push(mitral);
    this.originalMaterials.set(mitral, mitral.material);

    // Katup Trikuspid — between atrium kanan & ventrikel kanan
    const trikuspid = createValve(
      new THREE.Vector3(0.55, 0.0, 0),
      new THREE.Euler(Math.PI / 2, 0, -0.1),
      1.2, 1.0, valveColor
    );
    trikuspid.name = 'Katup Trikuspid';
    this._setUserData(trikuspid);
    this.group.add(trikuspid);
    this.interactiveObjects.push(trikuspid);
    this.layers.valves.push(trikuspid);
    this.originalMaterials.set(trikuspid, trikuspid.material);

    // Katup Aorta — at aorta opening
    const katupAorta = createValve(
      new THREE.Vector3(-0.45, 0.95, 0.15),
      new THREE.Euler(0.3, 0, 0.1),
      0.9, 0.9, 0xeeaa99
    );
    katupAorta.name = 'Katup Aorta';
    this._setUserData(katupAorta);
    this.group.add(katupAorta);
    this.interactiveObjects.push(katupAorta);
    this.layers.valves.push(katupAorta);
    this.originalMaterials.set(katupAorta, katupAorta.material);

    // Katup Pulmonal — at pulmonary artery opening
    const katupPulmo = createValve(
      new THREE.Vector3(0.35, 0.9, 0.2),
      new THREE.Euler(0.2, 0, -0.1),
      0.85, 0.85, 0xeeaa99
    );
    katupPulmo.name = 'Katup Pulmonal';
    this._setUserData(katupPulmo);
    this.group.add(katupPulmo);
    this.interactiveObjects.push(katupPulmo);
    this.layers.valves.push(katupPulmo);
    this.originalMaterials.set(katupPulmo, katupPulmo.material);
  }

  /* ────────────────────────────────────────
     VESSELS
     ──────────────────────────────────────── */
  _buildVessels() {
    const redVessel = 0xcc2244;
    const blueVessel = 0x4466aa;

    // ── Aorta — large red tube going up, arching ──
    const aorta = createTube([
      new THREE.Vector3(-0.45, 0.95, 0.15),
      new THREE.Vector3(-0.4, 1.4, 0.15),
      new THREE.Vector3(-0.2, 1.8, 0.1),
      new THREE.Vector3(0.15, 2.1, 0.0),
      new THREE.Vector3(0.5, 2.0, -0.1),
      new THREE.Vector3(0.6, 1.7, -0.2),
      new THREE.Vector3(0.55, 1.2, -0.3),
    ], 0.16, redVessel, 0.8);
    aorta.name = 'Aorta';
    this._setUserData(aorta);
    this.group.add(aorta);
    this.interactiveObjects.push(aorta);
    this.layers.vessels.push(aorta);
    this.originalMaterials.set(aorta, aorta.material);

    // ── Vena Kava Superior — blue tube from above ──
    const vks = createTube([
      new THREE.Vector3(0.7, 2.0, -0.05),
      new THREE.Vector3(0.65, 1.6, -0.02),
      new THREE.Vector3(0.6, 1.2, 0),
      new THREE.Vector3(0.55, 0.8, 0),
    ], 0.13, blueVessel, 0.75);
    vks.name = 'Vena Kava Superior';
    this._setUserData(vks);
    this.group.add(vks);
    this.interactiveObjects.push(vks);
    this.layers.vessels.push(vks);
    this.originalMaterials.set(vks, vks.material);

    // ── Vena Kava Inferior — blue tube from below ──
    const vki = createTube([
      new THREE.Vector3(0.6, -1.6, -0.1),
      new THREE.Vector3(0.58, -1.2, -0.05),
      new THREE.Vector3(0.55, -0.8, 0),
      new THREE.Vector3(0.55, -0.2, 0),
    ], 0.14, blueVessel, 0.75);
    vki.name = 'Vena Kava Inferior';
    this._setUserData(vki);
    this.group.add(vki);
    this.interactiveObjects.push(vki);
    this.layers.vessels.push(vki);
    this.originalMaterials.set(vki, vki.material);

    // ── Arteri Pulmonalis — blue tube going to lungs ──
    const ap = createTube([
      new THREE.Vector3(0.35, 0.9, 0.2),
      new THREE.Vector3(0.2, 1.3, 0.35),
      new THREE.Vector3(-0.1, 1.55, 0.3),
      new THREE.Vector3(-0.5, 1.6, 0.2),
    ], 0.12, blueVessel, 0.75);
    ap.name = 'Arteri Pulmonalis';
    this._setUserData(ap);
    this.group.add(ap);
    this.interactiveObjects.push(ap);
    this.layers.vessels.push(ap);
    this.originalMaterials.set(ap, ap.material);

    // ── Vena Pulmonalis — red tubes from lungs (2 pairs) ──
    const vpPoints1 = [
      new THREE.Vector3(-1.3, 1.0, 0.15),
      new THREE.Vector3(-1.0, 0.85, 0.1),
      new THREE.Vector3(-0.75, 0.7, 0.05),
      new THREE.Vector3(-0.55, 0.55, 0),
    ];
    const vpPoints2 = [
      new THREE.Vector3(-1.3, 0.5, 0.2),
      new THREE.Vector3(-1.0, 0.5, 0.12),
      new THREE.Vector3(-0.75, 0.5, 0.06),
      new THREE.Vector3(-0.55, 0.5, 0),
    ];

    const vp1 = createTube(vpPoints1, 0.07, redVessel, 0.7);
    const vp2 = createTube(vpPoints2, 0.07, redVessel, 0.7);

    // Group vena pulmonalis
    const vpGroup = new THREE.Group();
    vpGroup.add(vp1);
    vpGroup.add(vp2);
    vpGroup.name = 'Vena Pulmonalis';

    // Make the group interactive via a transparent bounding mesh
    const vpBound = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.6, 0.3),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    vpBound.position.set(-0.9, 0.72, 0.1);
    vpBound.name = 'Vena Pulmonalis';
    this._setUserData(vpBound);

    this.group.add(vpGroup);
    this.group.add(vpBound);
    this.interactiveObjects.push(vpBound);
    this.layers.vessels.push(vpGroup);
    this.originalMaterials.set(vp1, vp1.material);
    this.originalMaterials.set(vp2, vp2.material);
  }

  /* ────────────────────────────────────────
     FAT & CORONARY VESSELS (Sulcus Fat Deposits)
     ──────────────────────────────────────── */
  _buildFatAndCoronaries() {
    // ── Adipose Tissue (Sulcus Fat Deposits) ──
    const fatMat = new THREE.MeshPhysicalMaterial({
      color: 0xe5c130, // Waxy yellow fat color
      roughness: 0.75,
      metalness: 0.05,
      clearcoat: 0.15,
      side: THREE.DoubleSide,
    });

    const fatCurves = [
      // Coronary Sulcus (Horizontal band)
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.7, 0.1, 0.15),
        new THREE.Vector3(-0.4, 0.15, 0.4),
        new THREE.Vector3(0.0, 0.1, 0.45),
        new THREE.Vector3(0.4, 0.15, 0.4),
        new THREE.Vector3(0.7, 0.1, 0.15),
        new THREE.Vector3(0.5, 0.05, -0.3),
        new THREE.Vector3(-0.1, 0.08, -0.35),
        new THREE.Vector3(-0.5, 0.05, -0.3),
        new THREE.Vector3(-0.7, 0.1, 0.15),
      ]),
      // Anterior Interventricular Sulcus (Front vertical)
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.0, 0.1, 0.45),
        new THREE.Vector3(0.02, -0.2, 0.52),
        new THREE.Vector3(-0.06, -0.6, 0.48),
        new THREE.Vector3(-0.18, -0.9, 0.32),
        new THREE.Vector3(-0.25, -1.15, 0.1),
      ]),
      // Posterior Interventricular Sulcus (Back vertical)
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.1, 0.08, -0.35),
        new THREE.Vector3(-0.08, -0.3, -0.42),
        new THREE.Vector3(-0.12, -0.7, -0.32),
        new THREE.Vector3(-0.25, -1.15, 0.1),
      ]),
    ];

    fatCurves.forEach((curve) => {
      const geo = new THREE.TubeGeometry(curve, 48, 0.055, 8, true);
      const mesh = new THREE.Mesh(geo, fatMat);
      mesh.name = 'Jaringan Lemak';
      this.group.add(mesh);
      this.layers.chambers.push(mesh); // Categorize as chambers/muscle layers for visibility toggle
    });

    // ── Coronary Blood Vessels creeping on top of fat ──
    const arteryMat = new THREE.MeshPhysicalMaterial({
      color: 0xff3366,
      emissive: 0x550011,
      roughness: 0.2,
      metalness: 0.1,
      clearcoat: 1.0,
    });

    const veinMat = new THREE.MeshPhysicalMaterial({
      color: 0x00d4ff,
      emissive: 0x002255,
      roughness: 0.2,
      metalness: 0.1,
      clearcoat: 1.0,
    });

    const vesselPaths = [
      // Left Coronary Artery (Red) crawling along front sulcus
      {
        curve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.05, 0.12, 0.48),
          new THREE.Vector3(-0.02, -0.2, 0.54),
          new THREE.Vector3(-0.09, -0.6, 0.5),
          new THREE.Vector3(-0.2, -0.9, 0.34),
          new THREE.Vector3(-0.26, -1.15, 0.12),
        ]),
        material: arteryMat,
        radius: 0.018,
      },
      // Left Coronary Branches
      {
        curve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.09, -0.6, 0.5),
          new THREE.Vector3(-0.25, -0.75, 0.42),
          new THREE.Vector3(-0.4, -0.85, 0.25),
        ]),
        material: arteryMat,
        radius: 0.012,
      },
      // Right Coronary Vein (Blue) next to it
      {
        curve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(0.04, 0.08, 0.48),
          new THREE.Vector3(0.06, -0.2, 0.54),
          new THREE.Vector3(-0.03, -0.6, 0.5),
          new THREE.Vector3(-0.15, -0.9, 0.34),
        ]),
        material: veinMat,
        radius: 0.016,
      },
      // Right Coronary Vein Branch
      {
        curve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(0.06, -0.2, 0.54),
          new THREE.Vector3(0.2, -0.4, 0.5),
          new THREE.Vector3(0.35, -0.55, 0.35),
        ]),
        material: veinMat,
        radius: 0.012,
      },
    ];

    vesselPaths.forEach(({ curve, material, radius }) => {
      const geo = new THREE.TubeGeometry(curve, 32, radius, 8, false);
      const mesh = new THREE.Mesh(geo, material);
      mesh.name = 'Pembuluh Koroner';
      this.group.add(mesh);
      this.layers.vessels.push(mesh);
    });
  }

  /* ────────────────────────────────────────
     UTILITIES
     ──────────────────────────────────────── */
  _setUserData(mesh) {
    const data = ANATOMY_DATA[mesh.name];
    if (data) {
      mesh.userData = {
        name: mesh.name,
        description: data.description,
        facts: data.facts,
      };
    }
  }

  /**
   * Returns an array of meshes that can be raycasted for click interaction.
   */
  getInteractiveObjects() {
    return this.interactiveObjects;
  }

  /**
   * Returns the 3D world position of a named part (for label placement).
   */
  getPartPosition(name) {
    const obj = this.interactiveObjects.find((o) => o.name === name);
    if (!obj) return null;
    const pos = new THREE.Vector3();
    obj.getWorldPosition(pos);
    return pos;
  }

  /* ────────────────────────────────────────
     HIGHLIGHT
     ──────────────────────────────────────── */
  highlightPart(name) {
    this.resetHighlight();
    const obj = this.interactiveObjects.find((o) => o.name === name);
    if (!obj) return;

    const highlightMat = new THREE.MeshPhysicalMaterial({
      color: 0x00d4ff,
      roughness: 0.3,
      metalness: 0.15,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    });

    if (obj.isMesh && obj.material) {
      obj.material = highlightMat;
    }

    // Dim other interactive objects slightly
    for (const other of this.interactiveObjects) {
      if (other !== obj && other.isMesh && this.originalMaterials.has(other)) {
        const orig = this.originalMaterials.get(other);
        other.material = orig.clone();
        other.material.opacity = Math.max(orig.opacity * 0.35, 0.15);
        other.material.transparent = true;
      }
    }
  }

  resetHighlight() {
    for (const obj of this.interactiveObjects) {
      if (obj.isMesh && this.originalMaterials.has(obj)) {
        obj.material = this.originalMaterials.get(obj);
      }
    }
  }

  /* ────────────────────────────────────────
     LAYERS
     ──────────────────────────────────────── */
  toggleLayer(layerName) {
    const items = this.layers[layerName];
    if (!items) return;
    for (const obj of items) {
      obj.visible = !obj.visible;
    }
    return items.length > 0 ? items[0].visible : true;
  }

  /* ────────────────────────────────────────
     HEARTBEAT ANIMATION
     ──────────────────────────────────────── */
  animate(time) {
    this.heartbeatPhase = time * 0.001;
    // Real heart rate timing
    const beatPhase = (this.heartbeatPhase * 1.2) % 1.0;
    
    let systole = 0;
    let diastole = 0;
    
    // Systole (Ventricular contraction)
    if (beatPhase > 0.0 && beatPhase < 0.15) {
        systole = Math.sin((beatPhase / 0.15) * Math.PI);
    }
    // Diastole (Atrial contraction / Ventricular filling)
    if (beatPhase > 0.3 && beatPhase < 0.45) {
        diastole = Math.sin(((beatPhase - 0.3) / 0.15) * Math.PI);
    }

    // Animate chambers organically (not stiff)
    this.layers.chambers.forEach(mesh => {
        if (mesh.name.includes('Ventrikel')) {
            // Ventricles twist and squeeze inward
            mesh.scale.set(
                1.0 - 0.06 * systole + 0.02 * diastole,
                1.0 - 0.02 * systole + 0.04 * diastole,
                1.0 - 0.06 * systole + 0.02 * diastole
            );
        } else if (mesh.name.includes('Atrium')) {
            // Atria contract during diastole
            mesh.scale.set(
                1.0 + 0.04 * systole - 0.06 * diastole,
                1.0 + 0.04 * systole - 0.06 * diastole,
                1.0 + 0.04 * systole - 0.06 * diastole
            );
        }
    });

    // Subtle breathing/floating movement
    this.group.rotation.x = 0.1 + Math.sin(time * 0.0005) * 0.02;
    this.group.rotation.z = -0.15 + Math.cos(time * 0.0004) * 0.02;
    this.group.position.y = Math.sin(time * 0.001) * 0.03;

    // Valves and vessels animation
    for (const valve of this.layers.valves) {
      valve.rotation.z += Math.sin(time * 0.003) * 0.0005;
      if (valve.name === 'Katup Mitral' || valve.name === 'Katup Trikuspid') {
          valve.scale.set(1.0 + 0.15 * diastole - 0.1 * systole, 1.0 + 0.15 * diastole - 0.1 * systole, 1);
      } else {
          valve.scale.set(1.0 + 0.2 * systole - 0.1 * diastole, 1.0 + 0.2 * systole - 0.1 * diastole, 1);
      }
    }
    for (const vessel of this.layers.vessels) {
        if (vessel.name === 'Aorta' || vessel.name === 'Arteri Pulmonalis') {
            vessel.scale.set(1.0 + 0.04 * systole, 1.0, 1.0 + 0.04 * systole);
        }
    }
  }

  /* ────────────────────────────────────────
     CUTAWAY VIEW
     ──────────────────────────────────────── */
  setCutaway(enabled) {
    if (enabled) {
      // Use clipping plane to cut away front half
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      this.group.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material = child.material.clone();
          child.material.clippingPlanes = [plane];
          child.material.clipShadows = true;
          child.material.side = THREE.DoubleSide;
        }
      });
    } else {
      // Restore original materials
      for (const [mesh, mat] of this.originalMaterials) {
        mesh.material = mat;
      }
    }
  }
}
