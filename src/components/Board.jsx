import { useContext } from 'react'
import Tetromino from './Tetromino'
import Context from './Context'
import { BOARD_HEIGHT, BOARD_WIDTH } from '@/lib/tetris'
import BoardBgCubes from './BoardBgCubes'

export default function Board() {
  const { currentTetromino, predictedTetromino, tetrominoes, gameOver } = useContext(Context)

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
        <BoardBgCubes />
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