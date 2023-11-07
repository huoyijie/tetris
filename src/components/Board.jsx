import { useContext, useEffect } from 'react'
import Tetromino from './Tetromino'
import Context from './Context'
import Cube from './Cube'
import { BOARD_HEIGHT, BOARD_WIDTH, BOARD_X_CUBES, BOARD_Y_CUBES } from '@/lib/tetris'

export default function () {
  const { currentTetromino, predictedTetromino, tetrominoes, down, next, gameOver } = useContext(Context)

  useEffect(() => {
    if (!gameOver) {
      let clear = () => { }
      if (currentTetromino) {
        const intervalId = setInterval(down, 500)
        clear = () => clearInterval(intervalId)
      } else {
        queueMicrotask(next)
      }
      return clear
    }
  }, [gameOver, currentTetromino])

  const bgCubes = []
  for (let i = 0; i < BOARD_X_CUBES; i++) {
    for (let j = 0; j < BOARD_Y_CUBES; j++) {
      bgCubes.push((<Cube key={`bgCube-${i}-${j}`} x={i} y={j} shadow={true} />))
    }
  }

  return (
    <div className='flex flex-col gap-4 items-center'>
      <div className='outline outline-1 outline-black rounded relative' style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}>
        {currentTetromino && (
          <Tetromino {...currentTetromino} active={true} />
        )}
        {predictedTetromino && (
          <Tetromino {...predictedTetromino} active={true} dashed={true} />
        )}
        {tetrominoes.map((tetromino, i) => (
          <Tetromino key={i} {...tetromino} />
        ))}
        {bgCubes}
        {gameOver && (
          <div className='absolute top-0 left-0 w-full h-full z-100 bg-white opacity-50 flex items-center justify-center'>
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