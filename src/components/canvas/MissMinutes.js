import * as THREE from 'three';

// 3D Animated Miss Minutes (Loki TVA Mascot)
// Walking on air, floating, glowing, winking, and mentoring beside Loki
// Faithfully modeled after the official TVA 3D character reference sheet
export class MissMinutes {
  constructor() {
    this.group = new THREE.Group();
    this.isTalking = false;
    this.targetX = 1.35;
    this.targetY = 1.85;
    this.targetZ = 8.5;
    this.currentX = 1.35;
    this.currentY = 1.85;
    this.currentZ = 8.5;
    this.blinkTimer = 0;
    this.winkTimer = 0;
    this.isWinking = false;

    this.initModel();
  }

  createFaceCanvas() {
    this.faceCanvas = document.createElement('canvas');
    this.faceCanvas.width = 512;
    this.faceCanvas.height = 512;
    this.faceCtx = this.faceCanvas.getContext('2d');
    this.faceTexture = new THREE.CanvasTexture(this.faceCanvas);
    this.faceTexture.colorSpace = THREE.SRGBColorSpace;
    this.renderFace(0, false, false, 0);
  }

  renderFace(eyeOffsetX = 0, isBlinking = false, isWinking = false, mouthState = 0) {
    const ctx = this.faceCtx;
    const w = 512;
    const h = 512;

    ctx.clearRect(0, 0, w, h);

    // Warm Vintage Wood-grain Dial Background (Matching reference sheet)
    const dialGrad = ctx.createRadialGradient(256, 256, 40, 256, 256, 230);
    dialGrad.addColorStop(0, '#ffae42'); // Warm amber-gold wood center
    dialGrad.addColorStop(0.7, '#ea580c'); // Signature TVA orange
    dialGrad.addColorStop(1, '#c2410c'); // Deep burnt orange border

    ctx.fillStyle = dialGrad;
    ctx.beginPath();
    ctx.arc(256, 256, 232, 0, Math.PI * 2);
    ctx.fill();

    // Subtle natural woodgrain arcs
    ctx.strokeStyle = 'rgba(154, 52, 18, 0.18)';
    ctx.lineWidth = 2.5;
    for (let r = 80; r < 230; r += 26) {
      ctx.beginPath();
      ctx.ellipse(256, 256, r, r * 0.94, 0.1, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Outer Rim Border
    ctx.strokeStyle = '#7c2d12';
    ctx.lineWidth = 14;
    ctx.stroke();

    // Retro Black Hour Indices (matching Miss Minutes reference sheet)
    // Thick bold hour bars at 12, 3, 6, 9
    ctx.fillStyle = '#431407';
    ctx.strokeStyle = '#431407';
    ctx.lineCap = 'round';

    // 12 o'clock bar
    ctx.fillRect(248, 54, 16, 44);
    // 6 o'clock bar
    ctx.fillRect(248, 414, 16, 44);
    // 9 o'clock bar
    ctx.fillRect(54, 248, 44, 16);
    // 3 o'clock bar
    ctx.fillRect(414, 248, 44, 16);

    // Other Hour Tick Marks
    for (let i = 0; i < 12; i++) {
      if (i % 3 === 0) continue;
      const angle = (i * Math.PI) / 6;
      const x1 = 256 + Math.cos(angle) * 192;
      const y1 = 256 + Math.sin(angle) * 192;
      const x2 = 256 + Math.cos(angle) * 218;
      const y2 = 256 + Math.sin(angle) * 218;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Little round nose button
    ctx.fillStyle = '#431407';
    ctx.beginPath();
    ctx.arc(256, 235, 9, 0, Math.PI * 2);
    ctx.fill();

    // Eyes: Handle Blinking & Winking
    const leftEyeClosed = isBlinking;
    const rightEyeClosed = isBlinking || isWinking;

    // LEFT EYE
    if (leftEyeClosed) {
      ctx.strokeStyle = '#431407';
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.arc(190, 195, 28, Math.PI, 0, true);
      ctx.stroke();
    } else {
      // White sclera
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#431407';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.ellipse(190, 195, 36, 56, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Pupil
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.ellipse(195 + eyeOffsetX * 8, 195, 22, 34, 0, 0, Math.PI * 2);
      ctx.fill();

      // Catchlight
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(188 + eyeOffsetX * 8, 180, 8, 0, Math.PI * 2);
      ctx.fill();

      // Curved Eyelashes
      ctx.strokeStyle = '#431407';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(165, 148);
      ctx.lineTo(152, 134);
      ctx.moveTo(190, 140);
      ctx.lineTo(190, 122);
      ctx.moveTo(215, 148);
      ctx.lineTo(228, 134);
      ctx.stroke();
    }

    // RIGHT EYE (Can Wink into happy arc!)
    if (rightEyeClosed) {
      ctx.strokeStyle = '#431407';
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.arc(322, 195, 28, Math.PI, 0, true);
      ctx.stroke();

      // Winking flutter lashes
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(298, 195);
      ctx.lineTo(288, 184);
      ctx.moveTo(346, 195);
      ctx.lineTo(356, 184);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#431407';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.ellipse(322, 195, 36, 56, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.ellipse(327 + eyeOffsetX * 8, 195, 22, 34, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(320 + eyeOffsetX * 8, 180, 8, 0, Math.PI * 2);
      ctx.fill();

      // Curved Eyelashes
      ctx.strokeStyle = '#431407';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(297, 148);
      ctx.lineTo(284, 134);
      ctx.moveTo(322, 140);
      ctx.lineTo(322, 122);
      ctx.moveTo(347, 148);
      ctx.lineTo(360, 134);
      ctx.stroke();
    }

    // Rosy Cheeks
    ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.beginPath();
    ctx.ellipse(135, 255, 22, 14, 0, 0, Math.PI * 2);
    ctx.ellipse(377, 255, 22, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cartoon Mouth
    ctx.strokeStyle = '#431407';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';

    if (mouthState > 0.3) {
      // Open talking mouth
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.arc(256, 275, 46, 0.1 * Math.PI, 0.9 * Math.PI, false);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Tongue
      ctx.fillStyle = '#fca5a5';
      ctx.beginPath();
      ctx.arc(256, 310, 26, 1.1 * Math.PI, 1.9 * Math.PI, false);
      ctx.fill();
    } else {
      // Sweet classic warm smile
      ctx.beginPath();
      ctx.arc(256, 260, 52, 0.18 * Math.PI, 0.82 * Math.PI, false);
      ctx.stroke();

      // Smile end dimples
      ctx.beginPath();
      ctx.moveTo(205, 285);
      ctx.lineTo(198, 292);
      ctx.moveTo(307, 285);
      ctx.lineTo(314, 292);
      ctx.stroke();
    }

    // Center pivot cap
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(256, 256, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 4;
    ctx.stroke();

    if (this.faceTexture) {
      this.faceTexture.needsUpdate = true;
    }
  }

  initModel() {
    this.createFaceCanvas();

    // 1. Clock Body Shell (Disc)
    const clockRadius = 0.58;
    const clockThickness = 0.18;

    const faceGeo = new THREE.CylinderGeometry(clockRadius, clockRadius, clockThickness, 48);
    faceGeo.rotateX(Math.PI / 2);

    const casingMaterial = new THREE.MeshStandardMaterial({
      color: 0xe65100, // Rich TVA Orange casing
      roughness: 0.35,
      metalness: 0.25,
    });

    const faceMaterial = new THREE.MeshBasicMaterial({
      map: this.faceTexture,
    });

    const materials = [
      casingMaterial, // Rim
      faceMaterial,   // Front face (+Z)
      casingMaterial, // Back face (-Z)
    ];

    this.clockMesh = new THREE.Mesh(faceGeo, materials);
    this.clockMesh.castShadow = true;
    this.group.add(this.clockMesh);

    // Golden Bezel Trim Ring
    const bezelGeo = new THREE.TorusGeometry(clockRadius + 0.015, 0.025, 16, 64);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0xffb703,
      roughness: 0.2,
      metalness: 0.85,
    });
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    this.group.add(bezelMesh);

    // 2. White Gloved Hands & Arms with Striped Cuffs
    const gloveMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.35,
    });
    const armMat = new THREE.MeshStandardMaterial({
      color: 0xe65100,
      roughness: 0.4,
    });

    // Left Arm & Glove
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-clockRadius - 0.04, 0, 0);
    this.group.add(this.leftArm);

    const armGeo = new THREE.CylinderGeometry(0.038, 0.038, 0.38, 12);
    const leftArmMesh = new THREE.Mesh(armGeo, armMat);
    leftArmMesh.position.set(-0.14, -0.12, 0);
    leftArmMesh.rotation.z = Math.PI / 4;
    this.leftArm.add(leftArmMesh);

    const gloveGeo = new THREE.SphereGeometry(0.095, 16, 16);
    this.leftGlove = new THREE.Mesh(gloveGeo, gloveMat);
    this.leftGlove.position.set(-0.28, -0.25, 0);
    this.leftArm.add(this.leftGlove);

    // Right Arm & Glove (Waving hand on air!)
    this.rightArm = new THREE.Group();
    this.rightArm.position.set(clockRadius + 0.04, 0, 0);
    this.group.add(this.rightArm);

    const rightArmMesh = new THREE.Mesh(armGeo, armMat);
    rightArmMesh.position.set(0.14, 0.12, 0);
    rightArmMesh.rotation.z = -Math.PI / 4;
    this.rightArm.add(rightArmMesh);

    this.rightGlove = new THREE.Mesh(gloveGeo, gloveMat);
    this.rightGlove.position.set(0.28, 0.25, 0);
    this.rightArm.add(this.rightGlove);

    // 3. Cute Cartoon Orange Boots (Walking on Air!)
    const legMat = new THREE.MeshStandardMaterial({
      color: 0x431407, // Dark slender legs from reference sheet
      roughness: 0.6,
    });
    const bootMat = new THREE.MeshStandardMaterial({
      color: 0xf97316, // Cute warm orange boots
      roughness: 0.3,
      metalness: 0.2,
    });

    const legGeo = new THREE.CylinderGeometry(0.026, 0.026, 0.35, 12);
    const bootGeo = new THREE.BoxGeometry(0.12, 0.11, 0.22);
    const bootCuffGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.04, 16);

    // Left Leg & Boot
    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(-0.18, -clockRadius, 0);
    this.group.add(this.leftLeg);

    const leftLegMesh = new THREE.Mesh(legGeo, legMat);
    leftLegMesh.position.y = -0.17;
    this.leftLeg.add(leftLegMesh);

    const leftBootMesh = new THREE.Mesh(bootGeo, bootMat);
    leftBootMesh.position.set(0, -0.34, 0.05);
    leftBootMesh.castShadow = true;
    this.leftLeg.add(leftBootMesh);

    const leftCuffMesh = new THREE.Mesh(bootCuffGeo, bootMat);
    leftCuffMesh.position.set(0, -0.28, 0.02);
    this.leftLeg.add(leftCuffMesh);

    // Right Leg & Boot
    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(0.18, -clockRadius, 0);
    this.group.add(this.rightLeg);

    const rightLegMesh = new THREE.Mesh(legGeo, legMat);
    rightLegMesh.position.y = -0.17;
    this.rightLeg.add(rightLegMesh);

    const rightBootMesh = new THREE.Mesh(bootGeo, bootMat);
    rightBootMesh.position.set(0, -0.34, 0.05);
    rightBootMesh.castShadow = true;
    this.rightLeg.add(rightBootMesh);

    const rightCuffMesh = new THREE.Mesh(bootCuffGeo, bootMat);
    rightCuffMesh.position.set(0, -0.28, 0.02);
    this.rightLeg.add(rightCuffMesh);

    // 4. Hologram Glow Aura & Point Light
    this.light = new THREE.PointLight(0xff8800, 2.4, 6);
    this.light.position.set(0, 0, 0.3);
    this.group.add(this.light);

    // Holographic Halos
    const holoRingGeo = new THREE.RingGeometry(clockRadius + 0.04, clockRadius + 0.12, 32);
    const holoRingMat = new THREE.MeshBasicMaterial({
      color: 0xff9900,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    this.holoRing = new THREE.Mesh(holoRingGeo, holoRingMat);
    this.holoRing.position.z = -0.02;
    this.group.add(this.holoRing);

    this.group.position.set(this.currentX, this.currentY, this.currentZ);
  }

  setTargetPosition(x, y, z) {
    this.targetX = x;
    this.targetY = y;
    this.targetZ = z;
  }

  update(delta, time, isTalking = false, shouldWink = false) {
    this.isTalking = isTalking;

    // Smooth position interpolation
    this.currentX = THREE.MathUtils.lerp(this.currentX, this.targetX, delta * 3.6);
    this.currentY = THREE.MathUtils.lerp(this.currentY, this.targetY, delta * 3.6);
    this.currentZ = THREE.MathUtils.lerp(this.currentZ, this.targetZ, delta * 3.6);

    // Floating bob & tilt physics
    const hoverOffset = Math.sin(time * 3.4) * 0.11;
    const airTilt = Math.sin(time * 1.9) * 0.06;

    this.group.position.set(
      this.currentX,
      this.currentY + hoverOffset,
      this.currentZ
    );

    this.group.rotation.z = airTilt;
    this.group.rotation.y = Math.sin(time * 1.3) * 0.14;

    // Air-walking boots cycle
    const stepSpeed = 4.8;
    this.leftLeg.rotation.x = Math.sin(time * stepSpeed) * 0.48;
    this.rightLeg.rotation.x = -Math.sin(time * stepSpeed) * 0.48;

    // Waving hand cycle
    this.rightArm.rotation.z = Math.sin(time * 6.5) * 0.28;
    this.leftArm.rotation.z = Math.sin(time * 2.8) * 0.12;

    // Blinking & Winking state machine
    this.blinkTimer += delta;
    this.winkTimer += delta;

    let isBlinking = false;
    let isWinking = shouldWink;

    if (this.blinkTimer > 3.6) {
      isBlinking = true;
      if (this.blinkTimer > 3.85) {
        this.blinkTimer = 0;
      }
    }

    if (this.winkTimer > 6.0 && !isBlinking) {
      isWinking = true;
      if (this.winkTimer > 6.8) {
        this.winkTimer = 0;
      }
    }

    const eyeOffsetX = Math.sin(time * 0.9) * 0.55;
    const mouthState = isTalking ? (Math.sin(time * 20) > 0 ? 0.85 : 0) : 0;

    // Refresh 2D Canvas Face
    this.renderFace(eyeOffsetX, isBlinking, isWinking, mouthState);

    // Light intensity pulse
    this.light.intensity = 2.2 + Math.sin(time * 4) * 0.6;
    this.holoRing.rotation.z += delta * 0.5;
  }
}
