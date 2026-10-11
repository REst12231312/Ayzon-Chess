import { useMemo, useState } from 'react'
import { Chess } from 'chess.js'
import GameModal from './components/GameModal'
import ChessBoard from './components/ChessBoard'
import GamePanel from './components/GamePanel'
import MoveHistory from './components/MoveHistory'
import '../src/styels/App.css'

const sideName = (color) => color === 'w' ? 'белые' : 'чёрные'

export default function App() {
  const [game, setGame] = useState(() => new Chess())
  const [notice, setNotice] = useState(null)
  const [selectedSquare, setSelectedSquare] = useState(null)
  const [captureStreak, setCaptureStreak] = useState({ w: 0, b: 0 })
  const [bestStreak, setBestStreak] = useState(0)
  const [copied, setCopied] = useState(false)

  const legalMoves = useMemo(() => selectedSquare ? game.moves({ square: selectedSquare, verbose: true }) : [], [game, selectedSquare])
  const legalSquares = legalMoves.map((move) => move.to)
  const history = game.history({ verbose: true })

  const makeMove = ({ from, to, promotion = 'q' }) => {
    if (game.isGameOver()) return false
    const nextGame = new Chess(game.fen())
    let move
    try {
      move = nextGame.move({ from, to, promotion })
    } catch {
      return false
    }
    setGame(nextGame)
    setSelectedSquare(null)

    const streak = { ...captureStreak }
    if (move.captured) {
      streak[move.color] += 1
      streak[move.color === 'w' ? 'b' : 'w'] = 0
      setCaptureStreak(streak)
      setBestStreak((best) => Math.max(best, streak[move.color]))
    } else {
      streak[move.color] = 0
      setCaptureStreak(streak)
    }

    if (nextGame.isCheckmate()) {
      setNotice({ type: 'mate', message: `Мат! ${sideName(nextGame.turn() === 'w' ? 'b' : 'w')} победили.` })
    } else if (nextGame.isStalemate()) {
      setNotice({ type: 'draw', message: 'Пат — партия завершилась вничью.' })
    } else if (nextGame.isDraw()) {
      setNotice({ type: 'draw', message: 'Партия завершилась вничью.' })
    } else if (nextGame.isCheck()) {
      setNotice({ type: 'check', message: `Король: ${sideName(nextGame.turn())} под шахом.` })
    } else {
      setNotice(null)
    }
    return true
  }

  const onPieceDrop = ({ sourceSquare, targetSquare }) => {
    if (!targetSquare || game.isGameOver()) return false
    const move = game.moves({ square: sourceSquare, verbose: true }).find((candidate) => candidate.to === targetSquare)
    if (!move) {
      const piece = game.get(targetSquare)
      if (piece?.color === game.turn()) setSelectedSquare(targetSquare)
      return false
    }
    const promotion = move.flags.includes('p') ? window.prompt('Превратить пешку в: ферзь, ладья, слон или конь?', 'ферзь') : 'q'
    if (move.flags.includes('p') && promotion === null) return false
    const promotionMap = { ферзь: 'q', ладья: 'r', слон: 'b', конь: 'n', q: 'q', r: 'r', b: 'b', n: 'n' }
    return makeMove({ from: sourceSquare, to: targetSquare, promotion: promotionMap[promotion.trim().toLowerCase()] || 'q' })
  }

  const onSquareClick = (square) => {
    if (!selectedSquare) {
      if (game.get(square)?.color === game.turn()) setSelectedSquare(square)
      return
    }
    if (square === selectedSquare) { setSelectedSquare(null); return }
    const move = game.moves({ square: selectedSquare, verbose: true }).find((candidate) => candidate.to === square)
    if (move) {
      const promotion = move.flags.includes('p') ? window.prompt('Превратить пешку в: ферзь, ладья, слон или конь?', 'ферзь') : 'q'
      if (promotion === null) return
      const promotionMap = { ферзь: 'q', ладья: 'r', слон: 'b', конь: 'n', q: 'q', r: 'r', b: 'b', n: 'n' }
      makeMove({ from: selectedSquare, to: square, promotion: promotionMap[promotion.trim().toLowerCase()] || 'q' })
    } else if (game.get(square)?.color === game.turn()) setSelectedSquare(square)
    else setSelectedSquare(null)
  }

  const newGame = () => {
    setGame(new Chess())
    setNotice(null)
    setSelectedSquare(null)
    setCaptureStreak({ w: 0, b: 0 })
  }

  const status = game.isCheckmate()
    ? `Мат · победили ${sideName(game.turn() === 'w' ? 'b' : 'w')}`
    : game.isStalemate() ? 'Пат · ничья'
      : game.isDraw() ? 'Ничья'
        : game.isCheck() ? `Шах · ход ${sideName(game.turn())}`
          : `Ход ${sideName(game.turn())}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <main className="app">
      <header className="header">
        <div className="logo">AZYON<span>:</span> RIFT CHESS</div>
        <div className="online">● ЛОКАЛЬНАЯ ИГРА</div>
      </header>
      <section className="game-layout">
        <div className="board-section">
          <div className="game-title">
            <p className="eyebrow">AZYON INCUBATOR · 2026</p>
            <h1>Шахматы нового измерения</h1>
            <p className="subtitle">Классические правила. Каждый ход меняет всё.</p>
          </div>
          <ChessBoard game={game} onPieceDrop={onPieceDrop} selectedSquare={selectedSquare} onSquareClick={onSquareClick} legalSquares={legalSquares} lastMove={history.at(-1)} />
          <MoveHistory moves={history} />
        </div>
        <GamePanel game={game} status={status} onNewGame={newGame} captureStreak={captureStreak} bestStreak={bestStreak} onCopyLink={copyLink} copied={copied} />
      </section>
      <footer className="footer">AZYON INCUBATOR 2026 <span>•</span> THINK BEYOND THE BOARD</footer>
      <GameModal notice={notice} onClose={() => setNotice(null)} onNewGame={newGame} />
    </main>
  )
}


