import { useState } from 'react';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import Game from './Game';
import { toast } from 'react-hot-toast';

const BOARD_SIZE = 8;

const Lobby = () => {
  const [gameId, setGameId] = useState('');
  const [playerId, setPlayerId] = useState('');

  const createGame = async () => {
    const newGameId = `game-${Date.now()}`;
    const newPlayerId = `player-${Math.random().toString(36).slice(2, 9)}`;
    
    try {
      await setDoc(doc(db, "games", newGameId), {
        board: Array(BOARD_SIZE ** 2).fill(''),
        currentPlayer: 'red',
        players: [newPlayerId],
        status: 'waiting'
      });
      
      setGameId(newGameId);
      setPlayerId(newPlayerId);
      toast.success(`Game created! ID: ${newGameId}`);
    } catch (error) {
      toast.error('Failed to create game');
      console.error("Error creating game:", error);
    }
  };

  const joinGame = async () => {
    if (!gameId) {
      toast.error('Please enter a Game ID');
      return;
    }

    try {
      const gameRef = doc(db, "games", gameId);
      const gameSnap = await getDoc(gameRef);
      
      if (!gameSnap.exists()) {
        toast.error('Game not found');
        return;
      }

      const gameData = gameSnap.data();
      if (gameData.players.length >= 2) {
        toast.error('Game is full');
        return;
      }

      const newPlayerId = `player-${Math.random().toString(36).slice(2, 9)}`;
      await updateDoc(gameRef, {
        players: arrayUnion(newPlayerId),
        status: 'playing'
      });
      
      setPlayerId(newPlayerId);
      toast.success('Joined game!');
    } catch (error) {
      toast.error('Failed to join game');
      console.error("Error joining game:", error);
    }
  };

  return (
    <div className="lobby">
      {!playerId ? (
        <div className="lobby-actions">
          <button onClick={createGame}>Create New Game</button>
          <div className="join-section">
            <input
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              placeholder="Enter Game ID"
            />
            <button onClick={joinGame}>Join Game</button>
          </div>
        </div>
      ) : (
        <Game gameId={gameId} playerId={playerId} />
      )}
    </div>
  );
};

export default Lobby;