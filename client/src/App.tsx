import { useEffect } from 'react';
import '@fontsource/inter';
import { useMonopoly } from './lib/stores/useMonopoly';
import { SetupScreen } from './components/monopoly/SetupScreen';
import { MonopolyScene } from './components/monopoly/MonopolyScene';
import { GameUI } from './components/monopoly/GameUI';
import { useAudio } from './lib/stores/useAudio';

function App() {
  const gamePhase = useMonopoly(state => state.gamePhase);
  const setBackgroundMusic = useAudio(state => state.setBackgroundMusic);
  const setHitSound = useAudio(state => state.setHitSound);
  const setSuccessSound = useAudio(state => state.setSuccessSound);

  useEffect(() => {
    const bgMusic = new Audio('/sounds/background.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    setBackgroundMusic(bgMusic);

    const hit = new Audio('/sounds/hit.mp3');
    setHitSound(hit);

    const success = new Audio('/sounds/success.mp3');
    setSuccessSound(success);
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {gamePhase === 'setup' && <SetupScreen />}
      
      {(gamePhase === 'playing' || gamePhase === 'ended') && (
        <>
          <MonopolyScene />
          <GameUI />
        </>
      )}
    </div>
  );
}

export default App;
