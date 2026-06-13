import * as THREE from 'three';

export class AnatomyLabels {
  constructor(camera, renderer) {
    this.camera = camera;
    this.renderer = renderer;
    this.container = document.getElementById('label-container');
    this.labels = [];
    this.visible = true;

    // Track mouse to know when to show labels based on raycast?
    // In this basic version, we just project fixed 3D points to 2D
  }

  addLabel(name, object3D, color = 'cyan') {
    const el = document.createElement('div');
    el.className = `anatomy-label label-${color}`;
    el.innerHTML = `
      <div class="label-dot"></div>
      <div class="label-text">${name}</div>
    `;
    this.container.appendChild(el);

    const labelObj = {
      name,
      element: el,
      object3D,
      visible: true
    };

    this.labels.push(labelObj);

    // Initial positioning
    this.updateLabelPosition(labelObj);
  }

  update() {
    if (!this.visible) return;
    
    this.labels.forEach(label => {
      if (label.visible) {
        this.updateLabelPosition(label);
      }
    });
  }

  updateLabelPosition(label) {
    const vector = new THREE.Vector3();
    
    // Get position of the 3D object in world space
    label.object3D.getWorldPosition(vector);
    
    // Project to 2D screen space
    vector.project(this.camera);
    
    // Convert to CSS coordinates
    const widthHalf = window.innerWidth / 2;
    const heightHalf = window.innerHeight / 2;
    
    const x = (vector.x * widthHalf) + widthHalf;
    const y = -(vector.y * heightHalf) + heightHalf;
    
    // Check if behind camera
    if (vector.z > 1) {
      label.element.style.display = 'none';
      return;
    }
    
    label.element.style.display = 'flex';
    label.element.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
  }

  toggle() {
    this.visible = !this.visible;
    this.container.style.display = this.visible ? 'block' : 'none';
  }

  highlightLabel(name) {
    this.labels.forEach(label => {
      if (label.name.toLowerCase().includes(name.toLowerCase())) {
        label.element.classList.add('pulse');
        setTimeout(() => label.element.classList.remove('pulse'), 3000);
      }
    });
  }
}
