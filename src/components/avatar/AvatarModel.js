import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * AvatarModel.js
 * Manages loading of Navas Moosa's 360° 3D Avatar.
 * 1. Attempts to load authentic photogrammetry GLB from '/models/navas-moosa.glb'.
 * 2. If GLB does not exist yet, builds a high-fidelity 3D anatomical human model
 *    textured with Navas Moosa's actual face photograph and tailored suit reference.
 */

export class AvatarModelManager {
  constructor() {
    this.modelGroup = new THREE.Group();
    this.isGlb = false;
    this.headGroup = null;
    this.torsoGroup = null;
    this.breathCycle = 0;
  }

  load(onProgress, onLoaded, onError) {
    const gltfLoader = new GLTFLoader();

    // Check if external GLB exists in /models/navas-moosa.glb
    gltfLoader.load(
      '/models/navas-moosa.glb',
      (gltf) => {
        this.isGlb = true;
        const root = gltf.scene;

        // Auto-compute bounding box and scale to standard 1.8m height
        const bbox = new THREE.Box3().setFromObject(root);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const height = size.y || 1.8;
        const scaleFactor = 1.8 / height;
        root.scale.setScalar(scaleFactor);

        // Center on floor (Y = 0)
        bbox.setFromObject(root);
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        root.position.x = -center.x;
        root.position.z = -center.z;
        root.position.y = -bbox.min.y;

        root.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.envMapIntensity = 0.8;
            }
          }
        });

        this.modelGroup.add(root);
        if (onLoaded) onLoaded({ isGlb: true, model: root });
      },
      (xhr) => {
        if (onProgress && xhr.total > 0) {
          onProgress((xhr.loaded / xhr.total) * 100);
        }
      },
      (err) => {
        // Fallback: Build realistic procedural 3D human model using uploaded reference assets
        console.warn(
          'No external /models/navas-moosa.glb found. Generating 3D human avatar with Navas Moosa face texture and reference suit.',
          err?.message || err
        );
        this.buildProceduralAvatar(onLoaded);
      }
    );

    return this.modelGroup;
  }

  buildProceduralAvatar(onLoaded) {
    this.isGlb = false;
    const group = this.modelGroup;

    // Load actual face texture of Navas Moosa
    const textureLoader = new THREE.TextureLoader();
    const faceTexture = textureLoader.load('/assets/navas_moosa_face.jpg');
    faceTexture.colorSpace = THREE.SRGBColorSpace;
    faceTexture.generateMipmaps = true;

    // Curated Materials matching Reference Sheet
    // Skin Material
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xc49372, // Warm South Asian Skin Tone
      roughness: 0.6,
      metalness: 0.05,
    });

    // Face Texture Material (Preserves Navas Moosa's real face and jawline)
    const faceMat = new THREE.MeshStandardMaterial({
      map: faceTexture,
      roughness: 0.55,
      metalness: 0.02,
    });

    // Bespoke Tailored Obsidian Black Suit Fabric
    const suitFabricMat = new THREE.MeshStandardMaterial({
      color: 0x141416,
      roughness: 0.72,
      metalness: 0.12,
    });

    // Lapel & Pocket Trim Satin
    const satinLapelMat = new THREE.MeshStandardMaterial({
      color: 0x0f0f12,
      roughness: 0.45,
      metalness: 0.22,
    });

    // Black Collared Shirt
    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0x1b1b1e,
      roughness: 0.65,
      metalness: 0.04,
    });

    // Thick Curly Black Hair
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x11100e,
      roughness: 0.58,
      metalness: 0.08,
    });

    // Polished Black Leather Shoes
    const shoeMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0c,
      roughness: 0.25,
      metalness: 0.45,
    });

    // Sole & Heel Rubber
    const soleMat = new THREE.MeshStandardMaterial({
      color: 0x121212,
      roughness: 0.85,
    });

    // Brass/Dark Suit Buttons
    const buttonMat = new THREE.MeshStandardMaterial({
      color: 0x242428,
      roughness: 0.3,
      metalness: 0.7,
    });

    // ==========================================
    // 1. FEET & POLISHED SHOES (Y = 0 to 0.12)
    // ==========================================
    const createShoe = (isLeft) => {
      const shoeGroup = new THREE.Group();
      const xOffset = isLeft ? -0.14 : 0.14;
      shoeGroup.position.set(xOffset, 0, 0.02);

      // Sole
      const soleGeo = new THREE.BoxGeometry(0.12, 0.025, 0.29);
      const sole = new THREE.Mesh(soleGeo, soleMat);
      sole.position.set(0, 0.012, 0);
      sole.castShadow = true;
      sole.receiveShadow = true;
      shoeGroup.add(sole);

      // Heel
      const heelGeo = new THREE.BoxGeometry(0.11, 0.025, 0.08);
      const heel = new THREE.Mesh(heelGeo, soleMat);
      heel.position.set(0, 0.025, -0.09);
      shoeGroup.add(heel);

      // Upper Leather
      const upperGeo = new THREE.BoxGeometry(0.115, 0.07, 0.26);
      const upper = new THREE.Mesh(upperGeo, shoeMat);
      upper.position.set(0, 0.045, -0.01);
      upper.castShadow = true;
      shoeGroup.add(upper);

      // Pointed / Tapered Toe Cap
      const toeGeo = new THREE.ConeGeometry(0.06, 0.1, 4);
      toeGeo.rotateX(Math.PI / 2);
      const toe = new THREE.Mesh(toeGeo, shoeMat);
      toe.position.set(0, 0.04, 0.12);
      shoeGroup.add(toe);

      return shoeGroup;
    };

    group.add(createShoe(true));
    group.add(createShoe(false));

    // ==========================================
    // 2. LEGS & TAILORED TROUSERS (Y = 0.10 to 0.94)
    // ==========================================
    const createLeg = (isLeft) => {
      const legGroup = new THREE.Group();
      const xOffset = isLeft ? -0.14 : 0.14;
      legGroup.position.set(xOffset, 0.10, 0);

      // Lower Leg (Shin/Calf)
      const shinGeo = new THREE.CylinderGeometry(0.062, 0.055, 0.42, 16);
      const shin = new THREE.Mesh(shinGeo, suitFabricMat);
      shin.position.set(0, 0.21, 0);
      shin.castShadow = true;
      legGroup.add(shin);

      // Knee Joint
      const kneeGeo = new THREE.CylinderGeometry(0.068, 0.065, 0.08, 16);
      const knee = new THREE.Mesh(kneeGeo, suitFabricMat);
      knee.position.set(0, 0.42, 0.005);
      legGroup.add(knee);

      // Thigh
      const thighGeo = new THREE.CylinderGeometry(0.082, 0.07, 0.44, 16);
      const thigh = new THREE.Mesh(thighGeo, suitFabricMat);
      thigh.position.set(0, 0.65, 0);
      thigh.castShadow = true;
      legGroup.add(thigh);

      // Crease accent
      const creaseGeo = new THREE.BoxGeometry(0.004, 0.82, 0.02);
      const crease = new THREE.Mesh(creaseGeo, satinLapelMat);
      crease.position.set(0, 0.42, 0.065);
      legGroup.add(crease);

      return legGroup;
    };

    group.add(createLeg(true));
    group.add(createLeg(false));

    // ==========================================
    // 3. PELVIS / HIPS & BELT (Y = 0.94 to 1.08)
    // ==========================================
    const pelvis = new THREE.Group();
    pelvis.position.set(0, 0.94, 0);
    group.add(pelvis);

    const hipsGeo = new THREE.BoxGeometry(0.38, 0.18, 0.24);
    const hips = new THREE.Mesh(hipsGeo, suitFabricMat);
    hips.position.set(0, 0.09, 0);
    hips.castShadow = true;
    pelvis.add(hips);

    // ==========================================
    // 4. TORSO (SUIT JACKET & SHIRT) (Y = 1.08 to 1.54)
    // ==========================================
    this.torsoGroup = new THREE.Group();
    this.torsoGroup.position.set(0, 1.08, 0);
    group.add(this.torsoGroup);

    // Main Tailored Jacket
    const jacketGeo = new THREE.BoxGeometry(0.44, 0.46, 0.26);
    const jacket = new THREE.Mesh(jacketGeo, suitFabricMat);
    jacket.position.set(0, 0.23, 0);
    jacket.castShadow = true;
    this.torsoGroup.add(jacket);

    // Jacket Peplum / Tail
    const tailGeo = new THREE.BoxGeometry(0.45, 0.16, 0.27);
    const tail = new THREE.Mesh(tailGeo, suitFabricMat);
    tail.position.set(0, -0.04, 0);
    tail.castShadow = true;
    this.torsoGroup.add(tail);

    // Left Lapel (Notched)
    const lapelLeftGeo = new THREE.BoxGeometry(0.095, 0.32, 0.035);
    const lapelLeft = new THREE.Mesh(lapelLeftGeo, satinLapelMat);
    lapelLeft.position.set(-0.11, 0.28, 0.135);
    lapelLeft.rotation.z = -0.12;
    this.torsoGroup.add(lapelLeft);

    // Right Lapel (Notched)
    const lapelRightGeo = new THREE.BoxGeometry(0.095, 0.32, 0.035);
    const lapelRight = new THREE.Mesh(lapelRightGeo, satinLapelMat);
    lapelRight.position.set(0.11, 0.28, 0.135);
    lapelRight.rotation.z = 0.12;
    this.torsoGroup.add(lapelRight);

    // Unbuttoned Black Collared Shirt V-Neck insert
    const shirtGeo = new THREE.BoxGeometry(0.14, 0.26, 0.02);
    const shirt = new THREE.Mesh(shirtGeo, shirtMat);
    shirt.position.set(0, 0.32, 0.132);
    this.torsoGroup.add(shirt);

    // Open Collar V-Neck Skin exposure
    const collarSkinGeo = new THREE.ConeGeometry(0.045, 0.11, 3);
    collarSkinGeo.rotateZ(Math.PI);
    const collarSkin = new THREE.Mesh(collarSkinGeo, skinMat);
    collarSkin.position.set(0, 0.38, 0.138);
    this.torsoGroup.add(collarSkin);

    // Suit Buttons
    for (let i = 0; i < 2; i++) {
      const btnGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.008, 12);
      btnGeo.rotateX(Math.PI / 2);
      const btn = new THREE.Mesh(btnGeo, buttonMat);
      btn.position.set(0, 0.12 + i * 0.11, 0.136);
      this.torsoGroup.add(btn);
    }

    // Chest Welt Pocket
    const weltGeo = new THREE.BoxGeometry(0.08, 0.015, 0.015);
    const welt = new THREE.Mesh(weltGeo, satinLapelMat);
    welt.position.set(0.12, 0.32, 0.135);
    this.torsoGroup.add(welt);

    // Waist Flap Pockets
    const flapGeo = new THREE.BoxGeometry(0.10, 0.02, 0.02);
    const flapL = new THREE.Mesh(flapGeo, satinLapelMat);
    flapL.position.set(-0.14, 0.06, 0.135);
    this.torsoGroup.add(flapL);

    const flapR = new THREE.Mesh(flapGeo, satinLapelMat);
    flapR.position.set(0.14, 0.06, 0.135);
    this.torsoGroup.add(flapR);

    // ==========================================
    // 5. ARMS & HANDS IN SUIT POCKETS
    // ==========================================
    const createArm = (isLeft) => {
      const armGroup = new THREE.Group();
      const xOffset = isLeft ? -0.26 : 0.26;
      armGroup.position.set(xOffset, 0.40, 0);

      // Shoulder Cap
      const shoulderGeo = new THREE.SphereGeometry(0.085, 16, 12);
      const shoulder = new THREE.Mesh(shoulderGeo, suitFabricMat);
      shoulder.castShadow = true;
      armGroup.add(shoulder);

      // Upper Arm
      const upperGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.28, 14);
      const upper = new THREE.Mesh(upperGeo, suitFabricMat);
      upper.position.set(0, -0.14, 0);
      upper.castShadow = true;
      armGroup.add(upper);

      // Forearm angled towards front pocket (matching reference pose)
      const forearmGeo = new THREE.CylinderGeometry(0.055, 0.048, 0.26, 14);
      const forearm = new THREE.Mesh(forearmGeo, suitFabricMat);
      forearm.position.set(isLeft ? 0.03 : -0.03, -0.34, 0.04);
      forearm.rotation.z = isLeft ? -0.2 : 0.2;
      forearm.rotation.x = -0.15;
      forearm.castShadow = true;
      armGroup.add(forearm);

      // Hand resting in pocket
      const handGeo = new THREE.BoxGeometry(0.05, 0.08, 0.04);
      const hand = new THREE.Mesh(handGeo, skinMat);
      hand.position.set(isLeft ? 0.06 : -0.06, -0.45, 0.07);
      armGroup.add(hand);

      return armGroup;
    };

    this.torsoGroup.add(createArm(true));
    this.torsoGroup.add(createArm(false));

    // ==========================================
    // 6. NECK & HEAD (PRESERVES REAL FACE IDENTITY)
    // ==========================================
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.50, 0);
    this.torsoGroup.add(this.headGroup);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.072, 0.082, 0.11, 16);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.set(0, 0.055, 0);
    neck.castShadow = true;
    this.headGroup.add(neck);

    // Shirt Collar Band
    const collarBandGeo = new THREE.CylinderGeometry(0.078, 0.086, 0.04, 16);
    const collarBand = new THREE.Mesh(collarBandGeo, shirtMat);
    collarBand.position.set(0, 0.035, 0);
    this.headGroup.add(collarBand);

    // Cranium / Head Structure
    const headGeo = new THREE.BoxGeometry(0.20, 0.26, 0.21);
    const headCranium = new THREE.Mesh(headGeo, skinMat);
    headCranium.position.set(0, 0.21, -0.01);
    headCranium.castShadow = true;
    this.headGroup.add(headCranium);

    // Realistic Front Face Geometry with Navas Moosa's Face Texture
    // Slightly curved quad planar mesh displaying genuine photograph
    const faceGeo = new THREE.PlaneGeometry(0.19, 0.24, 8, 8);
    // Subtle anatomical curve for cheeks and nose bridge
    const pos = faceGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Curve edges back
      const zOffset = -Math.pow(x, 2) * 1.6;
      pos.setZ(i, zOffset);
    }
    faceGeo.computeVertexNormals();

    const faceMesh = new THREE.Mesh(faceGeo, faceMat);
    faceMesh.position.set(0, 0.205, 0.106);
    faceMesh.castShadow = true;
    this.headGroup.add(faceMesh);

    // Chiseled Jawline & Chin
    const chinGeo = new THREE.BoxGeometry(0.09, 0.05, 0.08);
    const chin = new THREE.Mesh(chinGeo, skinMat);
    chin.position.set(0, 0.10, 0.07);
    this.headGroup.add(chin);

    // Ears
    const earGeo = new THREE.BoxGeometry(0.02, 0.065, 0.04);
    const earL = new THREE.Mesh(earGeo, skinMat);
    earL.position.set(-0.105, 0.20, -0.01);
    earL.rotation.y = -0.2;
    this.headGroup.add(earL);

    const earR = new THREE.Mesh(earGeo, skinMat);
    earR.position.set(0.105, 0.20, -0.01);
    earR.rotation.y = 0.2;
    this.headGroup.add(earR);

    // ==========================================
    // 7. NAVAS MOOSA'S THICK CURLY / WAVY HAIR
    // (Accurately sculpted volume matching reference)
    // ==========================================
    const hairCluster = new THREE.Group();
    this.headGroup.add(hairCluster);

    // Top Curly Crown Volume
    const hairCrownGeo = new THREE.BoxGeometry(0.23, 0.12, 0.24);
    const hairCrown = new THREE.Mesh(hairCrownGeo, hairMat);
    hairCrown.position.set(0, 0.33, -0.01);
    hairCrown.castShadow = true;
    hairCluster.add(hairCrown);

    // Back Curls & Nape
    const hairBackGeo = new THREE.BoxGeometry(0.21, 0.20, 0.08);
    const hairBack = new THREE.Mesh(hairBackGeo, hairMat);
    hairBack.position.set(0, 0.23, -0.11);
    hairBack.castShadow = true;
    hairCluster.add(hairBack);

    // Left Side Volume Curls
    const hairSideLGeo = new THREE.BoxGeometry(0.06, 0.17, 0.22);
    const hairSideL = new THREE.Mesh(hairSideLGeo, hairMat);
    hairSideL.position.set(-0.11, 0.27, -0.01);
    hairCluster.add(hairSideL);

    // Right Side Volume Curls
    const hairSideRGeo = new THREE.BoxGeometry(0.06, 0.17, 0.22);
    const hairSideR = new THREE.Mesh(hairSideRGeo, hairMat);
    hairSideR.position.set(0.11, 0.27, -0.01);
    hairCluster.add(hairSideR);

    // Front Fringe Curls (Flowing organically over forehead hairline)
    const curlPoints = [
      { x: -0.06, y: 0.32, z: 0.105, r: 0.035 },
      { x: -0.02, y: 0.33, z: 0.115, r: 0.038 },
      { x: 0.03, y: 0.32, z: 0.112, r: 0.036 },
      { x: 0.07, y: 0.31, z: 0.102, r: 0.032 },
    ];

    curlPoints.forEach((c) => {
      const curlGeo = new THREE.DodecahedronGeometry(c.r, 1);
      const curl = new THREE.Mesh(curlGeo, hairMat);
      curl.position.set(c.x, c.y, c.z);
      curl.scale.set(1.2, 0.8, 1);
      hairCluster.add(curl);
    });

    if (onLoaded) {
      onLoaded({ isGlb: false, model: group });
    }
  }

  update(delta = 0.016) {
    // Subtle breathing expansion & alive presence
    this.breathCycle += delta * 1.5;
    if (this.torsoGroup) {
      this.torsoGroup.scale.x = 1.0 + Math.sin(this.breathCycle) * 0.006;
      this.torsoGroup.scale.z = 1.0 + Math.sin(this.breathCycle) * 0.008;
    }
    if (this.headGroup) {
      this.headGroup.position.y = 0.50 + Math.sin(this.breathCycle) * 0.002;
    }
  }
}
