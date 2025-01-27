import { useEffect, useState, useCallback } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-hot-toast';
import './Game.css'

const SIMILAR_MATCH_SIZE = 4;
const BOARD_SIZE = 8; // Change this value to adjust board dimensions

interface GameState {
  board: string[];
  currentPlayer: 'red' | 'yellow';
  players: string[];
  status: 'waiting' | 'playing' | 'finished';
  winner?: 'red' | 'yellow';
}

interface GameProps {
  gameId: string;
  playerId: string;
}


interface GameIdDisplayProps {
  gameId: string;
}

const GameIdDisplay = ({ gameId }: GameIdDisplayProps) => {
  const [isCopied, setIsCopied] = useState(false);

  // Use useCallback to memoize the function
  const copyGameId = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(gameId);
      setIsCopied(true);
      
      // Reset copied status after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [gameId]); // Dependency array ensures function updates when gameId changes

  return (
    <div className="game-id-container">
      <h2 className="game-id">{gameId}</h2>
      <button className="copy-button" onClick={copyGameId}>
        📋
        {isCopied && <span className="copied-message">Copied!</span>}
      </button>
    </div>
  );
};


const Game = ({ gameId, playerId }: GameProps) => {
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const gameRef = doc(db, 'games', gameId);
    const unsubscribe = onSnapshot(gameRef, (doc) => {
      const data = doc.data() as GameState;
      setGameState(data);
      
      if (data.winner) {
        toast.success(`Game Over! ${data.winner} player wins!`);
      }
    });
    return () => unsubscribe();
  }, [gameId]);


  const checkWin = (board: string[], lastIndex: number): boolean => {
    const color = board[lastIndex];
    if (!color) return false; // Empty cell check
    
    const row = Math.floor(lastIndex / BOARD_SIZE);
    const col = lastIndex % BOARD_SIZE;
  
    // Direction check helper
    const checkDirection = (rowDelta: number, colDelta: number): number => {
      let count = 0;
      let r = row + rowDelta;
      let c = col + colDelta;
      
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r * BOARD_SIZE + c] === color) {
        count++;
        r += rowDelta;
        c += colDelta;
      }
      return count;
    };
  
    // Check all 4 directions
    return (
      // Horizontal
      (checkDirection(0, -1) + checkDirection(0, 1) + 1 >= SIMILAR_MATCH_SIZE) ||
      // Vertical
      (checkDirection(-1, 0) + checkDirection(1, 0) + 1 >= SIMILAR_MATCH_SIZE) ||
      // Diagonal: Top-Left to Bottom-Right
      (checkDirection(-1, -1) + checkDirection(1, 1) + 1 >= SIMILAR_MATCH_SIZE) ||
      // Diagonal: Top-Right to Bottom-Left
      (checkDirection(-1, 1) + checkDirection(1, -1) + 1 >= SIMILAR_MATCH_SIZE)
    );
  };

  const handleMove = async (index: number) => {
    if (!gameState || gameState.status === 'finished') return;
    
    if (gameState.players.length < 2) {
      toast.error('Waiting for opponent to join');
      return;
    }
    
    if (gameState.currentPlayer !== getPlayerColor()) {
      toast.error("It's not your turn!");
      return;
    }
    
    if (gameState.board[index]) {
      toast.error('Invalid move');
      return;
    }

    try {
      const newBoard = [...gameState.board];
      const playerColor = getPlayerColor();
      newBoard[index] = playerColor;

      const isWinner = checkWin(newBoard, index);
      
      await updateDoc(doc(db, 'games', gameId), {
        board: newBoard,
        currentPlayer: gameState.currentPlayer === 'red' ? 'yellow' : 'red',
        ...(isWinner && { 
          winner: playerColor,
          status: 'finished'
        })
      });

    } catch (error) {
      toast.error('Move failed');
      console.error('Error updating document:', error);
    }
  };

  const getPlayerColor = () => {
    if (!gameState) return 'spectator';
    return gameState.players[0] === playerId ? 'red' : 'yellow';
  };

  const restartGame = async () => {
    try {
      await updateDoc(doc(db, 'games', gameId), {
        board: Array(BOARD_SIZE ** 2).fill(''),
        currentPlayer: 'red',
        status: 'playing',
        winner: null
      });
    } catch (error) {
      console.error('Error restarting game:', error);
    }
  };

  if (!gameState) return <div>Loading game...</div>;

  return (
    <div className="game-container">
      <div className="game-info">
        <p>Your color: <span className={getPlayerColor()}>{getPlayerColor()}</span></p>
        <p>Players connected: {gameState.players.length}/2</p>
        <p>Current turn: {gameState.currentPlayer}</p>
      </div>

    {gameState.status === 'finished' ? (
    <div className="game-over">
        <h2>Game Over! {gameState.winner} wins!</h2>
        <button onClick={restartGame}>Play Again</button>
    </div>
    ) : gameState.players.length === 2 ? (
        <div className="board">
        {Array.from({ length: BOARD_SIZE }).map((_, rowIndex) => (
          <div key={rowIndex} className="row">
            {Array.from({ length: BOARD_SIZE }).map((_, colIndex) => {
              const index = rowIndex * BOARD_SIZE + colIndex;
              return (
                <div
                  key={index}
                  className="cell"
                  onClick={() => handleMove(index)}
                >
                  {gameState.board[index] && (
                    <div className={`piece ${gameState.board[index]}`} />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    ) : (
    <div className="waiting-message">
        <p>Share this Game ID with player 2:</p>
        <GameIdDisplay gameId={gameId} />
        <p>Waiting for opponent to join...</p>
    </div>
    )}

    </div>
  );
};

export default Game;