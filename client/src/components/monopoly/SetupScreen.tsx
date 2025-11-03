import { useState } from 'react';
import { useMonopoly } from '@/lib/stores/useMonopoly';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SetupScreen() {
  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2']);
  const setupGame = useMonopoly(state => state.setupGame);

  const addPlayer = () => {
    if (playerNames.length < 8) {
      setPlayerNames([...playerNames, `Player ${playerNames.length + 1}`]);
    }
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > 2) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };

  const updatePlayerName = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const startGame = () => {
    setupGame(playerNames.filter(name => name.trim() !== ''));
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card style={{ maxWidth: '500px', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
        <CardHeader>
          <CardTitle style={{ textAlign: 'center', fontSize: '2rem', color: '#333' }}>
            🎲 DiceEmpire 🏰
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
              Enter player names (2-8 players)
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {playerNames.map((name, index) => (
                <div key={index} style={{ display: 'flex', gap: '8px' }}>
                  <Input
                    value={name}
                    onChange={(e) => updatePlayerName(index, e.target.value)}
                    placeholder={`Player ${index + 1}`}
                    style={{ flex: 1 }}
                  />
                  {playerNames.length > 2 && (
                    <Button
                      onClick={() => removePlayer(index)}
                      variant="destructive"
                      size="sm"
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              {playerNames.length < 8 && (
                <Button onClick={addPlayer} variant="outline" style={{ flex: 1 }}>
                  + Add Player
                </Button>
              )}
              <Button onClick={startGame} style={{ flex: 1 }}>
                Start Game
              </Button>
            </div>
          </div>

          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: '#f0f0f0',
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#666'
          }}>
            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>How to Play:</p>
            <ul style={{ marginLeft: '20px', lineHeight: '1.6' }}>
              <li>Roll dice to move around the board</li>
              <li>Buy properties when you land on them</li>
              <li>Pay rent when landing on others' properties</li>
              <li><strong>NEW: Your turn automatically ends after buying or declining a property!</strong></li>
              <li>Build houses and hotels to increase rent</li>
              <li>Last player standing wins!</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
