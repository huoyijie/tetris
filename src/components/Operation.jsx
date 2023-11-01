import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
import { useContext } from 'react'
import Context from './Context'

export default function () {
  const { currentTetromino, setCurrentTetromino, nextTetromino, tetrominoes, setTetrominoes } = useContext(Context)

  return (
    <div className='flex flex-col gap-2 items-center'>
      <div className='border rounded-lg bg-slate-400 text-white px-6 py-3 max-w-min'><ChevronUpIcon className='w-6' /></div>
      <div className='flex gap-2'>
        <div className='border rounded-lg bg-slate-400 text-white px-6 py-3 max-w-min'><ChevronLeftIcon className='w-6' /></div>
        <div className='border rounded-lg bg-slate-400 text-white px-6 py-3 max-w-min'><ChevronDownIcon className='w-6' /></div>
        <div className='border rounded-lg bg-slate-400 text-white px-6 py-3 max-w-min'><ChevronRightIcon className='w-6' /></div>
      </div>
      <div className='w-full'><button className='w-full border rounded-lg px-6 py-3 bg-slate-400 text-white hover:bg-slate-600 active:bg-slate-400 focus:outline-none' onClick={() => {
        if (currentTetromino) {
          tetrominoes.push(currentTetromino)
          setTetrominoes([...tetrominoes])
        }
        setCurrentTetromino(nextTetromino())
      }}>Next</button></div>
    </div>
  )
}