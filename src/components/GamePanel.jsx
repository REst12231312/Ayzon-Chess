export default function GamePanel({ game, status, onNewGame, captureStreak, bestStreak, onCopyLink, copied }) {
  const finished = game.isGameOver()
  return <aside className="game-panel">
    <p className="eyebrow">CURRENT MATCH</p>
    <h2>Игровая сессия</h2>
    <div className="status-card"><span className="status-dot" /><div><p className="status-label">СТАТУС ПАРТИИ</p><strong>{status}</strong></div></div>
    <div className="player-card"><span className="player-icon white-piece">♔</span><div><strong>Белые</strong><p>Игрок 1 · серия взятий {captureStreak.w}</p></div>{game.turn() === 'w' && !finished && <span className="turn-tag">ХОД</span>}</div>
    <div className="player-card"><span className="player-icon black-piece">♚</span><div><strong>Чёрные</strong><p>Игрок 2 · серия взятий {captureStreak.b}</p></div>{game.turn() === 'b' && !finished && <span className="turn-tag">ХОД</span>}</div>
    <button className="new-game-button" onClick={onNewGame}><span>↻</span> Новая игра</button>
    <button className="share-button" onClick={onCopyLink}>{copied ? 'Ссылка скопирована ✓' : 'Поделиться ссылкой ↗'}</button>
    <div className="feature-note"><span className="feature-icon">✦</span><div><strong>Рифт-комбо</strong><p>Серия взятий подряд заряжает рифт. Побейте свой рекорд: {bestStreak} {bestStreak === 1 ? 'взятие' : 'взятия'}.</p></div></div>
  </aside>
}
