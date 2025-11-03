import { useMonopoly } from '@/lib/stores/useMonopoly';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PropertyCard() {
  const showPropertyCard = useMonopoly(state => state.showPropertyCard);
  const boardSpaces = useMonopoly(state => state.boardSpaces);
  const currentPlayerIndex = useMonopoly(state => state.currentPlayerIndex);
  const players = useMonopoly(state => state.players);
  const buyProperty = useMonopoly(state => state.buyProperty);
  const declineProperty = useMonopoly(state => state.declineProperty);

  if (showPropertyCard === null) return null;

  const space = boardSpaces[showPropertyCard];
  const currentPlayer = players[currentPlayerIndex];

  if (!space || !currentPlayer) return null;

  const canAfford = currentPlayer.money >= (space.price || 0);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    }}>
      <Card style={{
        width: '450px',
        maxWidth: '90vw',
        backgroundColor: 'white',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
      }}>
        <CardHeader style={{
          backgroundColor: space.color || '#cccccc',
          color: '#fff',
          padding: '20px',
          textAlign: 'center'
        }}>
          <CardTitle style={{ fontSize: '1.5rem', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            {space.name}
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: '25px' }}>
          <div style={{
            marginBottom: '20px',
            fontSize: '1.1rem',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#2e7d32',
              marginBottom: '10px'
            }}>
              ${space.price}
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>
              {space.type === 'property' && '🏠 Property'}
              {space.type === 'railroad' && '🚂 Railroad'}
              {space.type === 'utility' && '💡 Utility'}
            </div>
          </div>

          {space.rent && space.rent.length > 0 && (
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                Rent:
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.8' }}>
                {space.type === 'property' && (
                  <>
                    <div>Base Rent: ${space.rent[0]}</div>
                    {space.rent[1] && <div>1 House: ${space.rent[1]}</div>}
                    {space.rent[2] && <div>2 Houses: ${space.rent[2]}</div>}
                    {space.rent[3] && <div>3 Houses: ${space.rent[3]}</div>}
                    {space.rent[4] && <div>4 Houses: ${space.rent[4]}</div>}
                    {space.rent[5] && <div>Hotel: ${space.rent[5]}</div>}
                    {space.houseCost && (
                      <div style={{ marginTop: '8px', fontWeight: 'bold', color: '#1976d2' }}>
                        House Cost: ${space.houseCost}
                      </div>
                    )}
                  </>
                )}
                {space.type !== 'property' && <div>Base Rent: ${space.rent[0]}</div>}
              </div>
            </div>
          )}

          <div style={{
            marginBottom: '15px',
            padding: '12px',
            backgroundColor: canAfford ? '#e8f5e9' : '#ffebee',
            borderRadius: '6px',
            textAlign: 'center',
            fontSize: '0.95rem',
            color: canAfford ? '#2e7d32' : '#c62828'
          }}>
            {canAfford ? (
              <>💰 You have ${currentPlayer.money}</>
            ) : (
              <>❌ Insufficient funds (You have ${currentPlayer.money})</>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              onClick={() => buyProperty(currentPlayer.id, showPropertyCard)}
              disabled={!canAfford}
              style={{
                flex: 1,
                fontSize: '1rem',
                padding: '12px',
                backgroundColor: canAfford ? '#4CAF50' : '#ccc',
                color: 'white'
              }}
            >
              💰 Buy Property
            </Button>
            <Button
              onClick={declineProperty}
              variant="outline"
              style={{
                flex: 1,
                fontSize: '1rem',
                padding: '12px',
                borderColor: '#f44336',
                color: '#f44336'
              }}
            >
              ❌ Decline
            </Button>
          </div>

          <div style={{
            marginTop: '15px',
            fontSize: '0.8rem',
            color: '#999',
            textAlign: 'center',
            fontStyle: 'italic'
          }}>
            ⏱️ Your turn will end after you buy or decline
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
