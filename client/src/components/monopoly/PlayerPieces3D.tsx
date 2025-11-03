import { useMonopoly } from '@/lib/stores/useMonopoly';
import { useMemo } from 'react';

const PIECE_SHAPES = [
  'box', 'sphere', 'cone', 'cylinder', 'tetrahedron', 'octahedron', 
  'dodecahedron', 'icosahedron', 'torus', 'torusKnot'
];

export function PlayerPieces3D() {
  const players = useMonopoly(state => state.players);
  const boardSpaces = useMonopoly(state => state.boardSpaces);

  return (
    <group>
      {players.map((player, index) => {
        const space = boardSpaces[player.position];
        if (!space) return null;

        const offset = index * 0.3 - (players.length * 0.15);
        const position: [number, number, number] = [
          space.position[0] + offset,
          0.5,
          space.position[2]
        ];

        const pieceType = player.pieceType % PIECE_SHAPES.length;

        return (
          <mesh key={player.id} position={position} castShadow>
            {pieceType === 0 && <boxGeometry args={[0.4, 0.4, 0.4]} />}
            {pieceType === 1 && <sphereGeometry args={[0.25, 16, 16]} />}
            {pieceType === 2 && <coneGeometry args={[0.25, 0.5, 8]} />}
            {pieceType === 3 && <cylinderGeometry args={[0.2, 0.2, 0.5, 16]} />}
            {pieceType === 4 && <tetrahedronGeometry args={[0.3]} />}
            {pieceType === 5 && <octahedronGeometry args={[0.3]} />}
            {pieceType === 6 && <dodecahedronGeometry args={[0.25]} />}
            {pieceType === 7 && <icosahedronGeometry args={[0.25]} />}
            {pieceType === 8 && <torusGeometry args={[0.2, 0.08, 16, 32]} />}
            {pieceType === 9 && <torusKnotGeometry args={[0.15, 0.05, 64, 8]} />}
            <meshStandardMaterial 
              color={player.color} 
              emissive={player.color}
              emissiveIntensity={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
}
