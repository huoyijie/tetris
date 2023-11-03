import Cube from './Cube'

export default function ({ x, y, points, active = false }) {
  return (
    <div className='max-w-min absolute z-50' style={{ top: y * 24, left: x * 24 }}>
      <div className='relative'>
        {points.map(([x, y], i) => (
          <Cube key={i} x={x} y={y} active={active} />
        ))}
      </div>
    </div>
  )
}