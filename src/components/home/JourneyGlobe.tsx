"use client";

import { useEffect, useRef } from "react";

export function JourneyGlobe() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(max-width: 767px)").matches;
    if (reduce || coarse) return;

    let disposed = false;
    let frame = 0;
    let renderer: {
      setPixelRatio: (value: number) => void;
      setSize: (width: number, height: number, updateStyle: boolean) => void;
      render: (scene: unknown, camera: unknown) => void;
      dispose: () => void;
    } | null = null;

    (async () => {
      const THREE = (await import("three")) as unknown as {
        WebGLRenderer: new (options: object) => { setPixelRatio(value: number): void; setSize(width: number, height: number, updateStyle: boolean): void; render(scene: unknown, camera: unknown): void; dispose(): void };
        Scene: new () => { add(object: unknown): void };
        PerspectiveCamera: new (fov: number, aspect: number, near: number, far: number) => { position: { set(x: number, y: number, z: number): void; x: number; y: number }; lookAt(x: number, y: number, z: number): void };
        SphereGeometry: new (radius: number, width: number, height: number) => unknown;
        MeshBasicMaterial: new (options: object) => unknown;
        Mesh: new (geometry: unknown, material: unknown) => { rotation: { y: number } };
        PointsMaterial: new (options: object) => unknown;
        Points: new (geometry: unknown, material: unknown) => { rotation: { y: number } };
        Vector3: new (x: number, y: number, z: number) => unknown;
        QuadraticBezierCurve3: new (a: unknown, b: unknown, c: unknown) => { getPoints(count: number): unknown };
        BufferGeometry: new () => { setFromPoints(points: unknown): unknown };
        LineBasicMaterial: new (options: object) => unknown;
        Line: new (geometry: unknown, material: unknown) => unknown;
        PointLight: new (color: number, intensity: number, distance: number) => { position: { set(x: number, y: number, z: number): void } };
      };
      if (disposed || !ref.current) return;
      const width = canvas.clientWidth || 640;
      const height = canvas.clientHeight || 640;
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(width, height, false);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
      camera.position.set(0, 0.2, 6.2);
      const globe = new THREE.Mesh(
        new THREE.SphereGeometry(1.7, 48, 32),
        new THREE.MeshBasicMaterial({ color: 0x7ef0ea, wireframe: true, transparent: true, opacity: 0.35 }),
      );
      scene.add(globe);
      const points = new THREE.Points(
        new THREE.SphereGeometry(1.72, 28, 18),
        new THREE.PointsMaterial({ color: 0x9b8cff, size: 0.015, transparent: true, opacity: 0.8 }),
      );
      scene.add(points);
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-1.5, 0.2, 0.4),
        new THREE.Vector3(0, 1.6, 0.8),
        new THREE.Vector3(1.2, -0.3, 0.2),
      );
      const route = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(40)),
        new THREE.LineBasicMaterial({ color: 0x7ef0ea }),
      );
      scene.add(route);
      const light = new THREE.PointLight(0x9b8cff, 2, 12);
      light.position.set(2, 2, 3);
      scene.add(light);
      const onMove = (event: PointerEvent) => {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;
        camera.position.x = x * 0.6;
        camera.position.y = 0.2 - y * 0.4;
        camera.lookAt(0, 0, 0);
      };
      window.addEventListener("pointermove", onMove);
      const loop = () => {
        if (disposed || !renderer) return;
        globe.rotation.y += 0.002;
        points.rotation.y += 0.002;
        renderer.render(scene, camera);
        frame = requestAnimationFrame(loop);
      };
      loop();
      const cleanupMove = () => window.removeEventListener("pointermove", onMove);
      (canvas as HTMLCanvasElement & { __cleanup?: () => void }).__cleanup = cleanupMove;
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      const extra = (canvas as HTMLCanvasElement & { __cleanup?: () => void }).__cleanup;
      extra?.();
      renderer?.dispose();
    };
  }, []);

  return <canvas ref={ref} className="h-full w-full" aria-hidden="true" />;
}
