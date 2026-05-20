import React, { useState, useEffect } from 'react';
import MenuScreen from './components/MenuScreen';
import LevelSelect from './components/LevelSelect';
import GameUI from './components/GameUI';
import GameCanvas from './components/GameCanvas';
import SettingsModal from './components/SettingsModal';
import HelpModal from './components/HelpModal';
import { crazyGamesSDK } from './utils/crazyGamesSDK';
import { levels } from './utils/levels';
import { ShieldAlert, Award, RotateCcw, Home, HelpCircle } from 'lucide-react';

function App() {
  const [screen, setScreen] = useState('menu'); // 'menu', 'levels', 'game', 'gameover', 'victory'
  
  // Levels progression
  const [currentLevel, setCurrentLevel] = useState(levels[0]);
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [lives, setLives] = useState(3);
  const [resetCounter, setResetCounter] = useState(0);

  // Ad monetization & gameplay triggers
  const [completedLevelsCount, setCompletedLevelsCount] = useState(0);

  // Settings & Help
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [physicsConfig, setPhysicsConfig] = useState({
    strength: 280,
    bounce: 0.35,
    friction: 0.985,
    soundEnabled: true
  });

  // Initialize CrazyGames SDK on load
  useEffect(() => {
    crazyGamesSDK.init();
  }, []);

  // GameMonetize SDK pause/resume hooks
  useEffect(() => {
    window.onSDKPause = () => {
      console.log('[MagnaShift] SDK Pause received');
    };
    window.onSDKResume = () => {
      console.log('[MagnaShift] SDK Resume received');
    };
    return () => {
      window.onSDKPause = null;
      window.onSDKResume = null;
    };
  }, []);

  // Telemetry for Level Start/Stop
  useEffect(() => {
    if (screen === 'game') {
      crazyGamesSDK.notifyGameplayStart();
    }
    return () => {
      crazyGamesSDK.notifyGameplayStop();
    };
  }, [currentLevel.id, screen]);

  // Handle transition helper
  const transitionToNext = (nextLevel) => {
    if (nextLevel === 'victory' || !nextLevel) {
      setScreen('victory');
    } else {
      // Unlock next stage
      if (!unlockedLevels.includes(nextLevel.id)) {
        setUnlockedLevels(prev => [...prev, nextLevel.id]);
      }
      // Load next stage
      setCurrentLevel(nextLevel);
      setLives(3); // Recharge cores stability
      setResetCounter(prev => prev + 1);
      setScreen('game');
    }
  };

  // Handle stage completion
  const handleLevelComplete = () => {
    const nextLevelId = currentLevel.id + 1;
    const nextLevel = levels.find(l => l.id === nextLevelId);

    const nextCompletedCount = completedLevelsCount + 1;
    setCompletedLevelsCount(nextCompletedCount);

    if (nextCompletedCount % 2 === 0) {
      // Request midgame ad break from CrazyGames SDK
      crazyGamesSDK.requestAd('midgame', {
        onAdStarted: () => {
          console.log("[App] Midgame ad break started");
        },
        onAdFinished: () => {
          transitionToNext(nextLevel);
        },
        onAdError: (err) => {
          console.warn("[App] Midgame ad error:", err);
          transitionToNext(nextLevel); // Fallback to let player continue
        }
      });
    } else {
      // Direct transition
      transitionToNext(nextLevel);
    }
  };

  const handleGameOver = () => {
    setScreen('gameover');
  };

  const handleStartGame = () => {
    // Start from stage 1 or first locked level
    const maxUnlocked = Math.max(...unlockedLevels);
    const startLvl = levels.find(l => l.id === maxUnlocked) || levels[0];
    
    setCurrentLevel(startLvl);
    setLives(3);
    setScreen('game');
  };

  const handleSelectLevel = (lvl) => {
    setCurrentLevel(lvl);
    setLives(3);
    setScreen('game');
  };

  const handleRestartLevel = () => {
    setLives(3);
    setResetCounter(prev => prev + 1);
  };

  const handleSavePhysics = (newConfig) => {
    setPhysicsConfig(newConfig);
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--bg-dark)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Visual background overlays */}
      <div className="grid-overlay" />
      <div className="scanlines" />

      {/* Screen Router */}
      {screen === 'menu' && (
        <MenuScreen 
          onStartGame={handleStartGame}
          onSelectLevels={() => setScreen('levels')}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
        />
      )}

      {screen === 'levels' && (
        <LevelSelect 
          unlockedLevels={unlockedLevels}
          onSelectLevel={handleSelectLevel}
          onBack={() => setScreen('menu')}
        />
      )}

      {screen === 'game' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          padding: '20px'
        }}>
          <GameUI 
            level={currentLevel}
            lives={lives}
            onBackToMenu={() => setScreen('menu')}
            onResetLevel={handleRestartLevel}
            currentLevelIndex={currentLevel.id}
            totalLevels={levels.length}
          />
          <GameCanvas 
            key={`${currentLevel.id}-${resetCounter}`}
            currentLevel={{
              ...currentLevel,
              // Tweak level properties with custom geek sliders
              physics: {
                strength: physicsConfig.strength,
                minDist: 35,
                maxDist: 600
              }
            }}
            lives={lives}
            setLives={setLives}
            onLevelComplete={handleLevelComplete}
            onGameOver={handleGameOver}
            onReset={handleRestartLevel}
            soundEnabled={physicsConfig.soundEnabled}
          />
        </div>
      )}

      {screen === 'gameover' && (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 10
        }}>
          <div 
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '460px',
              padding: '40px 32px',
              textAlign: 'center',
              border: '1px solid rgba(255, 59, 48, 0.3)',
              boxShadow: '0 0 40px rgba(255, 59, 48, 0.1)',
              background: 'rgba(10, 5, 5, 0.9)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ff3b30',
              filter: 'drop-shadow(0 0 10px rgba(255, 59, 48, 0.5))',
              marginBottom: '20px'
            }}>
              <ShieldAlert size={56} />
            </div>

            <h2 style={{
              fontFamily: 'var(--font-hud)',
              color: '#ff3b30',
              fontSize: '2.0rem',
              fontWeight: '900',
              letterSpacing: '2px',
              marginBottom: '12px',
              textShadow: '0 0 12px rgba(255, 59, 48, 0.4)'
            }}>
              STABILITY CRITICAL
            </h2>

            <p style={{
              color: 'var(--text-muted)',
              fontSize: '0.95rem',
              lineHeight: '1.5',
              marginBottom: '36px'
            }}>
              All stability cores depleted. Magnetic core field collapsed inside stage: <strong>{currentLevel.name}</strong>.
            </p>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button 
                onClick={handleStartGame}
                className="neon-btn red-active"
                style={{ flex: 1, padding: '14px' }}
              >
                <RotateCcw size={16} /> REBOOT CORES
              </button>
              <button 
                onClick={() => setScreen('menu')}
                className="neon-btn"
                style={{ flex: 1, padding: '14px' }}
              >
                <Home size={16} /> MAIN MENU
              </button>
            </div>
          </div>
        </div>
      )}

      {screen === 'victory' && (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 10
        }}>
          <div 
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '520px',
              padding: '48px 36px',
              textAlign: 'center',
              border: '1px solid rgba(50, 215, 75, 0.3)',
              boxShadow: '0 0 50px rgba(50, 215, 75, 0.1)',
              background: 'rgba(5, 12, 8, 0.9)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#32d74b',
              filter: 'drop-shadow(0 0 15px rgba(50, 215, 75, 0.6))',
              marginBottom: '24px'
            }}>
              <Award size={64} />
            </div>

            <h2 style={{
              fontFamily: 'var(--font-hud)',
              color: '#32d74b',
              fontSize: '2.2rem',
              fontWeight: '900',
              letterSpacing: '2px',
              marginBottom: '16px',
              textShadow: '0 0 15px rgba(50, 215, 75, 0.4)'
            }}>
              SYSTEM ALIGNED
            </h2>

            <p style={{
              color: 'var(--text-main)',
              fontSize: '1rem',
              lineHeight: '1.6',
              marginBottom: '40px'
            }}>
              Incredible piloting! You successfully stabilized all <strong>20 Core sectors</strong> and resolved the magnetic grid maze. MagnaShift engine is fully synchronized.
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button 
                onClick={() => {
                  setUnlockedLevels([1]);
                  setScreen('levels');
                }}
                className="neon-btn cyan-active"
                style={{ padding: '14px 28px' }}
              >
                <RotateCcw size={16} /> RESET PROGRESS
              </button>
              
              <button 
                onClick={() => setScreen('menu')}
                className="neon-btn"
                style={{ padding: '14px 28px' }}
              >
                <Home size={16} /> MENU
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSavePhysics={handleSavePhysics}
        initialPhysics={physicsConfig}
      />

      {/* Help Modal */}
      <HelpModal 
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}

export default App;
