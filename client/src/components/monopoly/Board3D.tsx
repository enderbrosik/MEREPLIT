import { useMonopoly } from '@/lib/stores/useMonopoly';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export function Board3D() {
  const boardSpaces = useMonopoly(state => state.boardSpaces);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#16213e" />
      </mesh>

      {boardSpaces.map((space) => (
        <group key={space.id} position={space.position}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.3, 0.2, 1.3]} />
            <meshStandardMaterial color={space.color || '#cccccc'} />
          </mesh>
          
          <Text
            position={[0, 0.2, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.15}
            color="black"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.2}
          >
            {space.name.length > 15 ? space.name.substring(0, 13) + '...' : space.name}
          </Text>
          
          {space.price && (
            <Text
              position={[0, 0.21, 0.4]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.12}
              color="#006400"
              anchorX="center"
              anchorY="middle"
            >
              ${space.price}
            </Text>
          )}
        </group>
      ))}
    </group>
  );
}
