import { I } from '@/lib/TetrominoType'
import { useState } from 'react'
import { DOWN, FALLDOWN, LEFT, RIGHT, ROTATE } from '@/lib/OperationType'
import Operation from '@/components/Operation'
import Context from '@/components/Context'
import Board from '@/components/Board'

function width() {
  return 480 / 24
}

function height() {
  return 600 / 24
}

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

  const rotate = () => {
    setCurrentTetromino({ ...currentTetromino, rotate: (currentTetromino.rotate + 1) % 4 })
    setOperation(ROTATE)
  }

  const down = () => {
    setCurrentTetromino({ ...currentTetromino, y: currentTetromino.y + 1 })
    setOperation(DOWN)
  }

  const left = () => {
    setCurrentTetromino({ ...currentTetromino, x: currentTetromino.x - 1 })
    setOperation(LEFT)
  }

  const right = () => {
    setCurrentTetromino({ ...currentTetromino, x: currentTetromino.x + 1 })
    setOperation(RIGHT)
  }

  const fallDown = () => { }//setOperation(FALLDOWN)

  const onKeyDown = ({ code }) => {
    switch (code) {
      case 'ArrowUp':
        rotate()
        break

      case 'ArrowDown':
        down()
        break

      case 'ArrowLeft':
        left()
        break

      case 'ArrowRight':
        right()
        break

      case 'Space':
        fallDown()
        break

      default:
        console.log(code)
    }
  }

  return (
    <Context.Provider value={{ width, height, currentTetromino, tetrominoes, operation, fallDown, rotate, down, left, right, next }}>
      <main className='w-full h-screen focus:outline-none flex gap-8 items-center justify-center' tabIndex={0} onKeyDown={onKeyDown}>
        <Board />
        <Operation />
      </main>
    </Context.Provider>
  )
}
