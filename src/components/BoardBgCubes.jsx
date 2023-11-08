import { BOARD_X_CUBES, BOARD_Y_CUBES } from "@/lib/tetris"
import Cube from "./Cube"

export default function BoardBgCubes() {
  const bgCubes = []
  for (let i = 0; i < BOARD_X_CUBES; i++) {
    for (let j = 0; j < BOARD_Y_CUBES; j++) {
      bgCubes.push((<Cube key={`bgCube-${i}-${j}`} x={i} y={j} shadow={true} />))
    }
  }

  return (
    <div className='w-full h-full'>
      {bgCubes}
    </div>
  )
}