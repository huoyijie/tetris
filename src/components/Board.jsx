import { useContext, useEffect } from 'react'
import Tetromino from './Tetromino'
import Context from './Context'
import Cube from './Cube'

export default function () {
  const { currentTetromino, operation, tetrominoes, down, next, width, height, gameOver, setGameOver } = useContext(Context)

  useEffect(() => {
    if (!gameOver) {
      let clear = () => { }
      if (currentTetromino) {
        const intervalId = setInterval(down, 1000)
        clear = () => clearInterval(intervalId)
      } else {
        queueMicrotask(next)
      }
      return clear
    }
  }, [gameOver, currentTetromino])

  const onCollision = ({ x, y, rotate, over, gameOver }) => {
    if (Number.isInteger(x)) {
      currentTetromino.x = x
    }

    if (Number.isInteger(y)) {
      currentTetromino.y = y
    }

    if (Number.isInteger(rotate)) {
      currentTetromino.rotate = rotate
    }

    if (gameOver) {
      queueMicrotask(() => setGameOver(true))
    } else if (over) {
      queueMicrotask(next)
    }
  }

  const bgCubes = []
  for (let i = 0; i < width(); i++) {
    for (let j = 0; j < height(); j++) {
      bgCubes.push((<Cube key={`bgCube-${i}-${j}`} x={i} y={j} shadow={true} />))
    }
  }

  return (
    <div className='flex flex-col gap-4 items-center'>
      <div className='outline outline-1 outline-black rounded relative' style={{ width: 480, height: 600 }}>
        {currentTetromino && (
          <Tetromino {...currentTetromino} active={true} operation={operation} onCollision={onCollision} />
        )}
        {tetrominoes.map((tetromino, i) => (
          <Tetromino key={i} {...tetromino} />
        ))}
        {bgCubes}
        {gameOver && (
          <div className='absolute top-0 left-0 w-full h-full z-100 bg-white opacity-75 flex items-center justify-center'>
            <span className='text-4xl font-bold'>Game Over</span>
          </div>
        )}
      </div>
      <div className='flex gap-2 items-center'>
        <span className='text-gray-500'>https://github.com/huoyijie/tetris</span>
        <span className='text-sm text-red-600'>(开发中)</span>
      </div>
    </div>
  )
}