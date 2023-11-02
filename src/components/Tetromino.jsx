import { I } from '@/lib/TetrominoType'
import Cube from './Cube'
import { DOWN, FALLDOWN, LEFT, RIGHT, ROTATE } from '@/lib/OperationType'
import { useContext } from 'react'
import Context from './Context'

function emptyGrid({ x, y }, tetrominoes) {
  for (let { x: tx, y: ty, rotate } of tetrominoes) {
    for (let [px, py] of rotatePoints(rotate)) {
      if (tx + px == x && ty + py == y)
        return false
    }
  }
  return true
}

function detectCollision(props, tetrominoes, width, height) {
  const { x, y, rotate, operation, onCollision, points } = props
  switch (operation) {
    case ROTATE:
      for (let [px, py] of points) {
        if (x + px < 0 || x + px >= width() || y + py < 0 || y + py >= height() || !emptyGrid({ x: x + px, y: y + py }, tetrominoes)) {
          props.rotate = (rotate == 0) ? 3 : (rotate - 1)
          props.points = rotatePoints(props.rotate)
          onCollision({ rotate: props.rotate })
        }
      }
      break

    case LEFT:
      for (let [px, py] of points) {
        if (x + px < 0 || !emptyGrid({ x: x + px, y: y + py }, tetrominoes)) {
          props.x = x + 1
          onCollision({ x: props.x })
        }
      }
      break

    case RIGHT:
      for (let [px, py] of points) {
        if (x + px >= width() || !emptyGrid({ x: x + px, y: y + py }, tetrominoes)) {
          props.x = x - 1
          onCollision({ x: props.x })
        }
      }
      break

    case DOWN:
      for (let [px, py] of points) {
        if (y + py >= height() || !emptyGrid({ x: x + px, y: y + py }, tetrominoes)) {
          props.y = y - 1
          onCollision({ y: props.y, over: true })
        }
      }
      break

    case FALLDOWN:
      // todo
      if (y != 24) {
        onCollision({ y: 24, over: true })
      }
      break
  }
}

function rotatePoints(rotate) {
  return (rotate == 0 || rotate == 2) ? [[0, 0], [1, 0], [2, 0], [3, 0]] : [[1, -1], [1, 0], [1, 1], [1, 2]]
}

export default function ({ type, x, y, rotate = 0, active = false, operation = false, onCollision }) {
  const props = { x, y, rotate, operation, onCollision, points: null }
  const { tetrominoes, width, height } = useContext(Context)

  let tetromino = <></>
  switch (type) {
    case I:
      props.points = rotatePoints(rotate)

      if (operation) {
        detectCollision(props, tetrominoes, width, height)
      }

      tetromino = (
        <div className='relative'>
          {props.points && props.points.map(([x, y], i) => (
            <Cube key={i} x={x} y={y} active={active} />
          ))}
        </div>
      )
      break;
  }

  return (
    <div className='max-w-min absolute z-50' style={{ top: props.y * 24, left: props.x * 24 }}>
      {tetromino}
    </div>
  )
}