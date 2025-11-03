import { useMonopoly } from '@/lib/stores/useMonopoly';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

export function Dice3D() {
  const diceValues = useMonopoly(state => state.diceValues);
  const isRolling = useMonopoly(state => state.isRolling);
  const die1Ref = useRef<THREE.Mesh>(null);
  const die2Ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (isRolling && die1Ref.current && die2Ref.current) {
      die1Ref.current.rotation.x += 0.15;
      die1Ref.current.rotation.y += 0.15;
      die2Ref.current.rotation.x += 0.12;
      die2Ref.current.rotation.y += 0.17;
    }
  });

  return (
    <group position={[0, 2, 0]}>
      <mesh ref={die1Ref} position={[-0.6, 0, 0]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      <mesh ref={die2Ref} position={[0.6, 0, 0]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}
