import { useState } from 'react'
import './App.css'
import Lobby from './components/Lobby'
import { Toaster } from 'react-hot-toast'
import { FaGamepad } from 'react-icons/fa'

function App() {
  const [showRules, setShowRules] = useState(false)

  return (
    <div className="app-container">
      <Toaster position="top-right" />
      
      <header className="app-header">
        <h1>Multiplayer Board Game <FaGamepad className="game-icon" /></h1>
      </header>

      <main className="game-container">
        <Lobby />
      </main>

      {showRules && (
        <div className="rules-popup">
          <h3>Game Rules</h3>
          <ol>
            <li>Players take turns placing their pieces</li>
            <li>Red always goes first</li>
            <li>Click any empty cell to place your piece</li>
            <li>Game continues until all cells are filled</li>
          </ol>
          <button onClick={() => setShowRules(false)}>Close</button>
        </div>
      )}

      <footer className="app-footer">
        <button 
          className="rules-button"
          onClick={() => setShowRules(!showRules)}
        >
          {showRules ? 'Hide Rules' : 'Show Rules'}
        </button>
      </footer>
    </div>
  )
}

export default App