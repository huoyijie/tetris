import { I } from '@/lib/TetrominoType'
import { useEffect, useRef, useState } from 'react'
import { DOWN, LEFT, RIGHT, ROTATE } from '@/lib/OperationType'
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
  const [gameOver, setGameOver] = useState(false)
  const mainRef = useRef()

  useEffect(() => {
    mainRef.current.focus()
  }, [gameOver])

  const frozen = () => {
    if (currentTetromino) {
      tetrominoes.push(currentTetromino)
      setTetrominoes([...tetrominoes])
    }
  }
  const next = () => {
    frozen()
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

  const newGame = () => {
    setTetrominoes([])
    setCurrentTetromino(null)
    setOperation(null)
    setGameOver(false)
  }

  const fallDown = () => { }//setOperation(FALLDOWN)

  const onKeyDown = ({ code }) => {
    switch (code) {
      case 'KeyN':
        newGame()
        break

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
    <Context.Provider value={{ width, height, currentTetromino, tetrominoes, operation, newGame, fallDown, rotate, down, left, right, next, frozen, gameOver, setGameOver }}>
      <main ref={mainRef} className='w-full h-screen focus:outline-none flex gap-8 items-center justify-center' tabIndex={1} onKeyDown={onKeyDown}>
        <Board />
        <Operation />
      </main>
    </Context.Provider>
  )
}
