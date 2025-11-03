import { useMonopoly } from '@/lib/stores/useMonopoly';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PropertyCard } from './PropertyCard';
import { useAudio } from '@/lib/stores/useAudio';

export function GameUI() {
  const players = useMonopoly(state => state.players);
  const currentPlayerIndex = useMonopoly(state => state.currentPlayerIndex);
  const message = useMonopoly(state => state.message);
  const transactionLog = useMonopoly(state => state.transactionLog);
  const rollDice = useMonopoly(state => state.rollDice);
  const isRolling = useMonopoly(state => state.isRolling);
  const diceValues = useMonopoly(state => state.diceValues);
  const showPropertyCard = useMonopoly(state => state.showPropertyCard);
  const resetGame = useMonopoly(state => state.resetGame);
  const isMuted = useAudio(state => state.isMuted);
  const toggleMute = useAudio(state => state.toggleMute);

  const currentPlayer = players[currentPlayerIndex];

  return (
    <>
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        display: 'flex',
        gap: '10px',
        pointerEvents: 'none',
        zIndex: 10
      }}>
        <Card style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          color: 'white',
          pointerEvents: 'auto',
          backdropFilter: 'blur(10px)'
        }}>
          <CardContent style={{ padding: '15px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '10px', fontWeight: 'bold' }}>
              Current Turn: {currentPlayer?.username || ''}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.9rem' }}>
              <div>💰 Money: ${currentPlayer?.money || 0}</div>
              <div>🏠 Properties: {currentPlayer?.properties.length || 0}</div>
              <div>🎲 Position: {currentPlayer?.position || 0}</div>
              <div>
                {currentPlayer?.inJail ? '🔒 In Jail' : '✅ Free'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{
          width: '250px',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          color: 'white',
          pointerEvents: 'auto',
          backdropFilter: 'blur(10px)'
        }}>
          <CardContent style={{ padding: '15px' }}>
            <div style={{ marginBottom: '10px' }}>
              <strong style={{ fontSize: '1rem' }}>Dice:</strong>{' '}
              <span style={{ fontSize: '1.5rem' }}>
                {diceValues[0]} + {diceValues[1]} = {diceValues[0] + diceValues[1]}
              </span>
            </div>
            <Button
              onClick={rollDice}
              disabled={isRolling || showPropertyCard !== null}
              style={{ width: '100%', marginBottom: '8px' }}
            >
              {isRolling ? '🎲 Rolling...' : '🎲 Roll Dice'}
            </Button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                onClick={toggleMute}
                variant="outline"
                size="sm"
                style={{ flex: 1, background: 'rgba(255,255,255,0.1)', color: 'white' }}
              >
                {isMuted ? '🔇' : '🔊'}
              </Button>
              <Button
                onClick={resetGame}
                variant="destructive"
                size="sm"
                style={{ flex: 1 }}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        width: '300px',
        maxHeight: '250px',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        color: 'white',
        backdropFilter: 'blur(10px)',
        zIndex: 10
      }}>
        <CardContent style={{ padding: '15px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '10px', fontWeight: 'bold' }}>
            📜 Transaction Log
          </h3>
          <div style={{
            maxHeight: '180px',
            overflowY: 'auto',
            fontSize: '0.85rem',
            lineHeight: '1.6'
          }}>
            {transactionLog.map((log, index) => (
              <div key={index} style={{
                padding: '4px 0',
                borderBottom: index < transactionLog.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
              }}>
                {log}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        width: '280px',
        maxHeight: '400px',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        color: 'white',
        backdropFilter: 'blur(10px)',
        zIndex: 10
      }}>
        <CardContent style={{ padding: '15px', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '10px', fontWeight: 'bold' }}>
            👥 Players
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', paddingRight: '5px' }}>
            {players.map((player, index) => (
              <div
                key={player.id}
                style={{
                  padding: '8px',
                  backgroundColor: index === currentPlayerIndex ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '6px',
                  border: index === currentPlayerIndex ? '2px solid #4CAF50' : '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: player.color
                }} />
                <div style={{ flex: 1, fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 'bold' }}>{player.username}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                    ${player.money} • {player.properties.length} props
                  </div>
                </div>
                {player.isBankrupt && (
                  <span style={{ fontSize: '0.75rem', color: '#ff5252' }}>💀</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {message && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '20px 40px',
          borderRadius: '12px',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 100,
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 255, 255, 0.3)'
        }}>
          {message}
        </div>
      )}

      {showPropertyCard !== null && <PropertyCard />}
    </>
  );
}
