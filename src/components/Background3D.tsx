import { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Sphere, useTexture, Line, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Ribbon() {
  const ref = useRef<THREE.Mesh>(null!);
  const [scrollPos, setScrollPos] = useState(0);

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-15, 5, -5),
      new THREE.Vector3(-10, -2, 0),
      new THREE.Vector3(0, 3, 2),
      new THREE.Vector3(10, -5, -2),
      new THREE.Vector3(15, 2, 5),
    ]);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY / (totalScroll || 1);
      setScrollPos(currentScroll);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    ref.current.rotation.z = time * 0.05;
    ref.current.position.y = Math.sin(time * 0.3) * 2;
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, (scrollPos - 0.5) * 20, 0.05);
  });

  return (
    <mesh ref={ref}>
      <tubeGeometry args={[curve, 100, 0.6, 20, false]} />
      <MeshDistortMaterial
        color="#1e293b"
        speed={2}
        distort={0.4}
        radius={1}
        emissive="#0f172a"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

function FloatingShapes() {
  const shapes = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 15,
      ],
      color: ['#1e3a8a', '#1e40af', '#1e293b', '#0f172a'][Math.floor(Math.random() * 4)],
      scale: Math.random() * 0.4 + 0.1,
      speed: Math.random() * 0.3 + 0.1,
    }));
  }, []);

  return (
    <group>
      {shapes.map((shape, i) => (
        <Float key={i} speed={shape.speed} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={shape.position as any} scale={shape.scale}>
            {i % 3 === 0 ? (
              <coneGeometry args={[1, 2, 8]} />
            ) : i % 3 === 1 ? (
              <torusGeometry args={[1, 0.4, 8, 16]} />
            ) : (
              <sphereGeometry args={[1, 8, 8]} />
            )}
            <MeshWobbleMaterial 
              color={shape.color} 
              speed={1} 
              factor={0.4} 
              transparent 
              opacity={0.4} 
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function NeuralSatellites({ count = 40 }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);

  const { points, linePositions } = useMemo(() => {
    const p = [];
    for (let i = 0; i < count; i++) {
      const r = 2.8 + Math.random() * 0.5;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      p.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ));
    }

    const linePos: number[] = [];
    for (let i = 0; i < p.length; i++) {
      const connections = p
        .map((other, idx) => ({ idx, dist: p[i].distanceTo(other) }))
        .filter(c => c.dist < 1.5 && c.idx !== i)
        .slice(0, 2);
      
      connections.forEach(c => {
        linePos.push(p[i].x, p[i].y, p[i].z);
        linePos.push(p[c.idx].x, p[c.idx].y, p[c.idx].z);
      });
    }

    return { 
      points: new Float32Array(p.flatMap(v => [v.x, v.y, v.z])),
      linePositions: new Float32Array(linePos)
    };
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = time * 0.1;
    linesRef.current.rotation.y = time * 0.1;
  });

  return (
    <group>
      <Points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length / 3}
            array={points}
            itemSize={3}
          />
        </bufferGeometry>
        <PointMaterial
          transparent
          color="#60a5fa"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

function Earth() {
  const ref = useRef<THREE.Group>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);
  const [scrollPos, setScrollPos] = useState(0);

  const [colorMap, normalMap, specularMap, cloudsMap, lightsMap] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png',
  ]);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY / (totalScroll || 1);
      setScrollPos(currentScroll);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    ref.current.rotation.y = time * 0.05;
    cloudsRef.current.rotation.y = time * 0.07;

    let targetX = 0;
    let targetZ = 0;
    let targetScale = 1;

    if (scrollPos < 0.2) {
      targetX = 0;
      targetZ = 0;
      targetScale = 1.2;
    } else if (scrollPos < 0.4) {
      targetX = 3;
      targetZ = -2;
      targetScale = 0.8;
    } else if (scrollPos < 0.6) {
      targetX = -3;
      targetZ = -2;
      targetScale = 0.8;
    } else if (scrollPos < 0.8) {
      targetX = 3;
      targetZ = -2;
      targetScale = 0.8;
    } else {
      targetX = 0;
      targetZ = 0;
      targetScale = 1.2;
    }

    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, targetX, 0.05);
    ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, targetZ, 0.05);
    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.05));
  });

  return (
    <group ref={ref} rotation={[0.4, 0, 0.2]}>
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          roughnessMap={specularMap}
          emissiveMap={lightsMap}
          emissive={new THREE.Color('#ffcc00')}
          emissiveIntensity={1.2}
        />
      </mesh>
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.02, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.2, 64, 64]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <NeuralSatellites />
    </group>
  );
}

function StarField() {
  const ref = useRef<THREE.Points>(null!);
  const { positions, colors } = useMemo(() => {
    const count = 6000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorOptions = [
      new THREE.Color('#ffffff'), // White
      new THREE.Color('#60a5fa'), // Blue
      new THREE.Color('#7c3aed'), // Purple
      new THREE.Color('#1e293b'), // Bluish-black
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;

      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame(() => {
    ref.current.rotation.y += 0.00015;
    ref.current.rotation.x += 0.00005;
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        transparent
        vertexColors
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function Background3D() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <Suspense fallback={null}>
          <group 
            rotation={[mouse.y * 0.05, mouse.x * 0.05, 0]}
            position={[mouse.x * 0.1, -mouse.y * 0.1, 0]}
          >
            <ambientLight intensity={0.05} />
            <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
            <pointLight position={[-10, -10, -10]} intensity={0.2} color="#1e3a8a" />
            <Ribbon />
            <FloatingShapes />
            <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.1}>
              <Earth />
            </Float>
            <StarField />
          </group>
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
    </div>
  );
}
