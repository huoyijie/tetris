import Cube from './Cube'

export default function Tetromino({ x, y, points, active = false, dashed = false }) {
  let zIndex = 'z-50'
  if (dashed) {
    zIndex = 'z-80'
  } else if (active) {
    zIndex = 'z-90'
  }

  return (
    <div className={`max-w-min absolute ${zIndex}`} style={{ top: y * 24, left: x * 24 }}>
      <div className='relative'>
        {points.map(([x, y], i) => (
          <Cube key={i} x={x} y={y} active={active} dashed={dashed} />
        ))}
      </div>
    </div>
  )
}