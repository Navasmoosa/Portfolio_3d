import * as THREE from 'three';
import { soundEngine } from '../../utils/SoundEffects';

// 3D Realistic Animated Navas Moosa Character in Bespoke All-Black Suit
// Open-World Interactive Walking Character with 4-Direction Navigation
export class TVACharacter {
  constructor() {
    this.group = new THREE.Group();
    this.isWalking = false;
    this.walkCycle = 0;
    this.targetZ = 8;
    this.currentZ = 8;
    this.targetX = 0;
    this.currentX = 0;
    this.turnAngle = Math.PI; // Face forward down the corridor (-Z)
    this.targetAngle = Math.PI;
    this.stepCount = 0;
    this.lastFootstep = 0;

    this.initModel();
  }

  initModel() {
    // 1. Curated Materials matching Navas Moosa 3D Character Sheet
    // Tailored Obsidian Black Suit Jacket
    const suitJacketMat = new THREE.MeshStandardMaterial({
      color: 0x18181b, // Bespoke Tailored Obsidian Black
      roughness: 0.7,
      metalness: 0.12,
    });

    // Satin Black Lapel / Accent Material
    const lapelMat = new THREE.MeshStandardMaterial({
      color: 0x101012,
      roughness: 0.55,
      metalness: 0.18,
    });

    // Tailored Black Trousers
    const pantsMat = new THREE.MeshStandardMaterial({
      color: 0x141416,
      roughness: 0.78,
      metalness: 0.06,
    });

    // Black Collared Shirt (Matching 3D Character Model Sheet)
    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0x1c1c20,
      roughness: 0.6,
      metalness: 0.04,
    });

    // Slim Obsidian Tie / Placket Accent
    const tieMat = new THREE.MeshStandardMaterial({
      color: 0x0f0f11,
      roughness: 0.5,
      metalness: 0.15,
    });

    // Navas Moosa Natural Warm South Asian Skin Tone
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xc49372,
      roughness: 0.62,
      metalness: 0.0,
    });

    // Dark Wavy Textured Hair
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x110f0d,
      roughness: 0.55,
      metalness: 0.1,
    });

    // Polished Black Leather Shoes
    const shoeMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0c,
      roughness: 0.22,
      metalness: 0.42,
    });

    // Sole & Heel
    const soleMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.9,
    });

    // Golden TVA Insignia / Lapel Pin & Buttons
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.2,
      metalness: 0.9,
    });

    // 2. Pelvis / Hips Group
    this.pelvis = new THREE.Group();
    this.pelvis.position.y = 0.92;
    this.group.add(this.pelvis);

    const hipsGeo = new THREE.BoxGeometry(0.38, 0.22, 0.24);
    const hipsMesh = new THREE.Mesh(hipsGeo, pantsMat);
    hipsMesh.castShadow = true;
    this.pelvis.add(hipsMesh);

    // 3. Torso (Jacket, Collared Shirt, Necktie, Golden TVA Badge)
    this.torso = new THREE.Group();
    this.torso.position.y = 0.11;
    this.pelvis.add(this.torso);

    // Main Jacket Body
    const jacketGeo = new THREE.BoxGeometry(0.44, 0.52, 0.26);
    const jacketMesh = new THREE.Mesh(jacketGeo, suitJacketMat);
    jacketMesh.position.y = 0.26;
    jacketMesh.castShadow = true;
    this.torso.add(jacketMesh);

    // Jacket Lower Peplum / Hem
    const skirtGeo = new THREE.BoxGeometry(0.45, 0.18, 0.27);
    const skirtMesh = new THREE.Mesh(skirtGeo, suitJacketMat);
    skirtMesh.position.y = -0.05;
    skirtMesh.castShadow = true;
    this.torso.add(skirtMesh);

    // Left and Right Notched Lapels
    const lapelLeftGeo = new THREE.BoxGeometry(0.1, 0.32, 0.04);
    const lapelLeft = new THREE.Mesh(lapelLeftGeo, lapelMat);
    lapelLeft.position.set(-0.11, 0.34, 0.135);
    lapelLeft.rotation.z = -0.15;
    this.torso.add(lapelLeft);

    const lapelRightGeo = new THREE.BoxGeometry(0.1, 0.32, 0.04);
    const lapelRight = new THREE.Mesh(lapelRightGeo, lapelMat);
    lapelRight.position.set(0.11, 0.34, 0.135);
    lapelRight.rotation.z = 0.15;
    this.torso.add(lapelRight);

    // Cream Shirt Collar V-Insert
    const shirtGeo = new THREE.BoxGeometry(0.16, 0.24, 0.02);
    const shirtMesh = new THREE.Mesh(shirtGeo, shirtMat);
    shirtMesh.position.set(0, 0.40, 0.132);
    this.torso.add(shirtMesh);

    // Tie Knot & Tan Necktie
    const tieKnotGeo = new THREE.ConeGeometry(0.04, 0.06, 4);
    tieKnotGeo.rotateZ(Math.PI);
    const tieKnot = new THREE.Mesh(tieKnotGeo, tieMat);
    tieKnot.position.set(0, 0.45, 0.145);
    this.torso.add(tieKnot);

    const tieBodyGeo = new THREE.BoxGeometry(0.065, 0.32, 0.015);
    const tieBody = new THREE.Mesh(tieBodyGeo, tieMat);
    tieBody.position.set(0, 0.28, 0.142);
    this.torso.add(tieBody);

    // Gold Collar Pins
    const pinGeo = new THREE.SphereGeometry(0.012, 8, 8);
    const pinL = new THREE.Mesh(pinGeo, goldMat);
    pinL.position.set(-0.06, 0.46, 0.14);
    this.torso.add(pinL);
    const pinR = new THREE.Mesh(pinGeo, goldMat);
    pinR.position.set(0.06, 0.46, 0.14);
    this.torso.add(pinR);

    // Golden TVA Shield Lapel Pin (Left Chest)
    const badgeGeo = new THREE.BoxGeometry(0.045, 0.055, 0.01);
    const badgeMesh = new THREE.Mesh(badgeGeo, goldMat);
    badgeMesh.position.set(0.13, 0.38, 0.14);
    this.torso.add(badgeMesh);

    // Front Brass Suit Buttons (4-button style from reference)
    for (let i = 0; i < 4; i++) {
      const btnGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.01, 8);
      btnGeo.rotateX(Math.PI / 2);
      const btn = new THREE.Mesh(btnGeo, goldMat);
      btn.position.set(0, 0.10 + i * 0.09, 0.14);
      this.torso.add(btn);
    }

    // Flap Welt Pockets
    const pocketGeo = new THREE.BoxGeometry(0.1, 0.02, 0.02);
    const pocketL = new THREE.Mesh(pocketGeo, lapelMat);
    pocketL.position.set(-0.14, 0.06, 0.135);
    this.torso.add(pocketL);
    const pocketR = new THREE.Mesh(pocketGeo, lapelMat);
    pocketR.position.set(0.14, 0.06, 0.135);
    this.torso.add(pocketR);

    // 4. Neck, Head & Loki's Long Flowing Hair
    this.headGroup = new THREE.Group();
    this.headGroup.position.y = 0.54;
    this.torso.add(this.headGroup);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.075, 0.085, 0.1, 14);
    const neckMesh = new THREE.Mesh(neckGeo, skinMat);
    neckMesh.position.y = 0.04;
    this.headGroup.add(neckMesh);

    // Head Sculpt
    const headGeo = new THREE.BoxGeometry(0.22, 0.27, 0.22);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.position.y = 0.21;
    headMesh.castShadow = true;
    this.headGroup.add(headMesh);

    // Eyes (Subtle brown/green eyes from reference)
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x2e2015 });
    const eyeGeo = new THREE.BoxGeometry(0.035, 0.015, 0.01);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.055, 0.22, 0.115);
    this.headGroup.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.055, 0.22, 0.115);
    this.headGroup.add(eyeR);

    // Defined Eyebrows
    const browMat = new THREE.MeshBasicMaterial({ color: 0x14100e });
    const browGeo = new THREE.BoxGeometry(0.05, 0.012, 0.01);
    const browL = new THREE.Mesh(browGeo, browMat);
    browL.position.set(-0.055, 0.24, 0.116);
    this.headGroup.add(browL);
    const browR = new THREE.Mesh(browGeo, browMat);
    browR.position.set(0.055, 0.24, 0.116);
    this.headGroup.add(browR);

    // Nose
    const noseGeo = new THREE.ConeGeometry(0.025, 0.06, 4);
    noseGeo.rotateX(Math.PI / 4);
    const nose = new THREE.Mesh(noseGeo, skinMat);
    nose.position.set(0, 0.19, 0.12);
    this.headGroup.add(nose);

    // --- NAVAS MOOSA'S SIGNATURE DARK WAVY HAIR ---
    // Top Hair Volume & Waves
    const hairTopGeo = new THREE.BoxGeometry(0.25, 0.13, 0.25);
    const hairTop = new THREE.Mesh(hairTopGeo, hairMat);
    hairTop.position.set(0, 0.33, 0.01);
    this.headGroup.add(hairTop);

    // Front Fringe Curls (Slightly overhang forehead)
    const hairFrontGeo = new THREE.BoxGeometry(0.22, 0.07, 0.06);
    const hairFront = new THREE.Mesh(hairFrontGeo, hairMat);
    hairFront.position.set(0, 0.28, 0.12);
    this.headGroup.add(hairFront);

    // Left Wavy Side Locks
    const hairLeftGeo = new THREE.BoxGeometry(0.045, 0.18, 0.23);
    const hairLeft = new THREE.Mesh(hairLeftGeo, hairMat);
    hairLeft.position.set(-0.115, 0.25, 0.0);
    this.headGroup.add(hairLeft);

    // Right Wavy Side Locks
    const hairRightGeo = new THREE.BoxGeometry(0.045, 0.18, 0.23);
    const hairRight = new THREE.Mesh(hairRightGeo, hairMat);
    hairRight.position.set(0.115, 0.25, 0.0);
    this.headGroup.add(hairRight);

    // Back Tapered Hair
    const hairBackGeo1 = new THREE.BoxGeometry(0.23, 0.20, 0.06);
    const hairBack1 = new THREE.Mesh(hairBackGeo1, hairMat);
    hairBack1.position.set(0, 0.23, -0.115);
    this.headGroup.add(hairBack1);

    // 5. Arms & Hands
    const armUpperGeo = new THREE.BoxGeometry(0.13, 0.28, 0.13);
    const armForeGeo = new THREE.BoxGeometry(0.12, 0.26, 0.12);
    const handGeo = new THREE.BoxGeometry(0.09, 0.11, 0.06);

    // Left Arm
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.28, 0.44, 0);
    this.torso.add(this.leftArm);

    const leftBicep = new THREE.Mesh(armUpperGeo, suitJacketMat);
    leftBicep.position.y = -0.12;
    leftBicep.castShadow = true;
    this.leftArm.add(leftBicep);

    this.leftForearm = new THREE.Group();
    this.leftForearm.position.y = -0.26;
    this.leftArm.add(this.leftForearm);

    const leftForeMesh = new THREE.Mesh(armForeGeo, suitJacketMat);
    leftForeMesh.position.y = -0.12;
    leftForeMesh.castShadow = true;
    this.leftForearm.add(leftForeMesh);

    // Cream shirt cuff
    const cuffGeo = new THREE.BoxGeometry(0.125, 0.025, 0.125);
    const cuffL = new THREE.Mesh(cuffGeo, shirtMat);
    cuffL.position.y = -0.24;
    this.leftForearm.add(cuffL);

    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.position.set(0, -0.30, 0);
    this.leftForearm.add(leftHand);

    // Right Arm
    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.28, 0.44, 0);
    this.torso.add(this.rightArm);

    const rightBicep = new THREE.Mesh(armUpperGeo, suitJacketMat);
    rightBicep.position.y = -0.12;
    rightBicep.castShadow = true;
    this.rightArm.add(rightBicep);

    this.rightForearm = new THREE.Group();
    this.rightForearm.position.y = -0.26;
    this.rightArm.add(this.rightForearm);

    const rightForeMesh = new THREE.Mesh(armForeGeo, suitJacketMat);
    rightForeMesh.position.y = -0.12;
    rightForeMesh.castShadow = true;
    this.rightForearm.add(rightForeMesh);

    const cuffR = new THREE.Mesh(cuffGeo, shirtMat);
    cuffR.position.y = -0.24;
    this.rightForearm.add(cuffR);

    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.position.set(0, -0.30, 0);
    this.rightForearm.add(rightHand);

    // 6. Legs & Burnished Cognac Shoes
    const legThighGeo = new THREE.BoxGeometry(0.16, 0.32, 0.16);
    const legShinGeo = new THREE.BoxGeometry(0.15, 0.32, 0.15);
    const shoeGeo = new THREE.BoxGeometry(0.14, 0.09, 0.25);
    const soleGeo = new THREE.BoxGeometry(0.145, 0.025, 0.26);

    // Left Leg
    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(-0.12, -0.06, 0);
    this.pelvis.add(this.leftLeg);

    const leftThigh = new THREE.Mesh(legThighGeo, pantsMat);
    leftThigh.position.y = -0.15;
    leftThigh.castShadow = true;
    this.leftLeg.add(leftThigh);

    this.leftShinGroup = new THREE.Group();
    this.leftShinGroup.position.y = -0.30;
    this.leftLeg.add(this.leftShinGroup);

    const leftShin = new THREE.Mesh(legShinGeo, pantsMat);
    leftShin.position.y = -0.16;
    leftShin.castShadow = true;
    this.leftShinGroup.add(leftShin);

    const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
    leftShoe.position.set(0, -0.34, 0.04);
    leftShoe.castShadow = true;
    this.leftShinGroup.add(leftShoe);

    const leftSole = new THREE.Mesh(soleGeo, soleMat);
    leftSole.position.set(0, -0.39, 0.04);
    this.leftShinGroup.add(leftSole);

    // Right Leg
    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(0.12, -0.06, 0);
    this.pelvis.add(this.rightLeg);

    const rightThigh = new THREE.Mesh(legThighGeo, pantsMat);
    rightThigh.position.y = -0.15;
    rightThigh.castShadow = true;
    this.rightLeg.add(rightThigh);

    this.rightShinGroup = new THREE.Group();
    this.rightShinGroup.position.y = -0.30;
    this.rightLeg.add(this.rightShinGroup);

    const rightShin = new THREE.Mesh(legShinGeo, pantsMat);
    rightShin.position.y = -0.16;
    rightShin.castShadow = true;
    this.rightShinGroup.add(rightShin);

    const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
    rightShoe.position.set(0, -0.34, 0.04);
    rightShoe.castShadow = true;
    this.rightShinGroup.add(rightShoe);

    const rightSole = new THREE.Mesh(soleGeo, soleMat);
    rightSole.position.set(0, -0.39, 0.04);
    this.rightShinGroup.add(rightSole);

    this.group.scale.set(1.18, 1.18, 1.18);
  }

  setTargetPosition(x, z) {
    this.targetX = Math.max(-3.2, Math.min(3.2, x));
    this.targetZ = Math.max(-60, Math.min(10.5, z));
  }

  // One discrete step on arrow click (Forward, Backward, Left, Right)
  step(direction, distance = 1.35) {
    let nextX = this.targetX;
    let nextZ = this.targetZ;

    if (direction === 'forward') {
      nextZ -= distance; // Walk forward down the corridor (-Z)
      this.targetAngle = Math.PI;
    } else if (direction === 'backward') {
      nextZ += distance; // Walk backward towards entrance (+Z)
      this.targetAngle = 0;
    } else if (direction === 'left') {
      nextX -= distance; // Walk left (-X)
      this.targetAngle = -Math.PI / 2;
    } else if (direction === 'right') {
      nextX += distance; // Walk right (+X)
      this.targetAngle = Math.PI / 2;
    }

    // World collision bounds
    this.targetX = Math.max(-3.2, Math.min(3.2, nextX));
    this.targetZ = Math.max(-60, Math.min(10.5, nextZ));
    this.stepCount++;

    soundEngine.playFootstep();
    return { x: this.targetX, z: this.targetZ, stepCount: this.stepCount };
  }

  // Continuous movement when keys/buttons are held down
  walkVelocity(vx, vz, delta, speed = 4.6) {
    if (Math.abs(vx) < 0.01 && Math.abs(vz) < 0.01) return;

    const nextX = this.targetX + vx * speed * delta;
    const nextZ = this.targetZ + vz * speed * delta;

    this.targetX = Math.max(-3.2, Math.min(3.2, nextX));
    this.targetZ = Math.max(-60, Math.min(10.5, nextZ));

    // Dynamic heading angle
    this.targetAngle = Math.atan2(vx, vz);
  }

  update(delta, time) {
    const distX = this.targetX - this.currentX;
    const distZ = this.targetZ - this.currentZ;
    const distance = Math.sqrt(distX * distX + distZ * distZ);

    if (distance > 0.04) {
      this.isWalking = true;
      const stepFactor = Math.min(delta * 5.2, 0.35);
      this.currentX += distX * stepFactor;
      this.currentZ += distZ * stepFactor;
      this.group.position.x = this.currentX;
      this.group.position.z = this.currentZ;

      // Face walking direction
      const moveAngle = Math.atan2(distX, distZ);
      this.turnAngle = THREE.MathUtils.lerp(this.turnAngle, moveAngle, delta * 8);
      this.group.rotation.y = this.turnAngle;
    } else {
      this.isWalking = false;
      // Preserve current heading or smooth towards targetAngle
      this.turnAngle = THREE.MathUtils.lerp(this.turnAngle, this.targetAngle, delta * 4);
      this.group.rotation.y = this.turnAngle;
    }

    if (this.isWalking) {
      this.walkCycle += delta * 8.5;
      const legAngle = Math.sin(this.walkCycle) * 0.65;
      const armAngle = Math.sin(this.walkCycle) * 0.55;

      // Footstep audio timing (when leg crosses center)
      if (Math.abs(Math.sin(this.walkCycle)) > 0.95 && time - this.lastFootstep > 0.28) {
        soundEngine.playFootstep();
        this.lastFootstep = time;
      }

      this.leftLeg.rotation.x = legAngle;
      this.rightLeg.rotation.x = -legAngle;

      // Knee bend physics
      this.leftShinGroup.rotation.x = legAngle > 0 ? legAngle * 0.65 : 0;
      this.rightShinGroup.rotation.x = -legAngle > 0 ? -legAngle * 0.65 : 0;

      // Natural arm swing with slight forearm bend
      this.leftArm.rotation.x = -armAngle;
      this.rightArm.rotation.x = armAngle;
      this.leftForearm.rotation.x = Math.max(0, -armAngle * 0.4);
      this.rightForearm.rotation.x = Math.max(0, armAngle * 0.4);

      // Pelvis bounce and torso sway
      this.pelvis.position.y = 0.92 + Math.abs(Math.sin(this.walkCycle * 2)) * 0.05;
      this.torso.rotation.y = Math.sin(this.walkCycle) * 0.08;
      this.headGroup.rotation.y = -Math.sin(this.walkCycle) * 0.04;
    } else {
      // Idle breathing and relaxed agent posture
      const breath = Math.sin(time * 2.2) * 0.015;
      this.pelvis.position.y = 0.92 + breath;
      this.leftLeg.rotation.x = THREE.MathUtils.lerp(this.leftLeg.rotation.x, 0, delta * 6);
      this.rightLeg.rotation.x = THREE.MathUtils.lerp(this.rightLeg.rotation.x, 0, delta * 6);
      this.leftShinGroup.rotation.x = THREE.MathUtils.lerp(this.leftShinGroup.rotation.x, 0, delta * 6);
      this.rightShinGroup.rotation.x = THREE.MathUtils.lerp(this.rightShinGroup.rotation.x, 0, delta * 6);

      this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, 0.08, delta * 6);
      this.rightArm.rotation.x = THREE.MathUtils.lerp(this.rightArm.rotation.x, -0.08, delta * 6);
      this.leftForearm.rotation.x = THREE.MathUtils.lerp(this.leftForearm.rotation.x, 0.1, delta * 6);
      this.rightForearm.rotation.x = THREE.MathUtils.lerp(this.rightForearm.rotation.x, 0.1, delta * 6);

      this.torso.rotation.y = THREE.MathUtils.lerp(this.torso.rotation.y, 0, delta * 5);
      this.headGroup.rotation.x = Math.sin(time * 1.5) * 0.035;
    }
  }
}
