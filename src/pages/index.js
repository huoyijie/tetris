import Tetromino from '@/components/Tetromino'
import { I } from '@/lib/TetrominoType'
import { useState } from 'react'

export default function Home() {
  const [currentTetromino, setCurrentTetromino] = useState({
    type: I,
    x: 8,
    y: 0,
    rotate: 0,
  })

  const [operation, setOperation] = useState()

  return (
    <main className='w-full h-screen focus:outline-none flex items-center justify-center' tabIndex='0' onKeyDown={({ code }) => {
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
      </div>
    </main>
  )
}