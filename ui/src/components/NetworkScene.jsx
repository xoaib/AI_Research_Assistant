import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

export default function NetworkScene({ isThinking }) {
  const pointsRef = useRef();

  // Generate random points in a sphere
  const sphere = useMemo(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }), []);

  useFrame((state, delta) => {
    // Slowly rotate the entire point cloud
    if (pointsRef.current) {
      pointsRef.current.rotation.x -= delta / 10;
      pointsRef.current.rotation.y -= delta / 15;

      // Speed up rotation and pulse when agents are thinking
      if (isThinking) {
        pointsRef.current.rotation.y -= delta / 5;
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        pointsRef.current.scale.set(scale, scale, scale);
      } else {
        // Smoothly return to normal scale
        pointsRef.current.scale.lerp({ x: 1, y: 1, z: 1 }, 0.1);
      }
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Float speed={isThinking ? 4 : 1} rotationIntensity={isThinking ? 2 : 0.5} floatIntensity={isThinking ? 2 : 0.5}>
        <Points ref={pointsRef} positions={sphere} stride={3} frustumCulled={false}>
          <PointMaterial
            transparent
            color={isThinking ? "#818cf8" : "#4f46e5"}
            size={0.005}
            sizeAttenuation={true}
            depthWrite={false}
          />
        </Points>
      </Float>
    </group>
  );
}
