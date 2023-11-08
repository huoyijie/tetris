export default function Cube({ x, y, active = false, dashed = false, shadow = false }) {
  let borderColor = 'border-black'
  if (dashed) {
    borderColor = 'border-red-300'
  } else if (active) {
    borderColor = 'border-red-600'
  } else if (shadow) {
    borderColor = 'border-gray-200'
  }

  let bgColor = 'bg-black'
  if (dashed) {
    bgColor = 'bg-red-300'
  } else if (active) {
    bgColor = 'bg-red-600'
  } else if (shadow) {
    bgColor = 'bg-gray-200'
  }

  return (
    <div className={`absolute border ${dashed ? 'border-dashed' : ''} ${borderColor} rounded w-6 h-6 p-0.5`} style={{ top: y * 24, left: x * 24 }}>
      <div className={`w-full h-full rounded ${bgColor}`}></div>
    </div>
  )
}