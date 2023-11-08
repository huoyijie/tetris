import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
import { useContext } from 'react'
import Context from './Context'

export default function Operation() {
  const { gameOver, newGame, down, left, right, rotate, fallDown } = useContext(Context)

  return (
    <div className='flex flex-col gap-8 items-center'>

      {gameOver && (
        <div className='w-full'>
          <button className='w-full border rounded-lg px-6 py-3 bg-blue-400 text-white focus:outline-none hover:bg-blue-600 active:bg-blue-400' onClick={newGame}>New Game (N)</button>
        </div>
      )}

      {!gameOver && (
        <>
          <div className='flex flex-col gap-2 items-center'>
            <button className='border rounded-lg bg-blue-400 text-white px-6 py-3 max-w-min focus:outline-none hover:bg-blue-600 active:bg-blue-400' onClick={rotate}><ChevronUpIcon className='w-6' /></button>
            <div className='flex gap-2'>
              <button className='border rounded-lg bg-blue-400 text-white px-6 py-3 max-w-min focus:outline-none hover:bg-blue-600 active:bg-blue-400' onClick={left}><ChevronLeftIcon className='w-6' /></button>
              <button className='border rounded-lg bg-blue-400 text-white px-6 py-3 max-w-min focus:outline-none hover:bg-blue-600 active:bg-blue-400' onClick={down}><ChevronDownIcon className='w-6' /></button>
              <button className='border rounded-lg bg-blue-400 text-white px-6 py-3 max-w-min focus:outline-none hover:bg-blue-600 active:bg-blue-400' onClick={right}><ChevronRightIcon className='w-6' /></button>
            </div>
          </div>

          <div className='w-full'>
            <button className='w-full border rounded-lg px-6 py-3 bg-blue-400 text-white focus:outline-none hover:bg-blue-600 active:bg-blue-400' onClick={fallDown}>Fall down (Space)</button>
          </div>
        </>
      )}

    </div>
  )
}