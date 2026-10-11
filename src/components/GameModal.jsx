import '../styels/GameModal.css'

export default function GameModal({ notice, onClose, onNewGame }) {
  if (!notice) return null
  const isFinished = notice.type === 'mate' || notice.type === 'draw'
  return <div className="modal-overlay"><div className={`modal-card modal-${notice.type}`} role="dialog" aria-modal="true">
    <div className="modal-symbol">{notice.type === 'mate' ? '♚' : notice.type === 'check' ? '♔' : '⚖'}</div>
    <p className="modal-eyebrow">AZYON: RIFT CHESS</p>
    <h2>{notice.type === 'mate' ? 'МАТ!' : notice.type === 'check' ? 'ШАХ!' : 'НИЧЬЯ'}</h2>
    <p className="modal-message">{notice.message}</p>
    {isFinished ? <button className="modal-button" onClick={onNewGame}>Начать новую игру</button> : <button className="modal-button" onClick={onClose}>Продолжить партию</button>}
  </div></div>
}
