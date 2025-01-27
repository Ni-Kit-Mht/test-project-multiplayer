import { useState } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import './App.css'
import Lobby from './components/Lobby'
import { Toaster } from 'react-hot-toast'
import { FaGamepad } from 'react-icons/fa'
import ProfilePage from './components/ProfilePage'
import { AuthButtons } from './components/AuthButtons'

function App() {
  const [showRules, setShowRules] = useState(false)

  const NavBar = () => {
    return (
      <nav className="game-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <FaGamepad className="nav-icon" />
            <span>Multiplayer Board Game</span>
          </div>
          
          <div className="nav-links">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
            <AuthButtons />
          </div>
        </div>
      </nav>
    );
  };
  
  

  const GameScreen = () => (
    <>
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
    </>
  )

  return (
    <div className="app-container">
      <Toaster position="top-right" />
      
      {/* Navigation Bar */}
      <NavBar />

      <Routes>
        <Route path="/" element={<GameScreen />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App