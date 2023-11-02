export default function ({ x, y, active = false, shadow = false }) {
  let borderColor = 'border-black'
  if (active) {
    borderColor = 'border-red-600'
  } else if (shadow) {
    borderColor = 'border-gray-200'
  }

  let bgColor = 'bg-black'
  if (active) {
    bgColor = 'bg-red-600'
  } else if (shadow) {
    bgColor = 'bg-gray-200'
  }

  return (
    <div className={`absolute border ${borderColor} rounded w-6 h-6 p-0.5`} style={{ top: y * 24, left: x * 24 }}>
      <div className={`w-full h-full rounded ${bgColor}`}></div>
    </div>
  )
}