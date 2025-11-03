import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface BoardSpace {
  id: number;
  name: string;
  type: 'property' | 'railroad' | 'utility' | 'chance' | 'community_chest' | 'tax' | 'go' | 'jail' | 'go_to_jail' | 'free_parking' | 'special';
  color?: string;
  price?: number;
  rent?: number[];
  houseCost?: number;
  position: [number, number, number];
}

export interface Player {
  id: number;
  username: string;
  color: string;
  pieceType: number;
  position: number;
  money: number;
  properties: number[];
  houses: Map<number, number>;
  hotels: Set<number>;
  getOutOfJailCards: number;
  inJail: boolean;
  jailTurns: number;
  isActive: boolean;
  isBankrupt: boolean;
}

export interface Property {
  spaceId: number;
  owner: number | null;
  houses: number;
  hasHotel: boolean;
  isMortgaged: boolean;
}

export interface ChanceCard {
  id: number;
  text: string;
  action: string;
  value?: number;
}

export interface TradeOffer {
  fromPlayer: number;
  toPlayer: number;
  offeredProperties: number[];
  requestedProperties: number[];
  offeredMoney: number;
  requestedMoney: number;
}

interface MonopolyState {
  // Game state
  gamePhase: 'setup' | 'playing' | 'ended';
  players: Player[];
  currentPlayerIndex: number;
  boardSpaces: BoardSpace[];
  properties: Map<number, Property>;
  
  // Dice state
  diceValues: [number, number];
  isRolling: boolean;
  doublesCount: number;
  
  // Cards
  chanceCards: ChanceCard[];
  communityChestCards: ChanceCard[];
  usedChanceCards: number[];
  usedCommunityCards: number[];
  
  // UI state
  showPropertyCard: number | null;
  showTradeDialog: boolean;
  currentTrade: TradeOffer | null;
  message: string;
  transactionLog: string[];
  
  // Actions
  setupGame: (playerNames: string[]) => void;
  rollDice: () => void;
  movePlayer: (playerId: number, spaces: number) => void;
  handleLandedSpace: (playerId: number, spaceId: number) => void;
  buyProperty: (playerId: number, spaceId: number) => void;
  declineProperty: () => void;
  payRent: (playerId: number, ownerId: number, amount: number) => void;
  buildHouse: (playerId: number, spaceId: number) => void;
  buildHotel: (playerId: number, spaceId: number) => void;
  mortgageProperty: (playerId: number, spaceId: number) => void;
  unmortgageProperty: (playerId: number, spaceId: number) => void;
  drawChanceCard: (playerId: number) => void;
  drawCommunityChestCard: (playerId: number) => void;
  executeCardAction: (playerId: number, card: ChanceCard) => void;
  sendToJail: (playerId: number) => void;
  payJailBail: (playerId: number) => void;
  useGetOutOfJailCard: (playerId: number) => void;
  createTrade: (trade: TradeOffer) => void;
  acceptTrade: () => void;
  rejectTrade: () => void;
  declareBankruptcy: (playerId: number) => void;
  endTurn: () => void;
  addMessage: (msg: string) => void;
  resetGame: () => void;
}

// Define the board spaces based on the custom Monopoly board
const createBoardSpaces = (): BoardSpace[] => {
  const spaces: BoardSpace[] = [];
  const boardSize = 40;
  const spaceSize = 1.5;
  const totalSize = 10 * spaceSize;
  
  // Bottom side (0-9) - right to left
  for (let i = 0; i < 10; i++) {
    const x = totalSize / 2 - i * spaceSize;
    const z = -totalSize / 2;
    spaces.push({ id: i, name: `Space ${i}`, type: 'property', position: [x, 0, z], color: '#90EE90' });
  }
  
  // Left side (10-19) - bottom to top
  for (let i = 0; i < 10; i++) {
    const x = -totalSize / 2;
    const z = -totalSize / 2 + i * spaceSize;
    spaces.push({ id: i + 10, name: `Space ${i + 10}`, type: 'property', position: [x, 0, z], color: '#FFB6C1' });
  }
  
  // Top side (20-29) - left to right
  for (let i = 0; i < 10; i++) {
    const x = -totalSize / 2 + i * spaceSize;
    const z = totalSize / 2;
    spaces.push({ id: i + 20, name: `Space ${i + 20}`, type: 'property', position: [x, 0, z], color: '#FFD700' });
  }
  
  // Right side (30-39) - top to bottom
  for (let i = 0; i < 10; i++) {
    const x = totalSize / 2;
    const z = totalSize / 2 - i * spaceSize;
    spaces.push({ id: i + 30, name: `Space ${i + 30}`, type: 'property', position: [x, 0, z], color: '#87CEEB' });
  }
  
  // Custom board layout based on standard Monopoly
  const customSpaces: Partial<BoardSpace>[] = [
    { id: 0, name: 'GO', type: 'go' },
    { id: 1, name: 'Mediterranean Avenue', type: 'property', color: '#8B4513', price: 60, rent: [2, 10, 30, 90, 160, 250], houseCost: 50 },
    { id: 2, name: 'Community Chest', type: 'community_chest' },
    { id: 3, name: 'Baltic Avenue', type: 'property', color: '#8B4513', price: 60, rent: [4, 20, 60, 180, 320, 450], houseCost: 50 },
    { id: 4, name: 'Income Tax', type: 'tax', price: 200 },
    { id: 5, name: 'Reading Railroad', type: 'railroad', price: 200, rent: [25, 50, 100, 200] },
    { id: 6, name: 'Oriental Avenue', type: 'property', color: '#87CEEB', price: 100, rent: [6, 30, 90, 270, 400, 550], houseCost: 50 },
    { id: 7, name: 'Chance', type: 'chance' },
    { id: 8, name: 'Vermont Avenue', type: 'property', color: '#87CEEB', price: 100, rent: [6, 30, 90, 270, 400, 550], houseCost: 50 },
    { id: 9, name: 'Connecticut Avenue', type: 'property', color: '#87CEEB', price: 120, rent: [8, 40, 100, 300, 450, 600], houseCost: 50 },
    { id: 10, name: 'Jail (Just Visiting)', type: 'jail' },
    { id: 11, name: 'St. Charles Place', type: 'property', color: '#FF1493', price: 140, rent: [10, 50, 150, 450, 625, 750], houseCost: 100 },
    { id: 12, name: 'Electric Company', type: 'utility', price: 150 },
    { id: 13, name: 'States Avenue', type: 'property', color: '#FF1493', price: 140, rent: [10, 50, 150, 450, 625, 750], houseCost: 100 },
    { id: 14, name: 'Virginia Avenue', type: 'property', color: '#FF1493', price: 160, rent: [12, 60, 180, 500, 700, 900], houseCost: 100 },
    { id: 15, name: 'Pennsylvania Railroad', type: 'railroad', price: 200, rent: [25, 50, 100, 200] },
    { id: 16, name: 'St. James Place', type: 'property', color: '#FFA500', price: 180, rent: [14, 70, 200, 550, 750, 950], houseCost: 100 },
    { id: 17, name: 'Community Chest', type: 'community_chest' },
    { id: 18, name: 'Tennessee Avenue', type: 'property', color: '#FFA500', price: 180, rent: [14, 70, 200, 550, 750, 950], houseCost: 100 },
    { id: 19, name: 'New York Avenue', type: 'property', color: '#FFA500', price: 200, rent: [16, 80, 220, 600, 800, 1000], houseCost: 100 },
    { id: 20, name: 'Free Parking', type: 'free_parking' },
    { id: 21, name: 'Kentucky Avenue', type: 'property', color: '#FF0000', price: 220, rent: [18, 90, 250, 700, 875, 1050], houseCost: 150 },
    { id: 22, name: 'Chance', type: 'chance' },
    { id: 23, name: 'Indiana Avenue', type: 'property', color: '#FF0000', price: 220, rent: [18, 90, 250, 700, 875, 1050], houseCost: 150 },
    { id: 24, name: 'Illinois Avenue', type: 'property', color: '#FF0000', price: 240, rent: [20, 100, 300, 750, 925, 1100], houseCost: 150 },
    { id: 25, name: 'B&O Railroad', type: 'railroad', price: 200, rent: [25, 50, 100, 200] },
    { id: 26, name: 'Atlantic Avenue', type: 'property', color: '#FFFF00', price: 260, rent: [22, 110, 330, 800, 975, 1150], houseCost: 150 },
    { id: 27, name: 'Ventnor Avenue', type: 'property', color: '#FFFF00', price: 260, rent: [22, 110, 330, 800, 975, 1150], houseCost: 150 },
    { id: 28, name: 'Water Works', type: 'utility', price: 150 },
    { id: 29, name: 'Marvin Gardens', type: 'property', color: '#FFFF00', price: 280, rent: [24, 120, 360, 850, 1025, 1200], houseCost: 150 },
    { id: 30, name: 'Go To Jail', type: 'go_to_jail' },
    { id: 31, name: 'Pacific Avenue', type: 'property', color: '#008000', price: 300, rent: [26, 130, 390, 900, 1100, 1275], houseCost: 200 },
    { id: 32, name: 'North Carolina Avenue', type: 'property', color: '#008000', price: 300, rent: [26, 130, 390, 900, 1100, 1275], houseCost: 200 },
    { id: 33, name: 'Community Chest', type: 'community_chest' },
    { id: 34, name: 'Pennsylvania Avenue', type: 'property', color: '#008000', price: 320, rent: [28, 150, 450, 1000, 1200, 1400], houseCost: 200 },
    { id: 35, name: 'Short Line', type: 'railroad', price: 200, rent: [25, 50, 100, 200] },
    { id: 36, name: 'Chance', type: 'chance' },
    { id: 37, name: 'Park Place', type: 'property', color: '#0000FF', price: 350, rent: [35, 175, 500, 1100, 1300, 1500], houseCost: 200 },
    { id: 38, name: 'Luxury Tax', type: 'tax', price: 100 },
    { id: 39, name: 'Boardwalk', type: 'property', color: '#0000FF', price: 400, rent: [50, 200, 600, 1400, 1700, 2000], houseCost: 200 },
  ];
  
  customSpaces.forEach(custom => {
    Object.assign(spaces[custom.id!], custom);
  });
  
  return spaces;
};

// 40 unique piece types and colors
const PIECE_CONFIGS = [
  { type: 0, color: '#FF0000', name: 'Red Cube' },
  { type: 1, color: '#00FF00', name: 'Green Sphere' },
  { type: 2, color: '#0000FF', name: 'Blue Pyramid' },
  { type: 3, color: '#FFFF00', name: 'Yellow Cylinder' },
  { type: 4, color: '#FF00FF', name: 'Magenta Cone' },
  { type: 5, color: '#00FFFF', name: 'Cyan Torus' },
  { type: 6, color: '#FF8000', name: 'Orange Octahedron' },
  { type: 7, color: '#8000FF', name: 'Purple Dodecahedron' },
  { type: 8, color: '#FF0080', name: 'Pink Tetrahedron' },
  { type: 9, color: '#80FF00', name: 'Lime Icosahedron' },
  { type: 10, color: '#FF4040', name: 'Coral Box' },
  { type: 11, color: '#4040FF', name: 'Royal Sphere' },
  { type: 12, color: '#40FF40', name: 'Emerald Pyramid' },
  { type: 13, color: '#FFFF40', name: 'Gold Cylinder' },
  { type: 14, color: '#FF40FF', name: 'Fuchsia Cone' },
  { type: 15, color: '#40FFFF', name: 'Aqua Torus' },
  { type: 16, color: '#FFA040', name: 'Tangerine Octahedron' },
  { type: 17, color: '#A040FF', name: 'Violet Dodecahedron' },
  { type: 18, color: '#FF4080', name: 'Rose Tetrahedron' },
  { type: 19, color: '#A0FF40', name: 'Chartreuse Icosahedron' },
  { type: 20, color: '#804040', name: 'Maroon Cube' },
  { type: 21, color: '#408080', name: 'Teal Sphere' },
  { type: 22, color: '#804080', name: 'Plum Pyramid' },
  { type: 23, color: '#808040', name: 'Olive Cylinder' },
  { type: 24, color: '#FF8080', name: 'Salmon Cone' },
  { type: 25, color: '#8080FF', name: 'Periwinkle Torus' },
  { type: 26, color: '#80FF80', name: 'Mint Octahedron' },
  { type: 27, color: '#FFFF80', name: 'Lemon Dodecahedron' },
  { type: 28, color: '#FF80FF', name: 'Orchid Tetrahedron' },
  { type: 29, color: '#80FFFF', name: 'Sky Icosahedron' },
  { type: 30, color: '#FFC080', name: 'Peach Box' },
  { type: 31, color: '#C080FF', name: 'Lavender Sphere' },
  { type: 32, color: '#FFC0C0', name: 'Blush Pyramid' },
  { type: 33, color: '#C0FFC0', name: 'Seafoam Cylinder' },
  { type: 34, color: '#C0C0FF', name: 'Powder Cone' },
  { type: 35, color: '#FFFFC0', name: 'Cream Torus' },
  { type: 36, color: '#FFC0FF', name: 'Mauve Octahedron' },
  { type: 37, color: '#C0FFFF', name: 'Ice Dodecahedron' },
  { type: 38, color: '#A0A0A0', name: 'Silver Tetrahedron' },
  { type: 39, color: '#404040', name: 'Charcoal Icosahedron' },
];

const createChanceCards = (): ChanceCard[] => [
  { id: 1, text: 'Advance to GO. Collect $200', action: 'moveToGo', value: 0 },
  { id: 2, text: 'Bank pays you dividend of $50', action: 'collectMoney', value: 50 },
  { id: 3, text: 'Go back 3 spaces', action: 'moveBack', value: 3 },
  { id: 4, text: 'Go directly to Jail', action: 'goToJail' },
  { id: 5, text: 'Pay poor tax of $15', action: 'payMoney', value: 15 },
  { id: 6, text: 'Take a trip to Reading Railroad', action: 'moveToSpace', value: 5 },
  { id: 7, text: 'Advance to Illinois Avenue', action: 'moveToSpace', value: 24 },
  { id: 8, text: 'Advance to Boardwalk', action: 'moveToSpace', value: 39 },
  { id: 9, text: 'Get out of Jail Free', action: 'getOutOfJail' },
  { id: 10, text: 'Your building loan matures. Collect $150', action: 'collectMoney', value: 150 },
];

const createCommunityChestCards = (): ChanceCard[] => [
  { id: 11, text: 'Advance to GO. Collect $200', action: 'moveToGo', value: 0 },
  { id: 12, text: 'Bank error in your favor. Collect $200', action: 'collectMoney', value: 200 },
  { id: 13, text: 'Doctor\'s fee. Pay $50', action: 'payMoney', value: 50 },
  { id: 14, text: 'From sale of stock you get $50', action: 'collectMoney', value: 50 },
  { id: 15, text: 'Get out of Jail Free', action: 'getOutOfJail' },
  { id: 16, text: 'Go to Jail', action: 'goToJail' },
  { id: 17, text: 'Grand Opera Night. Collect $50', action: 'collectMoney', value: 50 },
  { id: 18, text: 'Holiday Fund matures. Collect $100', action: 'collectMoney', value: 100 },
  { id: 19, text: 'Income tax refund. Collect $20', action: 'collectMoney', value: 20 },
  { id: 20, text: 'You have won second prize in a beauty contest. Collect $10', action: 'collectMoney', value: 10 },
];

export const useMonopoly = create<MonopolyState>()(
  subscribeWithSelector((set, get) => ({
    gamePhase: 'setup',
    players: [],
    currentPlayerIndex: 0,
    boardSpaces: createBoardSpaces(),
    properties: new Map(),
    diceValues: [1, 1],
    isRolling: false,
    doublesCount: 0,
    chanceCards: createChanceCards(),
    communityChestCards: createCommunityChestCards(),
    usedChanceCards: [],
    usedCommunityCards: [],
    showPropertyCard: null,
    showTradeDialog: false,
    currentTrade: null,
    message: '',
    transactionLog: [],

    setupGame: (playerNames: string[]) => {
      const limitedNames = playerNames.slice(0, Math.min(playerNames.length, 40));
      
      const players: Player[] = limitedNames.map((name, index) => ({
        id: index,
        username: name,
        color: PIECE_CONFIGS[index].color,
        pieceType: PIECE_CONFIGS[index].type,
        position: 0,
        money: 1500,
        properties: [],
        houses: new Map(),
        hotels: new Set(),
        getOutOfJailCards: 0,
        inJail: false,
        jailTurns: 0,
        isActive: true,
        isBankrupt: false,
      }));

      const properties = new Map<number, Property>();
      get().boardSpaces.forEach(space => {
        if (space.type === 'property' || space.type === 'railroad' || space.type === 'utility') {
          properties.set(space.id, {
            spaceId: space.id,
            owner: null,
            houses: 0,
            hasHotel: false,
            isMortgaged: false,
          });
        }
      });

      set({
        players,
        properties,
        gamePhase: 'playing',
        currentPlayerIndex: 0,
        transactionLog: ['Game started! Roll the dice to begin.'],
      });
    },

    rollDice: () => {
      const state = get();
      if (state.isRolling) return;

      set({ isRolling: true });

      setTimeout(() => {
        const die1 = Math.floor(Math.random() * 6) + 1;
        const die2 = Math.floor(Math.random() * 6) + 1;
        const total = die1 + die2;
        const isDoubles = die1 === die2;

        const currentPlayer = state.players[state.currentPlayerIndex];
        
        if (currentPlayer.inJail) {
          if (isDoubles) {
            set({
              diceValues: [die1, die2],
              isRolling: false,
            });
            get().addMessage(`${currentPlayer.username} rolled doubles! Released from jail.`);
            set(state => ({
              players: state.players.map(p =>
                p.id === currentPlayer.id ? { ...p, inJail: false, jailTurns: 0 } : p
              ),
            }));
            get().movePlayer(currentPlayer.id, total);
          } else {
            const newJailTurns = currentPlayer.jailTurns + 1;
            set({
              diceValues: [die1, die2],
              isRolling: false,
              players: state.players.map(p =>
                p.id === currentPlayer.id ? { ...p, jailTurns: newJailTurns } : p
              ),
            });
            get().addMessage(`${currentPlayer.username} rolled ${total}. Still in jail (${newJailTurns}/3 turns).`);
            if (newJailTurns >= 3) {
              get().payJailBail(currentPlayer.id);
            } else {
              get().endTurn();
            }
          }
        } else {
          const newDoublesCount = isDoubles ? state.doublesCount + 1 : 0;
          
          set({
            diceValues: [die1, die2],
            isRolling: false,
            doublesCount: newDoublesCount,
          });

          get().addMessage(`${currentPlayer.username} rolled ${die1} + ${die2} = ${total}${isDoubles ? ' (Doubles!)' : ''}`);

          if (newDoublesCount === 3) {
            get().addMessage(`${currentPlayer.username} rolled doubles 3 times! Go to Jail!`);
            get().sendToJail(currentPlayer.id);
            set({ doublesCount: 0 });
          } else {
            get().movePlayer(currentPlayer.id, total);
          }
        }
      }, 1500);
    },

    movePlayer: (playerId: number, spaces: number) => {
      const state = get();
      const player = state.players.find(p => p.id === playerId);
      if (!player) return;

      const newPosition = (player.position + spaces) % 40;
      const passedGo = newPosition < player.position;

      set({
        players: state.players.map(p =>
          p.id === playerId ? { ...p, position: newPosition, money: passedGo ? p.money + 200 : p.money } : p
        ),
      });

      if (passedGo) {
        get().addMessage(`${player.username} passed GO! Collect $200`);
      }

      const landedSpace = state.boardSpaces[newPosition];
      get().addMessage(`${player.username} landed on ${landedSpace.name}`);

      setTimeout(() => {
        get().handleLandedSpace(playerId, newPosition);
      }, 1000);
    },

    handleLandedSpace: (playerId: number, spaceId: number) => {
      const state = get();
      const space = state.boardSpaces[spaceId];
      const player = state.players.find(p => p.id === playerId);
      if (!player) return;

      switch (space.type) {
        case 'property':
        case 'railroad':
        case 'utility':
          const property = state.properties.get(spaceId);
          if (property && property.owner === null) {
            set({ showPropertyCard: spaceId });
          } else if (property && property.owner !== null && property.owner !== playerId) {
            const owner = state.players.find(p => p.id === property.owner);
            if (owner && !property.isMortgaged) {
              let rent = space.rent![0];
              if (space.type === 'property') {
                rent = space.rent![property.houses] || space.rent![0];
              }
              get().payRent(playerId, property.owner, rent);
            } else {
              get().endTurn();
            }
          } else {
            get().endTurn();
          }
          break;
        case 'chance':
          get().drawChanceCard(playerId);
          break;
        case 'community_chest':
          get().drawCommunityChestCard(playerId);
          break;
        case 'tax':
          const taxAmount = space.price || 0;
          set({
            players: state.players.map(p =>
              p.id === playerId ? { ...p, money: p.money - taxAmount } : p
            ),
          });
          get().addMessage(`${player.username} paid $${taxAmount} in taxes`);
          get().endTurn();
          break;
        case 'go_to_jail':
          get().sendToJail(playerId);
          break;
        case 'go':
        case 'free_parking':
        case 'jail':
          get().endTurn();
          break;
      }
    },

    buyProperty: (playerId: number, spaceId: number) => {
      const state = get();
      const space = state.boardSpaces[spaceId];
      const player = state.players.find(p => p.id === playerId);
      if (!player || !space.price) return;

      if (player.money >= space.price) {
        set({
          players: state.players.map(p =>
            p.id === playerId
              ? { ...p, money: p.money - space.price!, properties: [...p.properties, spaceId] }
              : p
          ),
          properties: new Map(state.properties).set(spaceId, {
            ...state.properties.get(spaceId)!,
            owner: playerId,
          }),
          showPropertyCard: null,
        });
        get().addMessage(`${player.username} bought ${space.name} for $${space.price}`);
      } else {
        get().addMessage(`${player.username} cannot afford ${space.name}`);
        set({ showPropertyCard: null });
      }
      
      get().endTurn();
    },

    declineProperty: () => {
      const state = get();
      const currentPlayer = state.players[state.currentPlayerIndex];
      const propertyId = state.showPropertyCard;
      
      if (propertyId !== null) {
        const space = state.boardSpaces[propertyId];
        get().addMessage(`${currentPlayer.username} declined to buy ${space.name}`);
      }
      
      set({ showPropertyCard: null });
      get().endTurn();
    },

    payRent: (playerId: number, ownerId: number, amount: number) => {
      const state = get();
      const player = state.players.find(p => p.id === playerId);
      const owner = state.players.find(p => p.id === ownerId);
      if (!player || !owner) return;

      if (player.money >= amount) {
        set({
          players: state.players.map(p => {
            if (p.id === playerId) return { ...p, money: p.money - amount };
            if (p.id === ownerId) return { ...p, money: p.money + amount };
            return p;
          }),
        });
        get().addMessage(`${player.username} paid $${amount} rent to ${owner.username}`);
        get().endTurn();
      } else {
        get().addMessage(`${player.username} cannot afford rent! Bankruptcy!`);
        get().declareBankruptcy(playerId);
      }
    },

    buildHouse: (playerId: number, spaceId: number) => {
      const state = get();
      const space = state.boardSpaces[spaceId];
      const property = state.properties.get(spaceId);
      const player = state.players.find(p => p.id === playerId);
      
      if (!player || !property || !space.houseCost || property.houses >= 4) return;
      
      if (player.money >= space.houseCost) {
        set({
          players: state.players.map(p =>
            p.id === playerId ? { ...p, money: p.money - space.houseCost! } : p
          ),
          properties: new Map(state.properties).set(spaceId, {
            ...property,
            houses: property.houses + 1,
          }),
        });
        get().addMessage(`${player.username} built a house on ${space.name}`);
      }
    },

    buildHotel: (playerId: number, spaceId: number) => {
      const state = get();
      const space = state.boardSpaces[spaceId];
      const property = state.properties.get(spaceId);
      const player = state.players.find(p => p.id === playerId);
      
      if (!player || !property || !space.houseCost || property.houses !== 4) return;
      
      if (player.money >= space.houseCost) {
        set({
          players: state.players.map(p =>
            p.id === playerId ? { ...p, money: p.money - space.houseCost! } : p
          ),
          properties: new Map(state.properties).set(spaceId, {
            ...property,
            houses: 0,
            hasHotel: true,
          }),
        });
        get().addMessage(`${player.username} built a hotel on ${space.name}`);
      }
    },

    mortgageProperty: (playerId: number, spaceId: number) => {
      const state = get();
      const space = state.boardSpaces[spaceId];
      const property = state.properties.get(spaceId);
      if (!property || property.isMortgaged) return;

      const mortgageValue = (space.price || 0) / 2;
      set({
        players: state.players.map(p =>
          p.id === playerId ? { ...p, money: p.money + mortgageValue } : p
        ),
        properties: new Map(state.properties).set(spaceId, {
          ...property,
          isMortgaged: true,
        }),
      });
      get().addMessage(`Mortgaged ${space.name} for $${mortgageValue}`);
    },

    unmortgageProperty: (playerId: number, spaceId: number) => {
      const state = get();
      const space = state.boardSpaces[spaceId];
      const property = state.properties.get(spaceId);
      const player = state.players.find(p => p.id === playerId);
      if (!property || !player || !property.isMortgaged) return;

      const unmortgageCost = ((space.price || 0) / 2) * 1.1;
      if (player.money >= unmortgageCost) {
        set({
          players: state.players.map(p =>
            p.id === playerId ? { ...p, money: p.money - unmortgageCost } : p
          ),
          properties: new Map(state.properties).set(spaceId, {
            ...property,
            isMortgaged: false,
          }),
        });
        get().addMessage(`Unmortgaged ${space.name} for $${unmortgageCost.toFixed(0)}`);
      }
    },

    drawChanceCard: (playerId: number) => {
      const state = get();
      const availableCards = state.chanceCards.filter(c => !state.usedChanceCards.includes(c.id));
      
      if (availableCards.length === 0) {
        set({ usedChanceCards: [] });
      }
      
      const card = availableCards[Math.floor(Math.random() * availableCards.length)];
      set({ usedChanceCards: [...state.usedChanceCards, card.id] });
      
      get().addMessage(`Chance: ${card.text}`);
      get().executeCardAction(playerId, card);
    },

    drawCommunityChestCard: (playerId: number) => {
      const state = get();
      const availableCards = state.communityChestCards.filter(c => !state.usedCommunityCards.includes(c.id));
      
      if (availableCards.length === 0) {
        set({ usedCommunityCards: [] });
      }
      
      const card = availableCards[Math.floor(Math.random() * availableCards.length)];
      set({ usedCommunityCards: [...state.usedCommunityCards, card.id] });
      
      get().addMessage(`Community Chest: ${card.text}`);
      get().executeCardAction(playerId, card);
    },

    executeCardAction: (playerId: number, card: ChanceCard) => {
      const state = get();
      const player = state.players.find(p => p.id === playerId);
      if (!player) return;

      switch (card.action) {
        case 'collectMoney':
          set({
            players: state.players.map(p =>
              p.id === playerId ? { ...p, money: p.money + (card.value || 0) } : p
            ),
          });
          get().endTurn();
          break;
        case 'payMoney':
          set({
            players: state.players.map(p =>
              p.id === playerId ? { ...p, money: p.money - (card.value || 0) } : p
            ),
          });
          get().endTurn();
          break;
        case 'moveToGo':
          set({
            players: state.players.map(p =>
              p.id === playerId ? { ...p, position: 0, money: p.money + 200 } : p
            ),
          });
          get().endTurn();
          break;
        case 'moveToSpace':
          const newPos = card.value || 0;
          set({
            players: state.players.map(p =>
              p.id === playerId ? { ...p, position: newPos } : p
            ),
          });
          setTimeout(() => get().handleLandedSpace(playerId, newPos), 500);
          break;
        case 'goToJail':
          get().sendToJail(playerId);
          break;
        case 'getOutOfJail':
          set({
            players: state.players.map(p =>
              p.id === playerId ? { ...p, getOutOfJailCards: p.getOutOfJailCards + 1 } : p
            ),
          });
          get().endTurn();
          break;
        case 'moveBack':
          const backSpaces = card.value || 0;
          const currentPos = player.position;
          const newPosition = (currentPos - backSpaces + 40) % 40;
          set({
            players: state.players.map(p =>
              p.id === playerId ? { ...p, position: newPosition } : p
            ),
          });
          setTimeout(() => get().handleLandedSpace(playerId, newPosition), 500);
          break;
      }
    },

    sendToJail: (playerId: number) => {
      set({
        players: get().players.map(p =>
          p.id === playerId ? { ...p, position: 10, inJail: true, jailTurns: 0 } : p
        ),
        doublesCount: 0,
      });
      get().endTurn();
    },

    payJailBail: (playerId: number) => {
      const player = get().players.find(p => p.id === playerId);
      if (!player) return;

      if (player.money >= 50) {
        set({
          players: get().players.map(p =>
            p.id === playerId ? { ...p, money: p.money - 50, inJail: false, jailTurns: 0 } : p
          ),
        });
        get().addMessage(`${player.username} paid $50 bail`);
        get().endTurn();
      } else {
        get().addMessage(`${player.username} cannot afford bail!`);
        get().declareBankruptcy(playerId);
      }
    },

    useGetOutOfJailCard: (playerId: number) => {
      const player = get().players.find(p => p.id === playerId);
      if (!player || player.getOutOfJailCards <= 0) return;

      set({
        players: get().players.map(p =>
          p.id === playerId ? { ...p, getOutOfJailCards: p.getOutOfJailCards - 1, inJail: false, jailTurns: 0 } : p
        ),
      });
      get().addMessage(`${player.username} used a Get Out of Jail Free card`);
    },

    createTrade: (trade: TradeOffer) => {
      set({ currentTrade: trade, showTradeDialog: true });
    },

    acceptTrade: () => {
      const state = get();
      if (!state.currentTrade) return;

      const { fromPlayer, toPlayer, offeredProperties, requestedProperties, offeredMoney, requestedMoney } = state.currentTrade;

      set({
        players: state.players.map(p => {
          if (p.id === fromPlayer) {
            return {
              ...p,
              money: p.money - offeredMoney + requestedMoney,
              properties: [...p.properties.filter(prop => !offeredProperties.includes(prop)), ...requestedProperties],
            };
          }
          if (p.id === toPlayer) {
            return {
              ...p,
              money: p.money + offeredMoney - requestedMoney,
              properties: [...p.properties.filter(prop => !requestedProperties.includes(prop)), ...offeredProperties],
            };
          }
          return p;
        }),
        showTradeDialog: false,
        currentTrade: null,
      });
    },

    rejectTrade: () => {
      set({ showTradeDialog: false, currentTrade: null });
    },

    declareBankruptcy: (playerId: number) => {
      set({
        players: get().players.map(p =>
          p.id === playerId ? { ...p, isBankrupt: true, isActive: false } : p
        ),
      });
      get().endTurn();
    },

    endTurn: () => {
      const state = get();
      if (state.doublesCount > 0 && !state.players[state.currentPlayerIndex].inJail) {
        get().addMessage('Roll again for doubles!');
        return;
      }

      let nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
      while (state.players[nextIndex].isBankrupt) {
        nextIndex = (nextIndex + 1) % state.players.length;
      }

      set({
        currentPlayerIndex: nextIndex,
        doublesCount: 0,
        showPropertyCard: null,
      });

      get().addMessage(`${state.players[nextIndex].username}'s turn`);
    },

    addMessage: (msg: string) => {
      set(state => ({
        message: msg,
        transactionLog: [msg, ...state.transactionLog].slice(0, 20),
      }));
    },

    resetGame: () => {
      set({
        gamePhase: 'setup',
        players: [],
        currentPlayerIndex: 0,
        properties: new Map(),
        diceValues: [1, 1],
        isRolling: false,
        doublesCount: 0,
        usedChanceCards: [],
        usedCommunityCards: [],
        showPropertyCard: null,
        showTradeDialog: false,
        currentTrade: null,
        message: '',
        transactionLog: [],
      });
    },
  }))
);
