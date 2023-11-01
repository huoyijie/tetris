import { I } from '@/lib/TetrominoType'
import Cube from './Cube'
import { DOWN, LEFT, RIGHT, ROTATE } from '@/lib/OperationType'

function width() {
  return 480 / 24
}

function height() {
  return 600 / 24
}

function detectCollision(props) {
  const { x, y, rotate, operation, onCollision, points } = props
  switch (operation) {
    case ROTATE:
      for (let [px, py] of points) {
        if (x + px < 0 || x + px >= width() || y + py < 0 || y + py >= height()) {
          props.rotate = (rotate == 0) ? 3 : (rotate - 1)
          props.points = rotatePoints(props.rotate)
          const collision = { rotate: props.rotate }
          onCollision(collision)
          return collision
        }
      }
      break

    case LEFT:
      for (let [px] of points) {
        if (x + px < 0) {
          props.x = x + 1
          const collision = { x: props.x }
          onCollision(collision)
          return collision
        }
      }
      break

    case RIGHT:
      for (let [px] of points) {
        if (x + px >= width()) {
          props.x = x - 1
          const collision = { x: props.x }
          onCollision(collision)
          return collision
        }
      }
      break

    case DOWN:
      for (let [_, py] of points) {
        if (y + py >= height()) {
          props.y = y - 1
          const collision = { y: props.y }
          onCollision(collision)
          return collision
        }
      }
      break
  }

  return {}
}

function rotatePoints(rotate) {
  return (rotate == 0 || rotate == 2) ? [[0, 0], [1, 0], [2, 0], [3, 0]] : [[1, -1], [1, 0], [1, 1], [1, 2]]
}

export default function ({ type, x, y, rotate = 0, operation = false, onCollision }) {
  const props = { x, y, rotate, operation, onCollision, points: null }

  let tetromino = <></>
  switch (type) {
    case I:
      props.points = rotatePoints(rotate)

      if (operation) {
        detectCollision(props)
      }

      tetromino = (
        <div className='relative'>
          {props.points && props.points.map(([x, y], i) => (
            <Cube key={i} x={x} y={y} />
          ))}
        </div>
      )
      break;
  }

  return (
    <div className='max-w-min absolute' style={{ top: props.y * 24, left: props.x * 24 }}>
      {tetromino}
    </div>
  )
}