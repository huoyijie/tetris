export default function ({ x, y }) {
  return (
    <div className='absolute border border-black rounded w-6 h-6 p-0.5' style={{ top: y * 24, left: x * 24 }}>
      <div className='w-full h-full rounded bg-black'></div>
    </div>
  )
}