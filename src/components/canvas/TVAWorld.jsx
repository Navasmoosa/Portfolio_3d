import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TVACharacter } from './TVACharacter';
import { MissMinutes } from './MissMinutes';
import { STATIONS, PERSONAL_INFO, APPS_DATA } from '../../data/portfolioData';

export default function TVAWorld({
  currentStationIndex,
  onStationChange,
  onAppSelect,
  isTalking,
  onInspectObject,
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e0b08);
    scene.fog = new THREE.FogExp2(0x0e0b08, 0.022);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      120
    );
    camera.position.set(0, 1.8, 12);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.appendChild(renderer.domElement);

    // 2. Lighting (TVA Warm Amber & Cinematic Bronze)
    const ambientLight = new THREE.AmbientLight(0xffdfb0, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff0d0, 1.3);
    dirLight.position.set(5, 12, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    // 3. Characters
    const lokiCharacter = new TVACharacter();
    scene.add(lokiCharacter.group);

    const missMinutes = new MissMinutes();
    scene.add(missMinutes.group);

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();

    // 4. Build Grand TVA Brutalist Architecture
    const corridorGroup = new THREE.Group();
    scene.add(corridorGroup);

    // Floor (Dark Polished TVA Marble with Specular Sheen)
    const floorGeo = new THREE.PlaneGeometry(16, 130);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x161311,
      roughness: 0.18,
      metalness: 0.35,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(0, 0, -28);
    floorMesh.receiveShadow = true;
    corridorGroup.add(floorMesh);

    // Gold Inlay Floor Stripes
    const stripeGeo = new THREE.PlaneGeometry(0.12, 130);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.2,
      metalness: 0.9,
    });
    const stripeLeft = new THREE.Mesh(stripeGeo, goldMat);
    stripeLeft.rotation.x = -Math.PI / 2;
    stripeLeft.position.set(-2.4, 0.005, -28);
    corridorGroup.add(stripeLeft);

    const stripeRight = new THREE.Mesh(stripeGeo, goldMat);
    stripeRight.rotation.x = -Math.PI / 2;
    stripeRight.position.set(2.4, 0.005, -28);
    corridorGroup.add(stripeRight);

    // Ceiling
    const ceilingGeo = new THREE.PlaneGeometry(16, 130);
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x1a1614,
      roughness: 0.8,
    });
    const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceilingMesh.rotation.x = Math.PI / 2;
    ceilingMesh.position.set(0, 5.2, -28);
    corridorGroup.add(ceilingMesh);

    // Brutalist Archway Columns (Repeating every 6 units down Z)
    const archMat = new THREE.MeshStandardMaterial({
      color: 0x2e2722,
      roughness: 0.85,
      metalness: 0.1,
    });
    const brassTrimMat = new THREE.MeshStandardMaterial({
      color: 0xc9933b,
      roughness: 0.3,
      metalness: 0.8,
    });

    const numArches = 18;
    for (let i = 0; i < numArches; i++) {
      const z = 14 - i * 6;
      const arch = new THREE.Group();
      arch.position.z = z;

      // Left Pillar
      const pillarGeo = new THREE.BoxGeometry(0.9, 5.2, 0.9);
      const pillarL = new THREE.Mesh(pillarGeo, archMat);
      pillarL.position.set(-4.5, 2.6, 0);
      pillarL.castShadow = true;
      pillarL.receiveShadow = true;
      arch.add(pillarL);

      // Right Pillar
      const pillarR = new THREE.Mesh(pillarGeo, archMat);
      pillarR.position.set(4.5, 2.6, 0);
      pillarR.castShadow = true;
      pillarR.receiveShadow = true;
      arch.add(pillarR);

      // Top Beam / Arch Rib
      const beamGeo = new THREE.BoxGeometry(9.9, 0.6, 0.9);
      const beam = new THREE.Mesh(beamGeo, archMat);
      beam.position.set(0, 4.9, 0);
      arch.add(beam);

      // Brass Trims
      const trimGeo = new THREE.BoxGeometry(10.1, 0.1, 0.95);
      const trim = new THREE.Mesh(trimGeo, brassTrimMat);
      trim.position.set(0, 4.55, 0);
      arch.add(trim);

      // Warm Sconce Light on every other arch
      if (i % 2 === 0) {
        const sconceGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.3, 12);
        const sconceMat = new THREE.MeshBasicMaterial({ color: 0xffaa33 });
        const sconceL = new THREE.Mesh(sconceGeo, sconceMat);
        sconceL.position.set(-3.95, 2.4, 0);
        arch.add(sconceL);

        const sconceR = new THREE.Mesh(sconceGeo, sconceMat);
        sconceR.position.set(3.95, 2.4, 0);
        arch.add(sconceR);

        const pLight = new THREE.PointLight(0xff9922, 1.2, 8);
        pLight.position.set(0, 2.6, z);
        scene.add(pLight);
      }

      corridorGroup.add(arch);
    }

    // Outer Corridor Walls
    const wallGeo = new THREE.PlaneGeometry(130, 5.5);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x1f1a16,
      roughness: 0.9,
    });
    const wallLeft = new THREE.Mesh(wallGeo, wallMat);
    wallLeft.rotation.y = Math.PI / 2;
    wallLeft.position.set(-5.5, 2.6, -28);
    corridorGroup.add(wallLeft);

    const wallRight = new THREE.Mesh(wallGeo, wallMat);
    wallRight.rotation.y = -Math.PI / 2;
    wallRight.position.set(5.5, 2.6, -28);
    corridorGroup.add(wallRight);

    // 5. Build Station Props & Holograms

    // ========================================================
    // SCENE 2: NAVAS MOOSA 3D DISPLAY ON LEFT SIDE (Z = -2)
    // ========================================================
    const navasShowcaseGroup = new THREE.Group();
    navasShowcaseGroup.position.set(-2.5, 0, -2);

    // Brutalist Circular Pedestal Base
    const pedestalBaseGeo = new THREE.CylinderGeometry(1.2, 1.35, 0.45, 32);
    const pedestalBaseMat = new THREE.MeshStandardMaterial({
      color: 0x241a12,
      roughness: 0.3,
      metalness: 0.6,
    });
    const pedestalBase = new THREE.Mesh(pedestalBaseGeo, pedestalBaseMat);
    pedestalBase.position.y = 0.225;
    pedestalBase.castShadow = true;
    pedestalBase.receiveShadow = true;
    navasShowcaseGroup.add(pedestalBase);

    // Golden Inlay Ring on Pedestal
    const ringInlayGeo = new THREE.TorusGeometry(1.15, 0.025, 16, 48);
    const ringInlay = new THREE.Mesh(ringInlayGeo, goldMat);
    ringInlay.rotation.x = Math.PI / 2;
    ringInlay.position.y = 0.46;
    navasShowcaseGroup.add(ringInlay);

    // Holographic Circular Projector Emitter Core
    const emitterCoreGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.05, 32);
    const emitterCoreMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
    });
    const emitterCore = new THREE.Mesh(emitterCoreGeo, emitterCoreMat);
    emitterCore.position.y = 0.465;
    navasShowcaseGroup.add(emitterCore);

    // Floating 3D Holographic Display Board with Navas Moosa's 3D image
    const navasTexture = textureLoader.load('/assets/navas_moosa_3d.jpg');
    navasTexture.colorSpace = THREE.SRGBColorSpace;

    // Display Screen Mesh (16:9 ratio, angled slightly towards camera)
    const holoScreenGeo = new THREE.PlaneGeometry(2.2, 1.45);
    const holoScreenMat = new THREE.MeshStandardMaterial({
      map: navasTexture,
      roughness: 0.2,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const holoScreen = new THREE.Mesh(holoScreenGeo, holoScreenMat);
    holoScreen.position.set(0, 1.75, 0);
    holoScreen.rotation.y = Math.PI / 5; // Angled facing the corridor center
    holoScreen.castShadow = true;
    navasShowcaseGroup.add(holoScreen);

    // Golden TVA Bezel Frame around Navas 3D Hologram
    const frameGeo = new THREE.BoxGeometry(2.26, 1.51, 0.04);
    const frameMesh = new THREE.Mesh(frameGeo, brassTrimMat);
    frameMesh.position.set(0, 1.75, -0.015);
    frameMesh.rotation.y = Math.PI / 5;
    navasShowcaseGroup.add(frameMesh);

    // TVA Hologram Label Badge under the 3D Image
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 512;
    labelCanvas.height = 128;
    const lCtx = labelCanvas.getContext('2d');
    lCtx.fillStyle = '#1c150e';
    lCtx.fillRect(0, 0, 512, 128);
    lCtx.strokeStyle = '#d4af37';
    lCtx.lineWidth = 6;
    lCtx.strokeRect(4, 4, 504, 120);

    lCtx.fillStyle = '#ffd868';
    lCtx.font = 'bold 30px "Cinzel", "Courier New", serif';
    lCtx.textAlign = 'center';
    lCtx.fillText('NAVAS MOOSA K P', 256, 45);

    lCtx.fillStyle = '#38bdf8';
    lCtx.font = 'bold 18px monospace';
    lCtx.fillText('MASTER OF TIMELINE // WEB & SOFTWARE DEV', 256, 80);

    lCtx.fillStyle = '#94a3b8';
    lCtx.font = '14px monospace';
    lCtx.fillText('ALPHA VARIANT • CALICUT UNIVERSITY (MCA/BCA)', 256, 108);

    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    const labelGeo = new THREE.PlaneGeometry(1.6, 0.4);
    const labelMesh = new THREE.Mesh(labelGeo, new THREE.MeshBasicMaterial({ map: labelTexture, side: THREE.DoubleSide }));
    labelMesh.position.set(0, 0.85, 0.1);
    labelMesh.rotation.y = Math.PI / 5;
    navasShowcaseGroup.add(labelMesh);

    // Hologram Spotlight & Amber Projector Beam
    const navasSpotlight = new THREE.SpotLight(0xffaa22, 2.8, 8, Math.PI / 4, 0.5);
    navasSpotlight.position.set(0, 4.0, 1.5);
    navasSpotlight.target = holoScreen;
    navasShowcaseGroup.add(navasSpotlight);

    // Holographic Rotating Ring around Pedestal
    const holoRingGeo = new THREE.RingGeometry(1.3, 1.45, 32);
    const holoRingMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
    const holoRing = new THREE.Mesh(holoRingGeo, holoRingMat);
    holoRing.rotation.x = -Math.PI / 2;
    holoRing.position.y = 0.5;
    navasShowcaseGroup.add(holoRing);

    scene.add(navasShowcaseGroup);

    // SCENE 2 RIGHT SIDE: CRT Console Briefing Desk (at Z = -2, X = 1.6)
    const deskGroup = new THREE.Group();
    deskGroup.position.set(1.6, 0, -2);

    const deskGeo = new THREE.BoxGeometry(1.8, 0.8, 1.0);
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.7 });
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.position.y = 0.4;
    desk.castShadow = true;
    deskGroup.add(desk);

    // CRT Monitor
    const crtGeo = new THREE.BoxGeometry(0.8, 0.7, 0.6);
    const crtMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.6 });
    const crt = new THREE.Mesh(crtGeo, crtMat);
    crt.position.set(0, 1.05, 0);
    crt.rotation.y = -Math.PI / 6;
    deskGroup.add(crt);

    // Animated CRT phosphor canvas
    const crtCanvas = document.createElement('canvas');
    crtCanvas.width = 256;
    crtCanvas.height = 256;
    const crtCtx = crtCanvas.getContext('2d');
    const crtTexture = new THREE.CanvasTexture(crtCanvas);

    function updateCRT(time) {
      crtCtx.fillStyle = '#051b11';
      crtCtx.fillRect(0, 0, 256, 256);

      crtCtx.strokeStyle = '#34d399';
      crtCtx.lineWidth = 3;
      crtCtx.beginPath();
      for (let x = 0; x < 256; x += 4) {
        const y = 128 + Math.sin((x + time * 60) * 0.05) * 35 + Math.sin(x * 0.1) * 15;
        if (x === 0) crtCtx.moveTo(x, y);
        else crtCtx.lineTo(x, y);
      }
      crtCtx.stroke();

      crtCtx.fillStyle = '#34d399';
      crtCtx.font = 'bold 15px monospace';
      crtCtx.fillText('STATUS: PRUNING 0.0%', 15, 35);
      crtCtx.fillText('MASTER: NAVAS MOOSA', 15, 60);
      crtCtx.fillText('BRANCH: EARTH-616 KL', 15, 85);
      crtCtx.fillText('TIMELINE: SACRED & STABLE', 15, 230);
      crtTexture.needsUpdate = true;
    }

    const crtScreenGeo = new THREE.PlaneGeometry(0.65, 0.55);
    const crtScreenMat = new THREE.MeshBasicMaterial({ map: crtTexture });
    const crtScreen = new THREE.Mesh(crtScreenGeo, crtScreenMat);
    crtScreen.position.set(0, 1.05, 0.31);
    crtScreen.rotation.y = -Math.PI / 6;
    deskGroup.add(crtScreen);

    scene.add(deskGroup);

    // ========================================================
    // SCENE 3: EXPERIENCE FIELD WORK STATION (Z = -12)
    // ========================================================
    const expStationGroup = new THREE.Group();
    expStationGroup.position.set(-1.8, 0, -12);

    const expPodGeo = new THREE.CylinderGeometry(0.8, 0.9, 0.9, 24);
    const expPodMat = new THREE.MeshStandardMaterial({ color: 0x2b221a, roughness: 0.4, metalness: 0.6 });
    const expPod = new THREE.Mesh(expPodGeo, expPodMat);
    expPod.position.y = 0.45;
    expStationGroup.add(expPod);

    // Experience Holographic Floating Ring
    const expRingGeo = new THREE.TorusGeometry(0.95, 0.03, 16, 48);
    const expRing = new THREE.Mesh(expRingGeo, goldMat);
    expRing.rotation.x = Math.PI / 2;
    expRing.position.y = 1.2;
    expStationGroup.add(expRing);

    // Experience Holographic Panel
    const expCanvas = document.createElement('canvas');
    expCanvas.width = 512;
    expCanvas.height = 340;
    const expCtx = expCanvas.getContext('2d');
    expCtx.fillStyle = '#0f172a';
    expCtx.fillRect(0, 0, 512, 340);
    expCtx.strokeStyle = '#e5b342';
    expCtx.lineWidth = 6;
    expCtx.strokeRect(6, 6, 500, 328);

    expCtx.fillStyle = '#ffd868';
    expCtx.font = 'bold 26px "Cinzel", serif';
    expCtx.fillText('FIELD WORK LOG // EXPERIENCE', 28, 50);

    expCtx.fillStyle = '#38bdf8';
    expCtx.font = 'bold 20px sans-serif';
    expCtx.fillText('• Software Developer & Trainee', 28, 95);
    expCtx.fillStyle = '#cbd5e1';
    expCtx.font = '16px monospace';
    expCtx.fillText('  React.js, Full-Stack Architecture, REST APIs', 28, 125);

    expCtx.fillStyle = '#34d399';
    expCtx.font = 'bold 20px sans-serif';
    expCtx.fillText('• Smart System Engineering', 28, 175);
    expCtx.fillStyle = '#cbd5e1';
    expCtx.font = '16px monospace';
    expCtx.fillText('  Automated Booking & Facility Workflow Systems', 28, 205);

    expCtx.fillStyle = '#f59e0b';
    expCtx.font = 'bold 20px sans-serif';
    expCtx.fillText('• Industrial Exposure', 28, 255);
    expCtx.fillStyle = '#cbd5e1';
    expCtx.font = '16px monospace';
    expCtx.fillText('  Cyberpark Calicut Techne Industry Visit', 28, 285);

    const expTexture = new THREE.CanvasTexture(expCanvas);
    const expScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 1.05),
      new THREE.MeshBasicMaterial({ map: expTexture, side: THREE.DoubleSide })
    );
    expScreen.position.set(0, 1.8, 0);
    expScreen.rotation.y = Math.PI / 4;
    expStationGroup.add(expScreen);

    scene.add(expStationGroup);

    // ========================================================
    // SCENE 4: PROJECTS ARCHIVE (Z = -24)
    // Disaster Management System Table + 3D Holographic Phones
    // ========================================================
    // Helper: Create Phone Screen Canvas Texture
    function createPhoneTexture(title, subtitle, badgeText, colorHex) {
      const cvs = document.createElement('canvas');
      cvs.width = 512;
      cvs.height = 1024;
      const c = cvs.getContext('2d');

      c.fillStyle = '#0b1320';
      c.fillRect(0, 0, 512, 1024);

      const grad = c.createLinearGradient(0, 0, 512, 160);
      grad.addColorStop(0, colorHex);
      grad.addColorStop(1, '#0f172a');
      c.fillStyle = grad;
      c.fillRect(0, 0, 512, 160);

      c.fillStyle = '#ffffff';
      c.font = 'bold 24px monospace';
      c.fillText('TVA 5G', 30, 48);
      c.fillText('10:10', 220, 48);
      c.fillText('100%', 420, 48);

      c.font = 'bold 44px sans-serif';
      c.fillText(title, 36, 120);

      c.font = '22px sans-serif';
      c.fillStyle = '#94a3b8';
      c.fillText(subtitle, 36, 195);

      const cardItems = ['Live Intake', 'Management Hub', 'Technician Dispatch', 'Live Analytics'];
      cardItems.forEach((item, idx) => {
        const y = 230 + idx * 140;
        c.fillStyle = '#1e293b';
        c.beginPath();
        c.roundRect(30, y, 452, 110, 16);
        c.fill();

        c.strokeStyle = colorHex;
        c.lineWidth = 2;
        c.stroke();

        c.fillStyle = colorHex;
        c.font = 'bold 26px sans-serif';
        c.fillText(`#0${idx + 1}  ${item}`, 56, y + 45);

        c.fillStyle = '#cbd5e1';
        c.font = '20px sans-serif';
        c.fillText('Sacred Timeline Certified Engine', 56, y + 80);
      });

      c.fillStyle = colorHex;
      c.beginPath();
      c.roundRect(40, 890, 432, 70, 35);
      c.fill();

      c.fillStyle = '#ffffff';
      c.font = 'bold 26px sans-serif';
      c.textAlign = 'center';
      c.fillText('TAP TO INSPECT APP', 256, 935);

      const tex = new THREE.CanvasTexture(cvs);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }

    function createPhoneMesh(texture, colorHex) {
      const phoneGroup = new THREE.Group();
      const bodyGeo = new THREE.BoxGeometry(1.05, 2.1, 0.08);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x111827,
        roughness: 0.2,
        metalness: 0.8,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      phoneGroup.add(body);

      const screenGeo = new THREE.PlaneGeometry(0.98, 1.98);
      const screenMat = new THREE.MeshBasicMaterial({ map: texture });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.z = 0.045;
      phoneGroup.add(screen);

      const ringGeo = new THREE.TorusGeometry(1.2, 0.02, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(colorHex) });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -1.05;
      phoneGroup.add(ring);

      return phoneGroup;
    }

    // CampusFix Phone (Left side of Scene 4)
    const campusTexture = createPhoneTexture('CampusFix', 'A Safer Campus Together', 'CASE #04', '#38bdf8');
    const campusPhone = createPhoneMesh(campusTexture, '#38bdf8');
    campusPhone.position.set(-1.8, 1.8, -24);
    campusPhone.rotation.y = Math.PI / 5;
    scene.add(campusPhone);

    // PocketTask Phone (Right side of Scene 4)
    const pocketTexture = createPhoneTexture('PocketTask', 'Instant Tasks & Variant QA', 'CASE #05', '#a855f7');
    const pocketPhone = createPhoneMesh(pocketTexture, '#a855f7');
    pocketPhone.position.set(1.8, 1.8, -24);
    pocketPhone.rotation.y = -Math.PI / 5;
    scene.add(pocketPhone);

    // Center Archive Table (Disaster Management System Diorama)
    const archiveTableGroup = new THREE.Group();
    archiveTableGroup.position.set(0, 0, -25.5);

    const tableBase = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.85, 1.3),
      new THREE.MeshStandardMaterial({ color: 0x36271c, roughness: 0.7 })
    );
    tableBase.position.y = 0.425;
    archiveTableGroup.add(tableBase);

    // Glass Display Cube
    const glassCube = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 0.7, 0.9),
      new THREE.MeshPhysicalMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.35,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.8,
      })
    );
    glassCube.position.set(0, 1.2, 0);
    archiveTableGroup.add(glassCube);

    // Holographic mini map beacon inside glass
    const beacon = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.24),
      new THREE.MeshBasicMaterial({ color: 0xef4444, wireframe: true })
    );
    beacon.position.set(0, 1.2, 0);
    archiveTableGroup.add(beacon);

    scene.add(archiveTableGroup);

    // ========================================================
    // SCENE 5: QUALIFICATIONS & TECHNICAL SKILLS (Z = -36)
    // Monumental Chrono-Monitor (Gears & DREAM. BUILD. GROW.)
    // ========================================================
    const chronoGroup = new THREE.Group();
    chronoGroup.position.set(0, 2.7, -36);

    const gearMat1 = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.25 });
    const gearMat2 = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.9, roughness: 0.2 });

    const outerRing = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.08, 16, 64), gearMat1);
    chronoGroup.add(outerRing);

    const innerRing = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.06, 16, 48), gearMat2);
    chronoGroup.add(innerRing);

    const coreRing = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.05, 16, 32), gearMat1);
    chronoGroup.add(coreRing);

    for (let i = 0; i < 24; i++) {
      const angle = (i * Math.PI * 2) / 24;
      const peg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, 0.06), gearMat1);
      peg.position.set(Math.cos(angle) * 2.2, Math.sin(angle) * 2.2, 0);
      peg.rotation.z = angle;
      chronoGroup.add(peg);
    }

    const chronoSignCanvas = document.createElement('canvas');
    chronoSignCanvas.width = 512;
    chronoSignCanvas.height = 512;
    const csCtx = chronoSignCanvas.getContext('2d');
    csCtx.fillStyle = 'rgba(26, 20, 16, 0.95)';
    csCtx.beginPath();
    csCtx.arc(256, 256, 240, 0, Math.PI * 2);
    csCtx.fill();
    csCtx.strokeStyle = '#e5b342';
    csCtx.lineWidth = 12;
    csCtx.stroke();

    csCtx.fillStyle = '#e5b342';
    csCtx.font = 'bold 36px "Cinzel", serif';
    csCtx.textAlign = 'center';
    csCtx.fillText('DREAM.', 256, 175);
    csCtx.fillText('BUILD.', 256, 245);
    csCtx.fillText('GROW.', 256, 315);

    csCtx.fillStyle = '#38bdf8';
    csCtx.font = 'bold 18px monospace';
    csCtx.fillText('MCA • BCA • REACT • NODE • PYTHON', 256, 375);

    const chronoSignTexture = new THREE.CanvasTexture(chronoSignCanvas);
    const chronoCenter = new THREE.Mesh(
      new THREE.CircleGeometry(0.85, 32),
      new THREE.MeshBasicMaterial({ map: chronoSignTexture, side: THREE.DoubleSide })
    );
    chronoCenter.position.z = 0.02;
    chronoGroup.add(chronoCenter);

    scene.add(chronoGroup);

    // ========================================================
    // SCENE 6: LET'S WORK TOGETHER - CONTACT (Z = -48)
    // Sacred Timeline Loom Strands & Floating Contact Nexus
    // ========================================================
    const nexusGroup = new THREE.Group();
    nexusGroup.position.set(0, 2.5, -48);

    const numStrands = 32;
    for (let i = 0; i < numStrands; i++) {
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-4.5 + (i / numStrands) * 9, -2.2, -6),
        new THREE.Vector3(Math.sin(i) * 2.2, 1.2 + Math.cos(i) * 1.6, 0),
        new THREE.Vector3(-4.5 + (i / numStrands) * 9, -2.2, 6)
      );
      const points = curve.getPoints(24);
      const strandGeo = new THREE.BufferGeometry().setFromPoints(points);
      const strandMat = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0xffaa00 : 0x38bdf8,
        transparent: true,
        opacity: 0.65,
      });
      const strandLine = new THREE.Line(strandGeo, strandMat);
      nexusGroup.add(strandLine);
    }
    scene.add(nexusGroup);

    // Floating Hologram Nexus Core
    const nexusCoreGeo = new THREE.IcosahedronGeometry(0.4, 1);
    const nexusCoreMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
    const nexusCore = new THREE.Mesh(nexusCoreGeo, nexusCoreMat);
    nexusCore.position.set(0, 2.2, -48);
    scene.add(nexusCore);

    // ========================================================
    // SCENE 7: THANK YOU - THE END OF TIME (Z = -58)
    // Golden Timedoor Exit Portal
    // ========================================================
    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, 2.2, -58);

    const portalFrameGeo = new THREE.BoxGeometry(2.6, 4.0, 0.25);
    const portalFrameMat = new THREE.MeshStandardMaterial({
      color: 0x1a1614,
      metalness: 0.9,
      roughness: 0.2,
    });
    const portalFrame = new THREE.Mesh(portalFrameGeo, portalFrameMat);
    portalGroup.add(portalFrame);

    // Swirling amber energy door
    const portalCoreGeo = new THREE.PlaneGeometry(2.1, 3.6);
    const portalCoreMat = new THREE.MeshBasicMaterial({
      color: 0xff9900,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide,
    });
    const portalCore = new THREE.Mesh(portalCoreGeo, portalCoreMat);
    portalGroup.add(portalCore);

    const portalLight = new THREE.PointLight(0xffaa00, 3.5, 12);
    portalGroup.add(portalLight);
    scene.add(portalGroup);

    // 6. Camera Position Interpolation
    let targetCamera = { x: 0, y: 1.8, z: 12 };
    let currentCamera = { x: 0, y: 1.8, z: 12 };

    // Raycasting for interactive clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check click on CampusFix phone
      const campusHits = raycaster.intersectObjects(campusPhone.children, true);
      if (campusHits.length > 0) {
        if (onAppSelect) onAppSelect('campusfix');
        return;
      }

      // Check click on PocketTask phone
      const pocketHits = raycaster.intersectObjects(pocketPhone.children, true);
      if (pocketHits.length > 0) {
        if (onAppSelect) onAppSelect('pockettask');
        return;
      }

      // Check click on Archive Table / Disaster
      const archiveHits = raycaster.intersectObjects(archiveTableGroup.children, true);
      if (archiveHits.length > 0) {
        if (onAppSelect) onAppSelect('disaster');
        return;
      }

      // Check click on Navas Moosa 3D Showcase
      const navasHits = raycaster.intersectObjects(navasShowcaseGroup.children, true);
      if (navasHits.length > 0) {
        if (onStationChange) onStationChange(1); // Jump to About Me
        return;
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // 7. Animation Loop
    let clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Update station target
      const currentStation = STATIONS[currentStationIndex] || STATIONS[0];
      targetCamera = currentStation.cameraPos;

      lokiCharacter.setTargetPosition(
        currentStation.characterPos.x,
        currentStation.characterPos.z
      );

      missMinutes.setTargetPosition(
        currentStation.missMinutesPos.x,
        currentStation.missMinutesPos.y,
        currentStation.missMinutesPos.z
      );

      // Smooth camera motion
      currentCamera.x = THREE.MathUtils.lerp(currentCamera.x, targetCamera.x, delta * 3.2);
      currentCamera.y = THREE.MathUtils.lerp(currentCamera.y, targetCamera.y, delta * 3.2);
      currentCamera.z = THREE.MathUtils.lerp(currentCamera.z, targetCamera.z, delta * 3.2);

      camera.position.set(currentCamera.x, currentCamera.y, currentCamera.z);
      camera.lookAt(
        lokiCharacter.group.position.x * 0.4,
        1.5,
        lokiCharacter.group.position.z - 2.5
      );

      // Update Characters
      lokiCharacter.update(delta, time);

      // Miss Minutes winks at viewer especially at Scene 1 (welcome)
      const shouldWink = currentStationIndex === 0 && Math.sin(time * 2) > 0.6;
      missMinutes.update(delta, time, isTalking, shouldWink);

      // Rotate Navas Moosa Hologram Ring
      holoRing.rotation.z += delta * 0.45;
      holoScreen.position.y = 1.75 + Math.sin(time * 2.0) * 0.04;

      // Rotate Chrono-Monitor Gears
      outerRing.rotation.z += delta * 0.4;
      innerRing.rotation.z -= delta * 0.6;
      coreRing.rotation.z += delta * 0.8;

      // Animate Floating Phones
      campusPhone.position.y = 1.8 + Math.sin(time * 2.2) * 0.08;
      pocketPhone.position.y = 1.8 + Math.sin(time * 2.2 + 1) * 0.08;
      campusPhone.rotation.y = Math.PI / 5 + Math.sin(time * 1.5) * 0.06;
      pocketPhone.rotation.y = -Math.PI / 5 - Math.sin(time * 1.5) * 0.06;

      // Animate CRT
      updateCRT(time);

      // Animate Archive Beacon
      beacon.rotation.y += delta * 1.5;
      beacon.rotation.x += delta * 0.8;

      // Animate Loom strands & nexus core
      nexusGroup.rotation.z = Math.sin(time * 0.8) * 0.1;
      nexusCore.rotation.x += delta * 0.8;
      nexusCore.rotation.y += delta * 1.2;

      // Animate Portal Core
      portalCoreMat.opacity = 0.78 + Math.sin(time * 6) * 0.18;
      portalLight.intensity = 2.8 + Math.sin(time * 8) * 1.2;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [currentStationIndex, isTalking, onAppSelect, onStationChange]);

  return <div ref={mountRef} className="webgl-canvas-container" />;
}
