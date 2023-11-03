import { useEffect, useRef, useState } from 'react'
import Operation from '@/components/Operation'
import Context from '@/components/Context'
import Board from '@/components/Board'
import { moveDownTetromino, moveLeftTetromino, moveRightTetromino, nextTetromino, rotateTetromino } from '@/lib/tetris'

export default function () {
  const [tetrominoes, setTetrominoes] = useState([])
  const [currentTetromino, setCurrentTetromino] = useState()
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
    setCurrentTetromino(rotateTetromino(currentTetromino, tetrominoes))
  }

  const down = () => {
    setCurrentTetromino(moveDownTetromino(currentTetromino, tetrominoes, () => queueMicrotask(next), () => setGameOver(true), setTetrominoes))
  }

  const left = () => {
    setCurrentTetromino(moveLeftTetromino(currentTetromino, tetrominoes))
  }

  const right = () => {
    setCurrentTetromino(moveRightTetromino(currentTetromino, tetrominoes))
  }

  const newGame = () => {
    setTetrominoes([])
    setCurrentTetromino(null)
    setGameOver(false)
  }

  const fallDown = () => { }

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
    <Context.Provider value={{ currentTetromino, tetrominoes, newGame, fallDown, rotate, down, left, right, next, frozen, gameOver, setGameOver }}>
      <main ref={mainRef} className='w-full h-screen focus:outline-none flex gap-8 items-center justify-center' tabIndex={1} onKeyDown={onKeyDown}>
        <Board />
        <Operation />
      </main>
    </Context.Provider>
  )
}
