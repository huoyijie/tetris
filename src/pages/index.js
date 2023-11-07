import { useEffect, useRef, useState } from 'react'
import Operation from '@/components/Operation'
import Context from '@/components/Context'
import Board from '@/components/Board'
import { fallDownTetromino, moveDownTetromino, moveLeftTetromino, moveRightTetromino, nextTetromino, rotateTetromino } from '@/lib/tetris'

var audio

export default function () {
  const [tetrominoes, setTetrominoes] = useState([])
  const [currentTetromino, setCurrentTetromino] = useState()
  const [gameOver, setGameOver] = useState(true)
  const mainRef = useRef()

  useEffect(() => {
    mainRef.current.focus()

    if (!audio) {
      audio = new Audio('/tetris.mp3')
    }

    if (!gameOver) {
      audio.loop = true
      audio.play()
    }

    return () => audio.pause()
  }, [gameOver])

  const frozen = () => {
    if (currentTetromino) {
      tetrominoes.push(currentTetromino)
      setTetrominoes([...tetrominoes.filter(({ points }) => points.length > 0)])
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
    setCurrentTetromino(
      moveDownTetromino(
        currentTetromino,
        tetrominoes,
        () => queueMicrotask(next),
        () => setGameOver(true),
        setTetrominoes)
    )
  }

  const left = () => {
    setCurrentTetromino(moveLeftTetromino(currentTetromino, tetrominoes))
  }

  const right = () => {
    setCurrentTetromino(moveRightTetromino(currentTetromino, tetrominoes))
  }

  const newGame = () => {
    if (gameOver) {
      setTetrominoes([])
      setCurrentTetromino(null)
      setGameOver(false)
    }
  }

  const fallDown = () => {
    if (!gameOver && currentTetromino) {
      fallDownTetromino(
        currentTetromino,
        tetrominoes,
        () => queueMicrotask(next),
        () => setGameOver(true),
        setTetrominoes)
    }
  }

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
    <Context.Provider value={{ currentTetromino, tetrominoes, newGame, fallDown, rotate, down, left, right, next, gameOver, setGameOver }}>
      <main ref={mainRef} className='w-full h-screen focus:outline-none flex gap-8 items-center justify-center' tabIndex={1} onKeyDown={onKeyDown}>
        <Operation />
        <Board />
      </main>
    </Context.Provider>
  )
}
