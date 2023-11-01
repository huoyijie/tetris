import Tetromino from '@/components/Tetromino'
import { I } from '@/lib/TetrominoType'
import { useState } from 'react'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from '@heroicons/react/24/solid'

export default function Home() {
  const [tetrominoes, setTetrominoes] = useState([])
  const [currentTetromino, setCurrentTetromino] = useState({
    type: I,
    x: 8,
    y: 0,
    rotate: 0,
  })

  const [operation, setOperation] = useState()

  return (
    <main className='w-full h-screen focus:outline-none flex gap-8 items-center justify-center' tabIndex='0' onKeyDown={({ code }) => {
      switch (code) {
        case 'ArrowUp':
          setCurrentTetromino({ ...currentTetromino, rotate: (currentTetromino.rotate + 1) % 4 })
          setOperation(code)
          break

        case 'ArrowDown':
          setCurrentTetromino({ ...currentTetromino, y: currentTetromino.y + 1 })
          setOperation(code)
          break

        case 'ArrowLeft':
          setCurrentTetromino({ ...currentTetromino, x: currentTetromino.x - 1 })
          setOperation(code)
          break

        case 'ArrowRight':
          setCurrentTetromino({ ...currentTetromino, x: currentTetromino.x + 1 })
          setOperation(code)
          break

        default:
          console.log(code)
      }
    }}>

      <div className='flex flex-col gap-4 items-center'>
        <div className='w-[480px] h-[600px] border border-black rounded relative'>
          {currentTetromino && (
            <Tetromino {...currentTetromino} operation={operation} onCollision={({ x, y, rotate }) => {
              if (Number.isInteger(x)) {
                currentTetromino.x = x
              }

              if (Number.isInteger(y)) {
                currentTetromino.y = y
              }

              if (rotate) {
                currentTetromino.rotate = rotate
              }
            }} />
          )}
          {tetrominoes.map((tetromino, i) => (
            <Tetromino key={i} {...tetromino} />
          ))}
        </div>
        <div className='flex gap-2 items-center'>
          <span className='text-gray-500'>https://github.com/huoyijie/tetris</span>
          <span className='text-sm text-red-600'>(开发中)</span>
        </div>
      </div>

      <div className='flex flex-col gap-2 items-center'>
        <div className='border rounded-lg bg-slate-400 text-white px-6 py-3 max-w-min'><ChevronUpIcon className='w-6' /></div>
        <div className='flex gap-2'>
          <div className='border rounded-lg bg-slate-400 text-white px-6 py-3 max-w-min'><ChevronLeftIcon className='w-6' /></div>
          <div className='border rounded-lg bg-slate-400 text-white px-6 py-3 max-w-min'><ChevronDownIcon className='w-6' /></div>
          <div className='border rounded-lg bg-slate-400 text-white px-6 py-3 max-w-min'><ChevronRightIcon className='w-6' /></div>
        </div>
        <div className='w-full'><button className='w-full border rounded-lg px-6 py-3 bg-slate-400 text-white hover:bg-slate-600 active:bg-slate-400 focus:outline-none' onClick={() => {
          tetrominoes.push(currentTetromino)
          setTetrominoes([...tetrominoes])
          setCurrentTetromino({
            type: I,
            x: 8,
            y: 0,
            rotate: 0,
          })
        }}>Next</button></div>
      </div>
    </main>
  )
}
