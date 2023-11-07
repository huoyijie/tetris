import Tetromino from './Tetromino';
import { useContext } from 'react';
import Context from './Context';

export default function () {
  const { gameOver, nextTetromino } = useContext(Context)

  if (gameOver) return <></>

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex gap-6 justify-between items-center'>
        <span>得分</span>
        <span className='text-2xl font-bold text-red-600'>100</span>
      </div>
      <div className='flex gap-6 justify-between items-center'>
        <span>消除行</span>
        <span className='text-2xl font-bold text-red-600'>20</span>
      </div>
      {nextTetromino && (
        <div className='flex gap-6 justify-between items-center'>
          <div>下一个</div>
          <div className='relative'><Tetromino {...nextTetromino} x={-1} y={-1} /></div>
        </div>
      )}
    </div>
  )
}