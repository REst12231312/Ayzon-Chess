export default function MoveHistory({ moves }) {
  const pairs = []
  for (let index = 0; index < moves.length; index += 2) pairs.push({ number: Math.floor(index / 2) + 1, white: moves[index], black: moves[index + 1] })
  return <section className="move-history"><p className="eyebrow">BATTLE LOG</p><h3>История ходов</h3>{pairs.length === 0 ? <p className="empty-history">Сделайте первый ход, чтобы начать партию.</p> : <div className="moves-list">{pairs.map((pair) => <div className="move-row" key={pair.number}><span className="move-number">{pair.number}.</span><span>{pair.white.san}</span><span>{pair.black?.san ?? '—'}</span></div>)}</div>}</section>
}
