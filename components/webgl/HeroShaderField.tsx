"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { WebglCanvas } from "./WebglCanvas";

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 uv = vUv;
    vec2 mouseInfluence = (uMouse - 0.5) * 0.12;
    vec2 p = uv * 2.6 + mouseInfluence;

    float n = 0.0;
    n += noise(p + uTime * 0.045) * 0.5;
    n += noise(p * 2.0 - uTime * 0.03) * 0.28;
    n += noise(p * 4.0 + uTime * 0.018) * 0.14;

    vec3 sky = vec3(0.890, 0.929, 0.961);
    vec3 mint = vec3(0.765, 1.0, 0.988);
    vec3 clay = vec3(0.780, 0.490, 0.235);

    vec3 color = mix(sky, mint, smoothstep(0.32, 0.62, n));
    color = mix(color, clay, smoothstep(0.72, 0.95, n) * 0.4);

    float alpha = smoothstep(0.18, 0.5, n) * 0.3;
    gl_FragColor = vec4(color, alpha);
  }
`;

function FlowField() {
  const { viewport, pointer } = useThree();
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        },
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        transparent: true,
      }),
    [],
  );

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    const u = material.uniforms.uMouse.value as THREE.Vector2;
    u.set(pointer.x * 0.5 + 0.5, pointer.y * 0.5 + 0.5);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]} material={material}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}

/**
 * Ambient shader flow-field behind the hero portrait — slow, low-alpha,
 * mint/clay/sky palette, subtly reactive to cursor position. Gated off
 * entirely (no three.js download) under reduced-motion / coarse pointer
 * by WebglCanvas itself.
 */
export function HeroShaderField({ className }: { className?: string }) {
  return (
    <WebglCanvas className={className}>
      <FlowField />
    </WebglCanvas>
  );
}
