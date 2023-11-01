import { I } from '@/lib/TetrominoType'
import { useState } from 'react'
import { DOWN, LEFT, RIGHT, ROTATE } from '@/lib/OperationType'
import Operation from '@/components/Operation'
import Context from '@/components/Context'
import Board from '@/components/Board'

function nextTetromino() {
  return {
    type: I,
    x: 8,
    y: 0,
    rotate: 0,
  }
}

export default function () {
  const [tetrominoes, setTetrominoes] = useState([])
  const [currentTetromino, setCurrentTetromino] = useState()
  const [operation, setOperation] = useState()

  const next = () => {
    if (currentTetromino) {
      tetrominoes.push(currentTetromino)
      setTetrominoes([...tetrominoes])
    }
    setCurrentTetromino(nextTetromino())
  }

  const onKeyDown = ({ code }) => {
    switch (code) {
      case 'ArrowUp':
        setCurrentTetromino({ ...currentTetromino, rotate: (currentTetromino.rotate + 1) % 4 })
        setOperation(ROTATE)
        break

      case 'ArrowDown':
        setCurrentTetromino({ ...currentTetromino, y: currentTetromino.y + 1 })
        setOperation(DOWN)
        break

      case 'ArrowLeft':
        setCurrentTetromino({ ...currentTetromino, x: currentTetromino.x - 1 })
        setOperation(LEFT)
        break

      case 'ArrowRight':
        setCurrentTetromino({ ...currentTetromino, x: currentTetromino.x + 1 })
        setOperation(RIGHT)
        break
      case 'KeyN':
        next()
        break

      default:
        console.log(code)
    }
  }

  return (
    <Context.Provider value={{ currentTetromino, tetrominoes, operation, next }}>
      <main className='w-full h-screen focus:outline-none flex gap-8 items-center justify-center' tabIndex={0} onKeyDown={onKeyDown}>
        <Board />
        <Operation />
      </main>
    </Context.Provider>
  )
}
