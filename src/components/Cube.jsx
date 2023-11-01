export default function ({ x, y, active = false }) {
  return (
    <div className={`absolute border ${active ? 'border-red-600' : 'border-black'} rounded w-6 h-6 p-0.5`} style={{ top: y * 24, left: x * 24 }}>
      <div className={`w-full h-full rounded ${active ? 'bg-red-600' : 'bg-black'}`}></div>
    </div>
  )
}