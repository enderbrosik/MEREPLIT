import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Board3D } from './Board3D';
import { PlayerPieces3D } from './PlayerPieces3D';
import { Dice3D } from './Dice3D';

export function MonopolyScene() {
  return (
    <Canvas
      camera={{ position: [0, 20, 20], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#1a1a2e']} />
      
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.5} />
      
      <Board3D />
      <PlayerPieces3D />
      <Dice3D />
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={15}
        maxDistance={40}
        maxPolarAngle={Math.PI / 2.2}
      />
    </Canvas>
  );
}
