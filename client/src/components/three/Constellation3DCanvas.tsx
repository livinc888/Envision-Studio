import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import gsap from 'gsap';
import type { Project } from '../../services/api';
import { isProjectOverdue, getDaysRemaining } from '../../utils/dateUtils';

interface Constellation3DCanvasProps {
  projects: Project[];
  highlightStatus?: string | null;
}

// Generate soft radial glow texture using an offscreen canvas
function createGlowTexture(color: string, innerAlpha = 1, outerAlpha = 0): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, color.replace('ALPHA', String(innerAlpha)));
  gradient.addColorStop(0.3, color.replace('ALPHA', String(innerAlpha * 0.6)));
  gradient.addColorStop(0.7, color.replace('ALPHA', String(innerAlpha * 0.2)));
  gradient.addColorStop(1, color.replace('ALPHA', String(outerAlpha)));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export const Constellation3DCanvas: React.FC<Constellation3DCanvasProps> = ({
  projects,
  highlightStatus
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [ariaAnnouncement, setAriaAnnouncement] = useState('');

  // Ref to hold interactive planets for external highlight
  const planetMeshesRef = useRef<{
    mesh: THREE.Mesh;
    project: Project;
    status: string;
    isOverdue: boolean;
    origScale: number;
    baseMaterial: THREE.MeshStandardMaterial;
  }[]>([]);

  // Update highlights based on highlightStatus prop
  useEffect(() => {
    if (!planetMeshesRef.current.length) return;
    const items = planetMeshesRef.current;

    items.forEach(({ mesh, status, isOverdue, origScale, baseMaterial }) => {
      let isMatch = true;
      if (highlightStatus === 'Active') isMatch = status === 'Active';
      else if (highlightStatus === 'Completed') isMatch = status === 'Completed';
      else if (highlightStatus === 'On Hold') isMatch = status === 'On Hold';
      else if (highlightStatus === 'Pending') isMatch = status !== 'Completed';
      else if (highlightStatus === 'Overdue') isMatch = isOverdue;

      if (!highlightStatus) {
        gsap.to(mesh.scale, { x: origScale, y: origScale, z: origScale, duration: 0.3 });
        baseMaterial.emissiveIntensity = 0.3;
        baseMaterial.opacity = 1;
        baseMaterial.transparent = false;
      } else if (isMatch) {
        gsap.to(mesh.scale, { x: origScale * 1.3, y: origScale * 1.3, z: origScale * 1.3, duration: 0.3 });
        baseMaterial.emissiveIntensity = 0.9;
        baseMaterial.opacity = 1;
      } else {
        gsap.to(mesh.scale, { x: origScale * 0.85, y: origScale * 0.85, z: origScale * 0.85, duration: 0.3 });
        baseMaterial.emissiveIntensity = 0.08;
        baseMaterial.transparent = true;
        baseMaterial.opacity = 0.3;
      }
    });
  }, [highlightStatus]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || projects.length === 0) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;
    const isMobile = width < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0b0d, 0.025);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 6.5, 14);
    camera.lookAt(0, 0, 0);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const disposables: { dispose: () => void }[] = [];

    // POST-PROCESSING: Bloom & Composer (bypassed on mobile or reduced-motion)
    let composer: EffectComposer | null = null;
    if (!isMobile && !prefersReducedMotion) {
      try {
        composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        const bloomPass = new UnrealBloomPass(
          new THREE.Vector2(width, height),
          0.55, // strength
          0.35, // radius
          0.85  // threshold
        );
        composer.addPass(bloomPass);
      } catch (err) {
        console.warn('EffectComposer fallback to standard renderer:', err);
        composer = null;
      }
    }

    // 1. LIGHTING
    const ambientLight = new THREE.AmbientLight(0x221a24, 0.8);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0xe5322b, 4.0, 28);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    const rimLight = new THREE.DirectionalLight(0xfff5ea, 1.4);
    rimLight.position.set(12, 18, 10);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x334466, 0.6);
    fillLight.position.set(-10, -8, -10);
    scene.add(fillLight);

    // 2. CORE: Glowing Agency Core
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner emissive icosahedron (detail 2)
    const coreInnerGeo = new THREE.IcosahedronGeometry(0.85, 2);
    const coreInnerMat = new THREE.MeshStandardMaterial({
      color: 0xe5322b,
      emissive: 0xe5322b,
      emissiveIntensity: 1.2,
      roughness: 0.25,
      metalness: 0.4
    });
    disposables.push(coreInnerGeo, coreInnerMat);
    const coreInner = new THREE.Mesh(coreInnerGeo, coreInnerMat);
    coreGroup.add(coreInner);

    // Outer counter-rotating wireframe icosahedron
    const coreWireGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const coreWireMat = new THREE.MeshBasicMaterial({
      color: 0xff4444,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    disposables.push(coreWireGeo, coreWireMat);
    const coreWire = new THREE.Mesh(coreWireGeo, coreWireMat);
    coreGroup.add(coreWire);

    // Soft additive halo sprite
    const haloTex = createGlowTexture('rgba(229, 50, 43, ALPHA)', 0.9, 0);
    disposables.push(haloTex);
    const haloMat = new THREE.SpriteMaterial({
      map: haloTex,
      color: 0xff3333,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.85
    });
    disposables.push(haloMat);
    const haloSprite = new THREE.Sprite(haloMat);
    haloSprite.scale.set(4.8, 4.8, 1);
    coreGroup.add(haloSprite);

    // 3. ENVIRONMENT: Starfield in 2 Depth Layers
    const createStarfield = (count: number, size: number, color: number, opacity: number, spread: number) => {
      const starGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * spread;
        positions[i * 3 + 1] = (Math.random() - 0.5) * (spread * 0.7);
        positions[i * 3 + 2] = (Math.random() - 0.5) * spread - 5;
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const starMat = new THREE.PointsMaterial({
        size,
        color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending
      });
      disposables.push(starGeo, starMat);
      return new THREE.Points(starGeo, starMat);
    };

    const starsLayer1 = createStarfield(450, 0.08, 0xffffff, 0.8, 45);
    const starsLayer2 = createStarfield(750, 0.05, 0xffdcd6, 0.45, 65);
    scene.add(starsLayer1);
    scene.add(starsLayer2);

    // Warm faint nebula sprites
    const nebulaTex = createGlowTexture('rgba(229, 50, 43, ALPHA)', 0.15, 0);
    disposables.push(nebulaTex);
    const nebulaMat = new THREE.SpriteMaterial({
      map: nebulaTex,
      color: 0xe5322b,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.22
    });
    disposables.push(nebulaMat);
    const nebula1 = new THREE.Sprite(nebulaMat);
    nebula1.scale.set(22, 16, 1);
    nebula1.position.set(-6, -2, -10);
    scene.add(nebula1);

    const nebula2 = new THREE.Sprite(nebulaMat);
    nebula2.scale.set(18, 14, 1);
    nebula2.position.set(7, 3, -12);
    scene.add(nebula2);

    // Floating low-poly crystals / background props (InstancedMesh)
    const crystalGeo = new THREE.OctahedronGeometry(0.22, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x554466,
      roughness: 0.4,
      metalness: 0.8,
      transparent: true,
      opacity: 0.5
    });
    disposables.push(crystalGeo, crystalMat);
    const crystalCount = 14;
    const crystalInst = new THREE.InstancedMesh(crystalGeo, crystalMat, crystalCount);
    const dummy = new THREE.Object3D();
    const crystalData: { rotX: number; rotY: number }[] = [];

    for (let i = 0; i < crystalCount; i++) {
      const angle = (i / crystalCount) * Math.PI * 2;
      const dist = 8 + (i % 3) * 2.5;
      dummy.position.set(
        Math.cos(angle) * dist,
        (Math.sin(i * 2.3) - 0.2) * 3,
        Math.sin(angle) * dist - 2
      );
      dummy.scale.setScalar(0.7 + Math.random() * 0.6);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      dummy.updateMatrix();
      crystalInst.setMatrixAt(i, dummy.matrix);
      crystalData.push({
        rotX: (Math.random() - 0.5) * 0.015,
        rotY: (Math.random() - 0.5) * 0.015
      });
    }
    crystalInst.instanceMatrix.needsUpdate = true;
    scene.add(crystalInst);

    // 4. THREE ELLIPTICAL ORBIT PATHS
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    const orbitDefs = [
      { a: 3.6, b: 2.8, yTilt: 0.15 },
      { a: 5.4, b: 4.2, yTilt: -0.1 },
      { a: 7.2, b: 5.6, yTilt: 0.08 }
    ];

    orbitDefs.forEach((odef) => {
      const curve = new THREE.EllipseCurve(0, 0, odef.a, odef.b, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(80);
      const orbitLineGeo = new THREE.BufferGeometry().setFromPoints(
        points.map((p) => new THREE.Vector3(p.x, 0, p.y))
      );
      const orbitLineMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.08
      });
      disposables.push(orbitLineGeo, orbitLineMat);
      const orbitLine = new THREE.Line(orbitLineGeo, orbitLineMat);
      orbitLine.rotation.x = Math.PI / 2;
      orbitLine.rotation.y = odef.yTilt;
      scene.add(orbitLine);
    });

    // 5. PROJECT PLANETS, STATUS COLORS, MOONS, OVERDUE RINGS
    const getColor = (status: string) => {
      if (status === 'Completed') return { hex: 0x3b82f6, str: '#3B82F6' }; // blue
      if (status === 'Active') return { hex: 0x10b981, str: '#10B981' };    // mint green
      return { hex: 0xf59e0b, str: '#F59E0B' };                            // amber
    };

    interface PlanetRecord {
      mesh: THREE.Mesh;
      group: THREE.Group;
      project: Project;
      status: string;
      isOverdue: boolean;
      origScale: number;
      baseMaterial: THREE.MeshStandardMaterial;
      orbitIdx: number;
      angle: number;
      speed: number;
      a: number;
      b: number;
      yAmp: number;
      moons: { mesh: THREE.Mesh; dist: number; angle: number; speed: number; yOffset: number }[];
      overdueRing: THREE.Mesh | null;
      trailLine: THREE.Line | null;
      trailPoints: THREE.Vector3[];
    }

    const planetRecords: PlanetRecord[] = [];
    const interactiveMeshes: THREE.Mesh[] = [];

    projects.forEach((proj, idx) => {
      const orbitIdx = idx % orbitDefs.length;
      const odef = orbitDefs[orbitIdx];
      const angle = (idx / projects.length) * Math.PI * 2 + (idx * 0.4);
      const speed = (0.0035 + (idx % 3) * 0.0018) * (orbitIdx === 1 ? -1 : 1);
      const yAmp = (Math.sin(idx * 1.8) * 0.7);

      const colorData = getColor(proj.status);
      const overdue = isProjectOverdue(proj.deadline, proj.status);

      // Radius mapped to task count
      const taskCount = proj.taskCount || 1;
      const baseRadius = Math.max(0.3, Math.min(0.65, 0.26 + taskCount * 0.04));

      const planetGroup = new THREE.Group();
      orbitGroup.add(planetGroup);

      // Planet Sphere
      const sphereGeo = new THREE.SphereGeometry(baseRadius, 32, 32);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: colorData.hex,
        emissive: colorData.hex,
        emissiveIntensity: 0.35,
        roughness: 0.35,
        metalness: 0.2
      });
      disposables.push(sphereGeo, sphereMat);
      const planetMesh = new THREE.Mesh(sphereGeo, sphereMat);
      planetMesh.userData = { project: proj, recordIndex: idx };
      planetGroup.add(planetMesh);
      interactiveMeshes.push(planetMesh);

      // Planet Status Accent Ring
      const ringGeo = new THREE.RingGeometry(baseRadius * 1.35, baseRadius * 1.55, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorData.hex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65
      });
      disposables.push(ringGeo, ringMat);
      const statusRing = new THREE.Mesh(ringGeo, ringMat);
      statusRing.rotation.x = Math.PI / 3;
      planetGroup.add(statusRing);

      // Overdue Warning Ring (Pulsing Coral)
      let overdueRing: THREE.Mesh | null = null;
      if (overdue) {
        const odGeo = new THREE.RingGeometry(baseRadius * 1.75, baseRadius * 1.95, 32);
        const odMat = new THREE.MeshBasicMaterial({
          color: 0xff3b30,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85
        });
        disposables.push(odGeo, odMat);
        overdueRing = new THREE.Mesh(odGeo, odMat);
        overdueRing.rotation.x = Math.PI / 2;
        planetGroup.add(overdueRing);
      }

      // TASK MOONS: tiny moons orbiting planet (capped at 12)
      const moonCount = Math.min(taskCount, 12);
      const completedMoons = Math.min(proj.completedTaskCount || 0, moonCount);
      const moons: { mesh: THREE.Mesh; dist: number; angle: number; speed: number; yOffset: number }[] = [];

      for (let m = 0; m < moonCount; m++) {
        const isCompleted = m < completedMoons;
        const moonGeo = new THREE.SphereGeometry(0.065, 12, 12);
        const moonMat = new THREE.MeshStandardMaterial({
          color: isCompleted ? 0xffffff : 0x777788,
          emissive: isCompleted ? colorData.hex : 0x222233,
          emissiveIntensity: isCompleted ? 1.0 : 0.15,
          roughness: 0.3,
          metalness: 0.6,
          transparent: !isCompleted,
          opacity: isCompleted ? 1.0 : 0.4
        });
        disposables.push(moonGeo, moonMat);
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);

        const moonDist = baseRadius + 0.35 + (m % 3) * 0.18;
        const moonAngle = (m / moonCount) * Math.PI * 2;
        const moonSpeed = 0.025 + (m % 4) * 0.01;
        const yOffset = (Math.sin(m * 2) * 0.15);

        planetGroup.add(moonMesh);
        moons.push({ mesh: moonMesh, dist: moonDist, angle: moonAngle, speed: moonSpeed, yOffset });
      }

      // Short Fading Comet Trail
      const trailPoints: THREE.Vector3[] = [];
      const trailLen = 8;
      for (let t = 0; t < trailLen; t++) {
        trailPoints.push(new THREE.Vector3(0, 0, 0));
      }
      const trailGeo = new THREE.BufferGeometry().setFromPoints(trailPoints);
      const trailMat = new THREE.LineBasicMaterial({
        color: colorData.hex,
        transparent: true,
        opacity: 0.25
      });
      disposables.push(trailGeo, trailMat);
      const trailLine = new THREE.Line(trailGeo, trailMat);
      scene.add(trailLine);

      planetRecords.push({
        mesh: planetMesh,
        group: planetGroup,
        project: proj,
        status: proj.status,
        isOverdue: overdue,
        origScale: 1.0,
        baseMaterial: sphereMat,
        orbitIdx,
        angle,
        speed,
        a: odef.a,
        b: odef.b,
        yAmp,
        moons,
        overdueRing,
        trailLine,
        trailPoints
      });
    });

    planetMeshesRef.current = planetRecords.map((r) => ({
      mesh: r.mesh,
      project: r.project,
      status: r.status,
      isOverdue: r.isOverdue,
      origScale: r.origScale,
      baseMaterial: r.baseMaterial
    }));

    // 6. RAYCASTER, INTERACTION & PARALLAX
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let targetCameraX = 0;
    let targetCameraY = 6.5;
    let isDragging = false;
    let previousPointerX = 0;
    let orbitRotationVelocity = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      mouse.x = (clientX / container.clientWidth) * 2 - 1;
      mouse.y = -(clientY / container.clientHeight) * 2 + 1;

      // Mouse Parallax drift (max ~12 deg tilt)
      targetCameraX = mouse.x * 2.2;
      targetCameraY = 6.5 + mouse.y * 1.2;

      // Orbit drag rotation if down
      if (isDragging) {
        const deltaX = e.clientX - previousPointerX;
        orbitGroup.rotation.y += deltaX * 0.005;
        orbitRotationVelocity = deltaX * 0.005;
        previousPointerX = e.clientX;
      }

      // Raycaster check
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const proj = hit.userData.project as Project;
        const idx = hit.userData.recordIndex as number;

        setHoveredProject(proj);
        setTooltipPos({ x: clientX, y: clientY });
        setAriaAnnouncement(`Hovered project: ${proj.title}, status ${proj.status}, ${proj.completedTaskCount} of ${proj.taskCount} tasks completed.`);
        container.style.cursor = 'pointer';

        // Hover scale up 1.25x
        planetRecords.forEach((item, i) => {
          if (i === idx) {
            gsap.to(item.mesh.scale, { x: 1.25, y: 1.25, z: 1.25, duration: 0.2 });
            item.baseMaterial.emissiveIntensity = 0.8;
          } else {
            gsap.to(item.mesh.scale, { x: 0.9, y: 0.9, z: 0.9, duration: 0.2 });
            item.baseMaterial.emissiveIntensity = 0.15;
          }
        });
      } else {
        if (hoveredProject !== null) {
          setHoveredProject(null);
          container.style.cursor = 'grab';
          planetRecords.forEach((item) => {
            gsap.to(item.mesh.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.25 });
            item.baseMaterial.emissiveIntensity = 0.35;
          });
        }
      }
    };

    const onPointerDown = (e: MouseEvent) => {
      // If clicking directly on a planet, handled by click listener
      isDragging = true;
      previousPointerX = e.clientX;
      container.style.cursor = 'grabbing';
    };

    const onPointerUp = () => {
      isDragging = false;
      container.style.cursor = hoveredProject ? 'pointer' : 'grab';
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes);
      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const proj = hit.userData.project as Project;
        const hitWorldPos = new THREE.Vector3();
        hit.getWorldPosition(hitWorldPos);

        // GSAP Camera fly-to and red wipe transition
        gsap.to(camera.position, {
          x: hitWorldPos.x * 0.7,
          y: hitWorldPos.y * 0.7 + 0.6,
          z: hitWorldPos.z * 0.7 + 1.8,
          duration: 0.55,
          ease: 'power3.inOut'
        });

        if (wipeRef.current) {
          gsap.to(wipeRef.current, {
            opacity: 1,
            duration: 0.35,
            delay: 0.2,
            onComplete: () => {
              navigate(`/app/projects/${proj.id}`);
            }
          });
        } else {
          setTimeout(() => navigate(`/app/projects/${proj.id}`), 450);
        }
      }
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('click', onClick);

    // RESIZE & INTERSECTION
    let animationFrameId: number;
    let isVisible = true;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (composer) {
        composer.setSize(w, h);
      }
    };
    window.addEventListener('resize', handleResize);

    // 7. ANIMATION LOOP
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Camera parallax smoothing
      camera.position.x += (targetCameraX - camera.position.x) * 0.05;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Core rotation & gentle pulse
      coreInner.rotation.y += 0.015;
      coreInner.rotation.x += 0.008;
      coreWire.rotation.y -= 0.01;
      coreWire.rotation.z += 0.006;
      const pulse = 1 + Math.sin(elapsedTime * 2.8) * 0.06;
      coreInner.scale.setScalar(pulse);
      haloSprite.scale.set(4.8 * pulse, 4.8 * pulse, 1);

      // Stars drift
      starsLayer1.rotation.y += 0.0004;
      starsLayer2.rotation.y -= 0.0002;

      // Crystals tumble
      for (let i = 0; i < crystalCount; i++) {
        crystalInst.getMatrixAt(i, dummy.matrix);
        dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        dummy.rotation.x += crystalData[i].rotX;
        dummy.rotation.y += crystalData[i].rotY;
        dummy.updateMatrix();
        crystalInst.setMatrixAt(i, dummy.matrix);
      }
      crystalInst.instanceMatrix.needsUpdate = true;

      // Damped orbit rotation momentum
      if (!isDragging && Math.abs(orbitRotationVelocity) > 0.0001) {
        orbitGroup.rotation.y += orbitRotationVelocity;
        orbitRotationVelocity *= 0.94;
      } else if (!isDragging) {
        orbitGroup.rotation.y += 0.0008;
      }

      // Planet and Moon orbital movements
      planetRecords.forEach((item) => {
        // Orbital trajectory
        item.angle += item.speed;
        const px = Math.cos(item.angle) * item.a;
        const pz = Math.sin(item.angle) * item.b;
        const py = item.yAmp + Math.sin(item.angle * 2) * 0.3;

        item.group.position.set(px, py, pz);

        // Planet self-rotation
        item.mesh.rotation.y += 0.02;

        // Overdue pulsing coral ring
        if (item.overdueRing) {
          const odPulse = 1 + Math.sin(elapsedTime * 4.5) * 0.14;
          item.overdueRing.scale.setScalar(odPulse);
          (item.overdueRing.material as THREE.MeshBasicMaterial).opacity =
            0.55 + Math.sin(elapsedTime * 4.5) * 0.35;
        }

        // Moons orbit planet
        item.moons.forEach((m) => {
          m.angle += m.speed;
          m.mesh.position.set(
            Math.cos(m.angle) * m.dist,
            m.yOffset + Math.sin(m.angle * 1.5) * 0.08,
            Math.sin(m.angle) * m.dist
          );
        });

        // Fading comet trail points
        if (item.trailLine) {
          const worldPos = new THREE.Vector3();
          item.mesh.getWorldPosition(worldPos);
          item.trailPoints.unshift(worldPos);
          if (item.trailPoints.length > 8) {
            item.trailPoints.pop();
          }
          item.trailLine.geometry.setFromPoints(item.trailPoints);
        }
      });

      // Render via Bloom Composer or direct
      if (composer) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
    };

    animate();

    // 8. DISPOSAL ON UNMOUNT (Prevent WebGL memory leaks)
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);

      if (composer) {
        composer.dispose();
      }
      renderer.dispose();
      disposables.forEach((d) => d.dispose());
      planetRecords.forEach((p) => {
        if (p.trailLine) {
          p.trailLine.geometry.dispose();
          (p.trailLine.material as THREE.Material).dispose();
        }
      });

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [projects, navigate]);

  return (
    <div
      className="relative w-full min-h-[460px] md:min-h-[540px] rounded-2xl bg-[#0B0B0D] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)] overflow-hidden select-none"
      style={{ touchAction: 'pan-y' }}
      role="region"
      aria-label="Interactive 3D Project Constellation"
    >
      {/* Screen reader live region */}
      <div className="sr-only" aria-live="polite">
        {ariaAnnouncement}
      </div>

      {/* Red Wipe Route Transition Overlay */}
      <div
        ref={wipeRef}
        className="pointer-events-none absolute inset-0 bg-studio-red z-50 opacity-0"
        style={{ willChange: 'opacity' }}
      />

      {/* Canvas Mount Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Subtle Vignette Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(11,11,13,0.75)_100%)] z-10" />

      {/* Floating Intel Tooltip Card */}
      {hoveredProject && (
        <div
          className="pointer-events-none absolute z-30 p-4 rounded-xl bg-black/90 backdrop-blur-xl border border-white/20 text-white shadow-[0_12px_36px_rgba(0,0,0,0.8)] text-xs -translate-x-1/2 -translate-y-16 transition-all font-sans min-w-[210px]"
          style={{ top: `${tooltipPos.y}px`, left: `${tooltipPos.x}px` }}
        >
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <span className="font-mono text-[11px] text-zinc-400 font-bold tracking-wider">
              PRJ-{String(hoveredProject.id).padStart(3, '0')}
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                hoveredProject.status === 'Completed'
                  ? 'text-blue-400 bg-blue-500/15 border border-blue-500/30'
                  : hoveredProject.status === 'Active'
                  ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30'
                  : 'text-amber-400 bg-amber-500/15 border border-amber-500/30'
              }`}
            >
              {hoveredProject.status}
            </span>
          </div>

          <div className="font-semibold text-white text-sm line-clamp-1">{hoveredProject.title}</div>

          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>
              {hoveredProject.completedTaskCount}/{hoveredProject.taskCount} tasks ({hoveredProject.progress}%)
            </span>
            <span className={isProjectOverdue(hoveredProject.deadline, hoveredProject.status) ? 'text-red-400 font-bold' : 'text-zinc-400'}>
              {getDaysRemaining(hoveredProject.deadline).label}
            </span>
          </div>

          <div className="text-[10px] text-studio-red font-mono font-bold mt-2 flex items-center gap-1">
            <span>Inspect Node</span>
            <span>→</span>
          </div>
        </div>
      )}

      {/* Bottom Mission Intel Legend */}
      <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-zinc-500 pointer-events-none z-20">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
            <span className="text-zinc-400">Active</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#3B82F6]" />
            <span className="text-zinc-400">Completed</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" />
            <span className="text-zinc-400">On Hold</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full border border-red-500 bg-red-500/40 animate-pulse" />
            <span className="text-red-400 font-semibold">Overdue Ring</span>
          </span>
        </div>
        <span className="hidden sm:inline text-zinc-500">
          Drag to rotate orbit · Hover node for intel · Click to inspect
        </span>
      </div>
    </div>
  );
};
