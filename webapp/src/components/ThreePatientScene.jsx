import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function ThreePatientScene({ infections, selectedInfection, onSelectInfection }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const hotspotsRef = useRef([]);
  const animFrameRef = useRef(null);
  const targetCamPos = useRef(null);
  const targetLookAt = useRef(null);

  const [activePreset, setActivePreset] = useState('full');
  const [showParticles, setShowParticles] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [hoveredLocus, setHoveredLocus] = useState(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060913);
    scene.fog = new THREE.FogExp2(0x060913, 0.04);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 1.2, 8.5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.0;
    controls.maxDistance = 18.0;
    controls.target.set(0, 1.2, 0);
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0284c7, 0.8);
    dirLight2.position.set(-5, -2, -5);
    scene.add(dirLight2);

    const redRimLight = new THREE.PointLight(0xef4444, 2.0, 6);
    redRimLight.position.set(-0.9, -0.4, 1.0);
    scene.add(redRimLight);

    // Anatomical Grid
    const grid = new THREE.GridHelper(16, 32, 0x1e293b, 0x0f172a);
    grid.position.y = -4.5;
    scene.add(grid);

    // Materials
    const silhouetteMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e3a8a,
      transparent: true,
      opacity: 0.18,
      roughness: 0.2,
      transmission: 0.6,
      thickness: 0.8,
      wireframe: false,
      depthWrite: false
    });

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.06
    });

    const boneMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.4,
      metalness: 0.1,
      transparent: true,
      opacity: 0.75
    });

    const vascularMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      emissive: 0x991b1b,
      emissiveIntensity: 0.4,
      roughness: 0.3
    });

    const bodyGroup = new THREE.Group();
    scene.add(bodyGroup);

    // 1. Torso
    const torsoGeo = new THREE.CylinderGeometry(1.05, 0.85, 2.6, 24);
    const torso = new THREE.Mesh(torsoGeo, silhouetteMat);
    torso.position.y = 1.3;
    bodyGroup.add(torso);
    const torsoWire = new THREE.Mesh(torsoGeo, wireMat);
    torsoWire.position.y = 1.3;
    bodyGroup.add(torsoWire);

    // 2. Head & Neck
    const headGeo = new THREE.SphereGeometry(0.65, 32, 32);
    headGeo.scale(0.85, 1.15, 0.95);
    const head = new THREE.Mesh(headGeo, silhouetteMat);
    head.position.y = 3.65;
    bodyGroup.add(head);

    const neckGeo = new THREE.CylinderGeometry(0.35, 0.42, 0.6, 16);
    const neck = new THREE.Mesh(neckGeo, silhouetteMat);
    neck.position.y = 2.8;
    bodyGroup.add(neck);

    // 3. Pelvis & Limbs
    const pelvisGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.9, 20);
    const pelvis = new THREE.Mesh(pelvisGeo, silhouetteMat);
    pelvis.position.y = -0.35;
    bodyGroup.add(pelvis);

    // Legs
    const createLimb = (x, y, h, r1, r2) => {
      const g = new THREE.CylinderGeometry(r1, r2, h, 16);
      const m = new THREE.Mesh(g, silhouetteMat);
      m.position.set(x, y, 0);
      return m;
    };
    bodyGroup.add(createLimb(-0.6, -1.8, 1.8, 0.4, 0.3)); // Left Thigh
    bodyGroup.add(createLimb(0.6, -1.8, 1.8, 0.4, 0.3));  // Right Thigh
    bodyGroup.add(createLimb(-0.6, -3.2, 1.6, 0.28, 0.22)); // Left Calf
    bodyGroup.add(createLimb(0.6, -3.2, 1.6, 0.28, 0.22));  // Right Calf

    // Arms
    const createArm = (x, rot) => {
      const g = new THREE.CylinderGeometry(0.24, 0.18, 2.4, 16);
      const m = new THREE.Mesh(g, silhouetteMat);
      m.position.set(x, 1.2, 0);
      m.rotation.z = rot;
      return m;
    };
    bodyGroup.add(createArm(-1.45, -0.15));
    bodyGroup.add(createArm(1.45, 0.15));

    // Internal Organs & Micro-Structures:
    // A. Brain Hemispheres
    const brainGroup = new THREE.Group();
    brainGroup.position.set(0, 3.65, 0);
    const leftHem = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 24, 24),
      new THREE.MeshStandardMaterial({
        color: 0x9333ea,
        emissive: 0x581c87,
        emissiveIntensity: 0.5,
        roughness: 0.4
      })
    );
    leftHem.scale.set(0.85, 0.9, 1.15);
    leftHem.position.x = -0.22;
    brainGroup.add(leftHem);

    const rightHem = leftHem.clone();
    rightHem.position.x = 0.22;
    brainGroup.add(rightHem);
    bodyGroup.add(brainGroup);

    // B. Heart with Mitral Valve & Vegetation
    const heartGroup = new THREE.Group();
    heartGroup.position.set(-0.15, 1.65, 0.3);
    const heartMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 24, 24),
      new THREE.MeshStandardMaterial({
        color: 0xbe123c,
        emissive: 0x881337,
        emissiveIntensity: 0.6,
        roughness: 0.3
      })
    );
    heartMesh.scale.set(0.9, 1.2, 0.9);
    heartGroup.add(heartMesh);

    // Mitral Valve Ring
    const mitralRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.03, 16, 32),
      new THREE.MeshBasicMaterial({ color: 0xfacc15 })
    );
    mitralRing.rotation.x = Math.PI / 3;
    mitralRing.position.set(-0.05, 0.05, 0.15);
    heartGroup.add(mitralRing);

    // 1.9 cm Vegetation mass (oscillating)
    const vegMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xff0000,
        emissiveIntensity: 1.0,
        roughness: 0.2
      })
    );
    vegMesh.position.set(-0.06, 0.1, 0.18);
    heartGroup.add(vegMesh);
    bodyGroup.add(heartGroup);

    // C. Bilateral Kidneys (Scattered & Shrunken Diabetic CKD)
    const createKidney = (x, y, z, color) => {
      const kGeo = new THREE.SphereGeometry(0.24, 20, 20);
      kGeo.scale(0.7, 1.25, 0.65);
      const kMesh = new THREE.Mesh(
        kGeo,
        new THREE.MeshStandardMaterial({
          color: color,
          emissive: 0x7c2d12,
          emissiveIntensity: 0.4,
          roughness: 0.5
        })
      );
      kMesh.position.set(x, y, z);
      return kMesh;
    };
    const leftKidney = createKidney(-0.55, 1.15, -0.2, 0x9a3412);
    const rightKidney = createKidney(0.55, 1.15, -0.2, 0x9a3412);
    bodyGroup.add(leftKidney);
    bodyGroup.add(rightKidney);

    // D. Left Hip Prosthetic Joint & Bone
    const hipProsthesisGroup = new THREE.Group();
    hipProsthesisGroup.position.set(-0.9, -0.4, 0.15);
    const stemGeo = new THREE.CylinderGeometry(0.08, 0.05, 0.7, 16);
    const stemMesh = new THREE.Mesh(
      stemGeo,
      new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.9,
        roughness: 0.2
      })
    );
    stemMesh.rotation.z = 0.25;
    hipProsthesisGroup.add(stemMesh);

    const headBall = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 20, 20),
      new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        metalness: 0.95,
        roughness: 0.1
      })
    );
    headBall.position.set(0.08, 0.35, 0);
    hipProsthesisGroup.add(headBall);
    bodyGroup.add(hipProsthesisGroup);

    // E. Vascular Tree (Aorta & Major Branches)
    const aortaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.15, 1.8, 0.3),
      new THREE.Vector3(-0.1, 2.1, 0.2),
      new THREE.Vector3(0.0, 1.9, 0.0),
      new THREE.Vector3(0.0, 1.15, -0.05),
      new THREE.Vector3(0.0, 0.2, 0.0),
      new THREE.Vector3(-0.4, -0.6, 0.1) // To left iliac/femoral
    ]);
    const aortaGeo = new THREE.TubeGeometry(aortaCurve, 40, 0.05, 12, false);
    const aortaMesh = new THREE.Mesh(aortaGeo, vascularMat);
    bodyGroup.add(aortaMesh);

    // Carotid to Brain
    const carotidCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, 2.0, 0.1),
      new THREE.Vector3(-0.1, 2.8, 0.05),
      new THREE.Vector3(-0.18, 3.5, 0.1)
    ]);
    const carotidGeo = new THREE.TubeGeometry(carotidCurve, 20, 0.03, 10, false);
    bodyGroup.add(new THREE.Mesh(carotidGeo, vascularMat));

    // Spine & Ribs (Skeleton)
    const skeletonGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const ribGeo = new THREE.TorusGeometry(0.7 - i * 0.03, 0.02, 8, 24, Math.PI * 1.3);
      const rib = new THREE.Mesh(ribGeo, boneMat);
      rib.rotation.x = Math.PI / 2 + 0.1;
      rib.rotation.z = Math.PI * 0.35;
      rib.position.set(0, 1.8 - i * 0.22, 0.1);
      skeletonGroup.add(rib);
    }
    bodyGroup.add(skeletonGroup);

    // Bacteremia Particle Stream
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    const waypoints = [
      new THREE.Vector3(-0.9, -0.4, 0.15),  // Left Hip Focus
      new THREE.Vector3(-0.5, 0.1, 0.1),    // Femoral Vein
      new THREE.Vector3(-0.2, 0.8, 0.05),   // IVC
      new THREE.Vector3(-0.15, 1.65, 0.35), // Heart Mitral
      new THREE.Vector3(-0.1, 2.6, 0.1),    // Carotid
      new THREE.Vector3(-0.25, 3.55, 0.2)   // Brain Stroke
    ];

    for (let i = 0; i < particleCount; i++) {
      particleSpeeds[i] = 0.002 + Math.random() * 0.005;
      const progress = Math.random();
      const pt = getPointAlongWaypoints(waypoints, progress);
      particlePositions[i * 3] = pt.x + (Math.random() - 0.5) * 0.06;
      particlePositions[i * 3 + 1] = pt.y + (Math.random() - 0.5) * 0.06;
      particlePositions[i * 3 + 2] = pt.z + (Math.random() - 0.5) * 0.06;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.07,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    function getPointAlongWaypoints(pts, t) {
      const scaled = t * (pts.length - 1);
      const idx = Math.min(Math.floor(scaled), pts.length - 2);
      const frac = scaled - idx;
      return new THREE.Vector3().lerpVectors(pts[idx], pts[idx + 1], frac);
    }

    // Hotspots Setup
    const hotspotMeshes = [];
    infections.forEach((inf) => {
      const group = new THREE.Group();
      group.position.set(inf.coordinates.x, inf.coordinates.y, inf.coordinates.z);
      group.userData = { infection: inf };

      // Inner Core
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 20, 20),
        new THREE.MeshBasicMaterial({ color: 0xef4444 })
      );
      group.add(core);

      // Outer Pulsing Ring
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.18, 0.24, 32),
        new THREE.MeshBasicMaterial({
          color: 0xef4444,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7
        })
      );
      ring.name = 'ring';
      group.add(ring);

      scene.add(group);
      hotspotMeshes.push(group);
    });
    hotspotsRef.current = hotspotMeshes;

    // Raycaster for 3D hotspot clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        hotspotMeshes.flatMap(g => g.children),
        true
      );

      if (intersects.length > 0) {
        let root = intersects[0].object;
        while (root.parent && !root.userData?.infection) {
          root = root.parent;
        }
        if (root.userData?.infection) {
          const inf = root.userData.infection;
          onSelectInfection(inf);
          flyToLocus(inf);
        }
      }
    };

    const onPointerMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        hotspotMeshes.flatMap(g => g.children),
        true
      );
      if (intersects.length > 0) {
        renderer.domElement.style.cursor = 'pointer';
        let root = intersects[0].object;
        while (root.parent && !root.userData?.infection) {
          root = root.parent;
        }
        setHoveredLocus(root.userData?.infection || null);
      } else {
        renderer.domElement.style.cursor = 'default';
        setHoveredLocus(null);
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Controls update
      controls.update();

      // Pulse Hotspots
      hotspotMeshes.forEach((g) => {
        const ring = g.getObjectByName('ring');
        if (ring) {
          const scale = 1.0 + Math.sin(time * 4) * 0.25;
          ring.scale.set(scale, scale, 1);
          ring.lookAt(camera.position);
        }
      });

      // Heart Vegetation oscillation
      vegMesh.position.y = 0.1 + Math.sin(time * 6) * 0.04;
      vegMesh.position.x = -0.06 + Math.cos(time * 5) * 0.03;

      // Animate Particles
      if (showParticles) {
        const posAttr = particleGeo.attributes.position;
        for (let i = 0; i < particleCount; i++) {
          let y = posAttr.getY(i);
          y += particleSpeeds[i] * 1.5;
          if (y > 3.8) {
            y = -0.4;
            const pt = getPointAlongWaypoints(waypoints, 0);
            posAttr.setXYZ(i, pt.x, pt.y, pt.z);
          } else {
            const t = Math.max(0, Math.min(1, (y + 0.4) / 4.2));
            const pt = getPointAlongWaypoints(waypoints, t);
            posAttr.setXYZ(i, pt.x + Math.sin(time * 3 + i) * 0.02, y, pt.z + Math.cos(time * 2 + i) * 0.02);
          }
        }
        posAttr.needsUpdate = true;
      }

      // Camera Lerp transition
      if (targetCamPos.current && targetLookAt.current) {
        camera.position.lerp(targetCamPos.current, 0.06);
        controls.target.lerp(targetLookAt.current, 0.06);
        if (camera.position.distanceTo(targetCamPos.current) < 0.05) {
          targetCamPos.current = null;
          targetLookAt.current = null;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (renderer.domElement) {
        renderer.domElement.removeEventListener('pointerdown', onPointerDown);
        renderer.domElement.removeEventListener('pointermove', onPointerMove);
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [infections, showParticles]);

  const flyToLocus = (inf) => {
    if (!inf) return;
    targetCamPos.current = new THREE.Vector3(inf.cameraPosition.x, inf.cameraPosition.y, inf.cameraPosition.z);
    targetLookAt.current = new THREE.Vector3(inf.cameraTarget.x, inf.cameraTarget.y, inf.cameraTarget.z);
  };

  const handlePresetChange = (preset) => {
    setActivePreset(preset);
    const presets = {
      full: { pos: [0, 1.2, 8.5], target: [0, 1.2, 0] },
      brain: { pos: [0, 3.8, 1.8], target: [0, 3.6, 0] },
      heart: { pos: [-0.3, 1.7, 1.8], target: [-0.15, 1.65, 0.35] },
      kidney: { pos: [0, 1.15, 2.0], target: [0, 1.15, -0.1] },
      hip: { pos: [-1.8, -0.2, 2.2], target: [-0.9, -0.4, 0.15] },
      vascular: { pos: [0, 0.8, 2.5], target: [-0.1, 0.8, 0] }
    };
    const p = presets[preset] || presets.full;
    targetCamPos.current = new THREE.Vector3(...p.pos);
    targetLookAt.current = new THREE.Vector3(...p.target);

    const matchedInf = infections.find(i => i.key === preset);
    if (matchedInf) onSelectInfection(matchedInf);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '620px', borderRadius: '16px', overflow: 'hidden', background: '#060913' }}>
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />

      {/* Floating Header Controls */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 10,
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        maxWidth: 'calc(100% - 32px)'
      }}>
        {[
          { id: 'full', label: '🧍 Full Body' },
          { id: 'brain', label: '🧠 Brain (Stroke)' },
          { id: 'heart', label: '🫀 Heart (1.9cm Veg)' },
          { id: 'kidney', label: '🫘 Kidneys (CKD G5)' },
          { id: 'hip', label: '🦴 Left Hip (PJI Source)' },
          { id: 'vascular', label: '🩸 Sepsis Highway' }
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => handlePresetChange(btn.id)}
            className={`btn ${activePreset === btn.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Particle & Layer Toggles */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 10,
        display: 'flex',
        gap: '8px'
      }}>
        <button
          onClick={() => setShowParticles(!showParticles)}
          className={`btn ${showParticles ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.75rem', padding: '6px 10px' }}
          title="Toggle Bacteremia Flow Simulation"
        >
          {showParticles ? '⚡ Flow Active' : '⏸ Flow Paused'}
        </button>
      </div>

      {/* Hover Info Tooltip */}
      {hoveredLocus && (
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          zIndex: 15,
          background: 'rgba(15, 23, 42, 0.92)',
          border: '1px solid rgba(239, 68, 68, 0.5)',
          borderRadius: '12px',
          padding: '12px 18px',
          backdropFilter: 'blur(12px)',
          maxWidth: '380px',
          boxShadow: '0 10px 25px rgba(239, 68, 68, 0.25)',
          animation: 'floatSlow 3s infinite ease-in-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} className="pulsing-dot" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc' }}>{hoveredLocus.title}</h4>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>{hoveredLocus.anatomicalSite}</p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span className="badge-critical">{hoveredLocus.severity}</span>
            <span className="glass-pill" style={{ fontSize: '0.75rem', color: '#38bdf8' }}>🦠 {hoveredLocus.pathogen}</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '6px' }}>Click to inspect microbiological details & clinical reports →</p>
        </div>
      )}

      {/* 3D Instructions Legend */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        zIndex: 10,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '0.75rem',
        color: '#94a3b8',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span>🖱️ <b>Rotate:</b> Left Click + Drag</span>
        <span>🔍 <b>Zoom:</b> Scroll</span>
        <span>🖐️ <b>Pan:</b> Right Click</span>
        <span>🔴 <b>Inspect:</b> Click Hotspots</span>
      </div>
    </div>
  );
}
