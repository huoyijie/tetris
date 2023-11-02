import { useContext, useEffect } from 'react'
import Tetromino from './Tetromino'
import Context from './Context'

export default function () {
  const { currentTetromino, operation, tetrominoes, down, next } = useContext(Context)

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentTetromino) {
        down()
      } else {
        next()
      }
    }, 1000)
    return () => clearInterval(intervalId)
  }, [currentTetromino])

  const onCollision = ({ x, y, rotate, over }) => {
    if (Number.isInteger(x)) {
      currentTetromino.x = x
    }

    if (Number.isInteger(y)) {
      currentTetromino.y = y
    }

    if (Number.isInteger(rotate)) {
      currentTetromino.rotate = rotate
    }

    if (over) {
      queueMicrotask(next)
    }
  }

  return (
    <div className='flex flex-col gap-4 items-center'>
      <div className='w-[480px] h-[600px] border border-black rounded relative'>
        {currentTetromino && (
          <Tetromino {...currentTetromino} active={true} operation={operation} onCollision={onCollision} />
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
  )
}