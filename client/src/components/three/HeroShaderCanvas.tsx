import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HeroShaderCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const uniforms = {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_targetMouse: { value: new THREE.Vector2(0.5, 0.5) }
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    // Award-winning kinetic fluid shader with chromatic dispersion & long-exposure streaks
    const fragmentShader = `
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 vUv;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
          f.y
        );
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 4; ++i) {
          v += a * noise(p);
          p = rot * p * 2.1 + vec2(12.3);
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y;

        // Interactive mouse gravity pull
        vec2 mouseOffset = (u_mouse - 0.5) * 0.35;
        vec2 p = st * vec2(1.1, 2.5) - vec2(u_time * 0.07, 0.0) + mouseOffset;

        // Multi-frequency fluid noise layers
        float n1 = fbm(p + vec2(u_time * 0.035, 0.0));
        float n2 = fbm(p * 2.4 - vec2(0.0, u_time * 0.025));
        float n3 = fbm(p * 4.0 + vec2(u_time * 0.05, n1 * 0.5));

        // Horizontal long-exposure light streaks with sinusoidal warp
        float streaks = sin((st.y + n1 * 0.28) * 42.0 + u_time * 0.45) * 0.5 + 0.5;
        float ribbon = sin((st.y + n2 * 0.35) * 18.0 - u_time * 0.3) * 0.5 + 0.5;

        // Chromatic aberration color grading: Studio Red (#E5322B), Crimson & Luminescent White
        vec3 colRed = vec3(0.90, 0.18, 0.15);
        vec3 colCrimson = vec3(0.65, 0.06, 0.10);
        vec3 colWhite = vec3(0.98, 0.98, 1.0);
        vec3 colAmber = vec3(0.95, 0.60, 0.20);

        vec3 col = vec3(0.0);
        // Deep ambient glow
        col += colCrimson * pow(ribbon, 3.0) * n1 * 1.5;
        // Primary intense luminous streaks
        col += colRed * pow(streaks, 4.5) * (n1 * 1.8 + 0.2);
        // Core incandescent highlight
        col += colWhite * pow(streaks, 14.0) * n2 * 1.6;
        // Ambient secondary ember glow
        col += colAmber * pow(ribbon, 6.0) * n3 * 0.6;

        // Cinematic vignette & falloff
        float vig = smoothstep(1.2, 0.3, length(vUv - 0.5));
        col *= vig;

        float alpha = clamp(dot(col, vec3(0.35, 0.35, 0.35)) * 1.7, 0.0, 0.85);
        gl_FragColor = vec4(col, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthWrite: false,
      depthTest: false,
      transparent: true
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationFrameId: number;
    let isVisible = true;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      uniforms.u_targetMouse.value.set(x, y);
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.u_resolution.value.set(width, height);
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      uniforms.u_time.value = clock.getElapsedTime();
      uniforms.u_mouse.value.lerp(uniforms.u_targetMouse.value, 0.05);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-85 mix-blend-screen"
    />
  );
};
