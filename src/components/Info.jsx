import Tetromino from './Tetromino'
import { useContext } from 'react'
import Context from './Context'
import { I } from '@/lib/TetrominoType'
import t from '@/lib/time'

const { h, m, s } = t()

export default function () {
  const { gameOver, time, nextTetromino, score, eliminatedLines } = useContext(Context)

  if (gameOver) return <></>
  const duration = new Date().getTime() - time

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex gap-6 justify-between items-center'>
        <span>Time</span>
        <span className='text-2xl font-bold text-red-600'>{h(duration)}:{m(duration)}:{s(duration)}</span>
      </div>

      <div className='flex gap-6 justify-between items-center'>
        <span>Score</span>
        <span className='text-2xl font-bold text-red-600'>{score}</span>
      </div>

      <div className='flex gap-6 justify-between items-center'>
        <span>Eliminate Lines</span>
        <span className='text-2xl font-bold text-red-600'>{eliminatedLines}</span>
      </div>

      {nextTetromino && (
        <div className='flex gap-6 justify-between items-center'>
          <div>下一个</div>
          <div className='relative'><Tetromino {...nextTetromino} x={-1} y={nextTetromino.type == I ? 0 : -1} /></div>
        </div>
      )}
    </div>
  )
}