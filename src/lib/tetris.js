import { DOWN, LEFT, RIGHT, ROTATE } from './OperationType'
import { I, J, L, O, S, T, Z } from './TetrominoType'

const CUBE_SIZE = 24
const TETROMINOES = [I, J, L, O, S, T, Z]

function randomInt(max) {
  return Math.floor(Math.random() * max)
}

function initX(type) {
  const middle = BOARD_X_CUBES / 2
  switch (type) {
    case I:
    case L:
    case T:
      return middle - 2
    case J:
    case O:
    case S:
    case Z:
      return middle - 1
  }
}

function initPoints(type) {
  switch (type) {
    case I:
      return [[0, 0], [1, 0], [2, 0], [3, 0]]
    case J:
      return [[0, 0], [0, 1], [1, 1], [2, 1]]
    case L:
      return [[0, 1], [1, 1], [2, 1], [2, 0]]
    case O:
      return [[0, 0], [0, 1], [1, 1], [1, 0]]
    case S:
      return [[0, 1], [1, 1], [1, 0], [2, 0]]
    case T:
      return [[0, 0], [1, 0], [1, 1], [2, 0]]
    case Z:
      return [[0, 0], [1, 0], [1, 1], [2, 1]]
  }
}

function centerIndex(type) {
  switch (type) {
    case I:
    case L:
    case O:
    case S:
    case T:
      return 1
    case J:
    case Z:
      return 2
  }
}

function rotatePoints(type, points) {
  if (type == O)
    return points

  const centerIdx = centerIndex(type)
  const [x0, y0] = points[centerIdx]
  const rotated = []
  points.forEach(([x1, y1], i) => {
    if (i == centerIdx) {
      rotated.push([x1, y1])
    } else {
      const x = x1 - x0
      const y = y1 - y0
      const uprightI = (type == I && points[0][0] == 1)
      if (uprightI) {
        rotated.push([y + x0, -x + y0])
      } else {
        rotated.push([-y + x0, x + y0])
      }
    }
  })
  return rotated
}

function emptyGrid({ x, y }, tetrominoes) {
  for (let { x: tx, y: ty, points } of tetrominoes) {
    for (let [px, py] of points) {
      if (tx + px == x && ty + py == y)
        return false
    }
  }
  return true
}

export const BOARD_WIDTH = 480
export const BOARD_HEIGHT = 600
export const BOARD_X_CUBES = BOARD_WIDTH / CUBE_SIZE
export const BOARD_Y_CUBES = BOARD_HEIGHT / CUBE_SIZE

export function nextTetromino() {
  const type = TETROMINOES[randomInt(TETROMINOES.length)]
  return {
    type,
    x: initX(type),
    y: 0,
    points: initPoints(type),
  }
}

export function rotateTetromino(tetromino, tetrominoes) {
  const { type, points } = tetromino
  if (type == O)
    return tetromino

  const rotated = {
    ...tetromino,
    points: rotatePoints(type, points),
  }

  const { collised } = detectCollision(rotated, ROTATE, tetrominoes)

  return collised ? tetromino : rotated
}

export function moveDownTetromino(tetromino, tetrominoes, onCollise, onGameOver) {
  const moved = { ...tetromino, y: tetromino.y + 1 }

  const { collised, gameOver } = detectCollision(moved, DOWN, tetrominoes)

  if (!collised) {
    return moved
  }

  if (gameOver) {
    onGameOver()
  } else {
    onCollise()
  }

  return tetromino
}

export function moveLeftTetromino(tetromino, tetrominoes) {
  const moved = { ...tetromino, x: tetromino.x - 1 }

  const { collised } = detectCollision(moved, LEFT, tetrominoes)

  return collised ? tetromino : moved
}

export function moveRightTetromino(tetromino, tetrominoes) {
  const moved = { ...tetromino, x: tetromino.x + 1 }

  const { collised } = detectCollision(moved, RIGHT, tetrominoes)

  return collised ? tetromino : moved
}

function detectCollision(tetromino, operation, tetrominoes) {
  const { x, y, points } = tetromino
  switch (operation) {
    case ROTATE:
      for (let [px, py] of points) {
        if (x + px < 0 || x + px >= BOARD_X_CUBES || y + py < 0 || y + py >= BOARD_Y_CUBES || !emptyGrid({ x: x + px, y: y + py }, tetrominoes)) {
          return { collised: true }
        }
      }

    case LEFT:
      for (let [px, py] of points) {
        if (x + px < 0 || !emptyGrid({ x: x + px, y: y + py }, tetrominoes)) {
          return { collised: true }
        }
      }

    case RIGHT:
      for (let [px, py] of points) {
        if (x + px >= BOARD_X_CUBES || !emptyGrid({ x: x + px, y: y + py }, tetrominoes)) {
          return { collised: true }
        }
      }

    case DOWN:
      for (let [px, py] of points) {
        if (y + py >= BOARD_Y_CUBES || !emptyGrid({ x: x + px, y: y + py }, tetrominoes)) {
          return { collised: true, gameOver: tetromino.y - 1 == 0 }
        }
      }

    case FALLDOWN:
    default:
      return {}
  }
}