import { useEffect, useRef, useState } from 'react'
import Operation from '@/components/Operation'
import Context from '@/components/Context'
import Board from '@/components/Board'
import { fallDownTetromino, moveDownTetromino, moveLeftTetromino, moveRightTetromino, predictTetromino, randomTetromino, rotateTetromino } from '@/lib/tetris'
import Info from '@/components/Info'
import Head from 'next/head'

var audio

export default function Home() {
  const [tetrominoes, setTetrominoes] = useState([])
  const [currentTetromino, setCurrentTetromino] = useState()
  const predictedTetromino = predictTetromino(currentTetromino, tetrominoes)
  const [nextTetromino, setNextTetromino] = useState()
  const [score, setScore] = useState(0)
  const [eliminatedLines, setEliminatedLines] = useState(0)
  const [gameOver, setGameOver] = useState(true)
  const [time, setTime] = useState()
  const mainRef = useRef()
  const downIntervalRef = useRef()
  const clearDownInterval = () => {
    if (downIntervalRef.current) {
      clearInterval(downIntervalRef.current)
      downIntervalRef.current = null
    }
  }

  useEffect(() => {
    mainRef.current.focus()

    if (!audio) {
      audio = new Audio('tetris.mp3')
    }

    if (!gameOver) {
      audio.loop = true
      audio.play()
      return () => audio.pause()
    }
  }, [gameOver])

  useEffect(() => {
    if (!gameOver) {
      if (!currentTetromino) {
        queueMicrotask(next)
        return
      }

      downIntervalRef.current = setInterval(down, 500)
      return clearDownInterval
    }
  }, [gameOver, currentTetromino])

  const newGame = () => {
    if (gameOver) {
      setTetrominoes([])
      setCurrentTetromino(null)
      setNextTetromino(randomTetromino())
      setGameOver(false)
      setTime(new Date().getTime())
    }
  }

  const frozen = () => {
    if (currentTetromino) {
      tetrominoes.push(currentTetromino)
      setTetrominoes([...tetrominoes.filter(({ points }) => points.length > 0)])
    }
  }

  const next = () => {
    frozen()
    setCurrentTetromino(nextTetromino)
    setNextTetromino(randomTetromino())
  }

  const rotate = () => {
    setCurrentTetromino(rotateTetromino(currentTetromino, tetrominoes))
  }

  const onCollise = (elimiLines) => {
    if (elimiLines > 0) {
      setEliminatedLines(eliminatedLines + elimiLines)
      setScore(score + 10 * (elimiLines == 1 ? 1 : Math.pow(2, elimiLines)))
    }
    clearDownInterval()
    queueMicrotask(next)
  }

  const down = () => {
    setCurrentTetromino(
      moveDownTetromino(
        currentTetromino,
        tetrominoes,
        onCollise,
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

  const fallDown = () => {
    if (!gameOver && currentTetromino) {
      fallDownTetromino(
        currentTetromino,
        tetrominoes,
        onCollise,
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
    <Context.Provider value={{ currentTetromino, predictedTetromino, nextTetromino, tetrominoes, newGame, time, fallDown, rotate, down, left, right, next, gameOver, setGameOver, score, eliminatedLines }}>
      <Head>
        <title>Tetris</title>
        <link rel="icon" type="image/x-icon" href="favicon.ico"></link>
      </Head>
      <main ref={mainRef} className='w-full h-screen focus:outline-none flex gap-8 items-center justify-center' tabIndex={1} onKeyDown={onKeyDown}>
        <Operation />
        <Board />
        <Info />
      </main>
    </Context.Provider>
  )
}
