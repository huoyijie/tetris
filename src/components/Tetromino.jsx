import { I } from '@/lib/TetrominoType'
import Cube from './Cube'

function width() {
  return 480 / 24
}

function height() {
  return 600 / 24
}

function detectCollision({ x, y, rotate }, points, operation, onCollision) {
  switch (operation) {
    case 'ArrowUp':
      for (let [px, py] of points) {
        if (x + px < 0 || x + px >= width() || y + py < 0 || y + py >= height()) {
          const collision = { type: 'rotate', rotate: (rotate == 0) ? 3 : (rotate - 1) }
          onCollision(collision)
          return collision
        }
      }
      break

    case 'ArrowLeft':
      for (let [px] of points) {
        if (x + px < 0) {
          const collision = { type: 'left', x: x + 1 }
          onCollision(collision)
          return collision
        }
      }
      break

    case 'ArrowRight':
      for (let [px] of points) {
        if (x + px >= width()) {
          const collision = { type: 'right', x: x - 1 }
          onCollision(collision)
          return collision
        }
      }
      break

    case 'ArrowDown':
      for (let [_, py] of points) {
        if (y + py >= height()) {
          const collision = { type: 'down', y: y - 1 }
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

export default function ({ type, x, y, rotate = 0, operation, onCollision }) {
  let tetromino = <></>

  switch (type) {
    case I:
      let points = rotatePoints(rotate)

      if (operation) {
        const { type: collisionType, x: revertX, y: revertY, rotate: revertRotate } = detectCollision({ x, y, rotate }, points, operation, onCollision)
        if (collisionType) {
          switch (collisionType) {
            case 'left':
            case 'right':
              x = revertX
              break
            case 'down':
              y = revertY
              break
            case 'rotate':
              rotate = revertRotate
              points = rotatePoints(rotate)
              break
          }
        }
      }

      tetromino = (
        <div className='relative'>
          {points.map(([x, y], i) => (
            <Cube key={i} x={x} y={y} />
          ))}
        </div>
      )
      break;
  }

  return (
    <div className='max-w-min absolute' style={{ top: y * 24, left: x * 24 }}>
      {tetromino}
    </div>
  )
}