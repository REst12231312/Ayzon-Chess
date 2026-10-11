import { Chessboard } from 'react-chessboard'

export default function ChessBoard({ game, onPieceDrop, selectedSquare, onSquareClick, legalSquares, lastMove }) {
  const squareStyles = Object.fromEntries([
    ...(lastMove ? [[lastMove.from, { background: 'rgba(167, 139, 250, .32)' }], [lastMove.to, { background: 'rgba(167, 139, 250, .42)' }]] : []),
    ...(selectedSquare ? [[selectedSquare, { background: 'rgba(139, 92, 246, .55)' }]] : []),
    ...legalSquares.map((square) => [square, { background: 'radial-gradient(circle, rgba(124,58,237,.55) 20%, transparent 24%)' }]),
  ])
  return <div className="board-frame"><Chessboard options={{ position: game.fen(), onPieceDrop, onSquareClick: ({ square }) => onSquareClick(square), squareStyles, boardStyle: { borderRadius: '6px', overflow: 'hidden' }, allowDragging: !game.isGameOver() }} /></div>
}
