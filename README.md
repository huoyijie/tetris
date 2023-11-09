# 基于 React 实现经典俄罗斯方块小游戏

## Github

[tetris 代码地址](https://github.com/huoyijie/tetris)

## 运行游戏

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## 实现思路

俄罗斯方块游戏最重要的部分就是四格拼板 (Tetromino)，共有 7 种基本形状如下：

### 七种四格拼板 (Tetromino)

```bash
# 坐标轴方向
#     y
#     |
# x ——|——>
#     v

# 方块 (Cube)
# []

# 7 种四格拼板
# I - [[0, 0], [0, 1], [0, 2], [0, 3]]
#
# [1][2][3][4]
#     *

[][][][]

# J - [[0, 0], [0, 1], [1, 1], [2, 1]]
#
# [1]
# [2][3][4]
#     *

[]
[][][]

# L - [[0, 1], [1, 1], [2, 1], [2, 0]]
#
#       [4]
# [1][2][3]
#     *

    []
[][][]

# O - [[0, 0], [0, 1], [1, 1], [1, 0]]
#
# [1][4]
# [2][3]

[][]
[][]

# S - [[0, 1], [1, 1], [1, 0], [2, 0]]
#
#    [3][4]
# [1][2]
#     *

  [][]
[][]

# T - [[0, 0], [1, 0], [1, 1], [2, 0]]
#
#     *
# [1][2][4]
#    [3]

[][][]
  []

# Z - [[0, 0], [1, 0], [1, 1], [2, 1]]
#
# [1][2]
#    [3][4]
#     *

[][]
  [][]
```

那么怎样用数字形式表达四格拼板形状呢？我采用的方式是矩阵，也就是二维数组。在上面每种拼板上方的注释中给出了相应的二维数组，注释里 [] 里面的数字和二维数组的索引(+1)是对应的，有 * 标记的是整体形状的中心块，当形状按照顺时针旋转时，就是围绕中心块进行。O 型是上下左右完全对称图形，所以不需要响应旋转操作，所以没有 * 标记。

### 底板 (Board) 坐标系

```bash
     0 1 2 3 4 5 6 7 8 9      ...      18 19
   +----------------------------------------+
 0 | . . . . . . . . . . . . . . . . . . . .|
 1 | . . . . . . . . . . . . . . . . . . . .|
 2 | . . . . . . . . . . . . . . . . . . . .|
 3 | . . . . . . . O O O . . . . . . . . . .|
 4 | . . . . . . . . O . . . . . . . . . . .|
 5 | . . . . . . . . . . . . . . . . . . . .|
 6 | . . . . . . . . . . . . . . . . . . . .|
 7 | . . . . . . . . . . . . . . . . . . . .|
 8 | . . . . . . . . . . . . . . . . . . . .|
 9 | . . . . . . . . . . . . . . . . . . . .|
10 | . . . . . . . . . . . . . . . . . . . .|
11 | . . . . . . . . . . . . . . . . . . . .|
12 | . . . . . . . . . . . . . . . . . . . .|
13 | . . . . . . . . . . . . . . . . . . . .|
14 | . . . . . . . . . . . . . . . . . . . .|
15 | . . . . . . . . . . . . . . . . . . . .|
16 | . . . . . . . . . . . . . . . . . . . .|
17 | . . . . . . . . . . . . . . . . . . . .|
18 | . . . . . . . . . . . . . . . . . . . .|
19 | . . . . . . . . . . . . . . . . . . . .|
20 | . . . . . . . . . . . . . . . . . . . .|
21 | . . . . . . . . . . . . . . . . . . . .|
22 | . . . . . . . . . . . . . . . . . . . .|
23 | . . . . . . . . . . . . . . . . . . . .|
24 | . . . . . . . . . . . . . . . . . . . .|
   +----------------------------------------+
```

每个四格拼板作为一个整体会有一个坐标 [x, y]，表示自己在上方 Board 中的位置，这个坐标与四格拼板内每个方块 (Cube) 的坐标加在一起可以确定每个方块 (Cube) 在 Board 中的坐标。

如上方的 T 型拼板的坐标是 [7, 3]，而 T 型拼板内 4 个方块的坐标是 [[0, 0], [1, 0], [1, 1], [2, 0]]，T 型拼板坐标分别加上 4 个方块坐标，就可以得到每个方块在 Board 中的坐标 [[7, 3], [8, 3], [8, 4], [9, 3]]，并绘制相应的方块，组成 T 型拼板。

### 操作四格拼板

* 旋转 - 应用拼板旋转算法，并进行碰撞检测，发生碰撞则放弃本次操作

```js
// 旋转拼板操作
function rotateTetromino(tetromino, tetrominoes) {
  const { type, points } = tetromino
  // O 型拼板直接返回自身
  if (type == O)
    return tetromino

  const rotated = {
    ...tetromino,
    points: rotatePoints(type, points),
  }

  const { collised } = detectCollision(rotated, ROTATE, tetrominoes)

  return collised ? tetromino : rotated
}

// 拼板旋转算法
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
```

* 左移 - 四格拼板整体坐标 x - 1，并进行碰撞检测，发生碰撞则放弃本次操作

```js
function moveLeftTetromino(tetromino, tetrominoes) {
  const moved = { ...tetromino, x: tetromino.x - 1 }

  const { collised } = detectCollision(moved, LEFT, tetrominoes)

  return collised ? tetromino : moved
}
```

* 右移 - 四格拼板整体坐标 x + 1，并进行碰撞检测，发生碰撞则放弃本次操作

```js
function moveRightTetromino(tetromino, tetrominoes) {
  const moved = { ...tetromino, x: tetromino.x + 1 }

  const { collised } = detectCollision(moved, RIGHT, tetrominoes)

  return collised ? tetromino : moved
}
```

* 下移 - 四格拼板整体坐标 y + 1，并进行碰撞检测，发生碰撞后应用行消除算法，并根据情况结束游戏或者冻结当前拼板，再产生下一块拼板继续游戏

```js
function moveDownTetromino(tetromino, tetrominoes, onCollise, onGameOver) {
  const moved = { ...tetromino, y: tetromino.y + 1 }

  const { collised, reachTop } = detectCollision(moved, DOWN, tetrominoes)

  if (!collised) {
    return moved
  }

  const eliminatedLines = eliminateLines(tetromino, tetrominoes)
  if (eliminatedLines == 0 && reachTop) {
    onGameOver()
  } else {
    onCollise(eliminatedLines)
  }

  return tetromino
}
```

* 掉落 - 重复下移，直至发生碰撞，碰撞后的处理逻辑与下移碰撞一致

```js
function fallDownTetromino(tetromino, tetrominoes, onCollise, onGameOver) {
  let result
  const moved = { ...tetromino }
  do {
    moved.y++
    result = detectCollision(moved, DOWN, tetrominoes)
  } while (!result.collised)

  tetromino.y = moved.y - 1

  const eliminatedLines = eliminateLines(tetromino, tetrominoes)
  if (eliminatedLines == 0 && result.reachTop) {
    onGameOver()
  } else {
    onCollise(eliminatedLines)
  }
}
```

### 碰撞检测

```js
// 碰撞检测算法
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
          return { collised: true, reachTop: tetromino.y - 1 == 0 }
        }
      }

    default:
      return {}
  }
}

// 判断 Board 上某个坐标点 [x, y] 是否没有方块 (Cube) 存在
function emptyGrid({ x, y }, tetrominoes) {
  for (let { x: tx, y: ty, points } of tetrominoes) {
    for (let [px, py] of points) {
      if (tx + px == x && ty + py == y)
        return false
    }
  }
  return true
}
```

### 消除行

```js
// 消除行算法
function eliminateLines(tetromino, tetrominoes) {
  const { y, points } = tetromino

  const candidates = []
  points.forEach(([_, py]) => {
    if (!candidates.includes(y + py)) {
      candidates.push(y + py)
    }
  })
  candidates.sort((a, b) => a - b)

  const counts = candidates.map(_ => 0)
  const all = [...tetrominoes, tetromino]
  all.forEach(({ y, points }) => {
    points.forEach(([_, py]) => {
      candidates.forEach((candidateY, i) => {
        if (y + py == candidateY) {
          counts[i]++
        }
      })
    })
  })

  let eliminatedLines = 0
  candidates.forEach((candidateY, i) => {
    if (counts[i] == BOARD_X_CUBES) {
      eliminatedLines++
      all.forEach(tetromino => {
        tetromino.points = tetromino.points.filter(([_, py]) => tetromino.y + py != candidateY)
        tetromino.points.forEach(point => {
          if (tetromino.y + point[1] < candidateY) {
            point[1]++
          }
        })
      })
    }
  })

  return eliminatedLines
}
```

### 显示下一块拼板

```js
// 有 2 个状态变量分别表示当前拼板和下一块拼板，每次显示当前拼板后，都立刻随机产生下一块拼板备用
const next = () => {
  if (currentTetromino) {
    tetrominoes.push(currentTetromino)
    setTetrominoes([...tetrominoes.filter(({ points }) => points.length > 0)])
  }
  setCurrentTetromino(nextTetromino)
  setNextTetromino(randomTetromino())
}
```

### 预测当前拼板掉落位置

```js
// 当前拼板掉落位置预测算法
function predictTetromino(tetromino, tetrominoes) {
  let result
  const predicted = { ...tetromino }
  do {
    predicted.y++
    result = detectCollision(predicted, DOWN, tetrominoes)
  } while (!result.collised)
  predicted.y--
  return predicted
}
```

### 计算积分公式

```js
// elimiLines 为本次消除行数
const score = 10 * (elimiLines == 1 ? 1 : Math.pow(2, elimiLines))
```

## 更新日志

* Round 1 (2023-10-31)

先实现一个最简单的 I 型四格拼板，可以进行左移、右移、下移、旋转操作，包含边界碰撞检测。把7种四格拼板封装成 React 组件，通过 x、y 属性控制四格拼板的位置，移动拼板就是更新其 x、y 值。通过 rotate 属性控制四格拼板的形态，旋转 0/90/180/270 度。后面继续开发 J、L、O、S、T、Z 型四格拼板。

* Round 2 (2023-11-02)

实现了当前拼板掉落、旋转、移动时的碰撞检测函数，当前拼板显示为红色，每秒自动降落一格直到发生碰撞，然后冻结当前拼板，再随机产生一个新的拼板。

* Round 3 (2023-11-03 )

已支持 I、J、L、O、S、T、Z 型四格拼板，没有行消除早晚要玩完啊！！！接下来把行消除功能加上。

* Round 4 (2023-11-06)

已支持 I、J、L、O、S、T、Z 型四格拼板，今天终于把行消除功能加上了，试玩了一下，刚开始还强装镇定，到后面一直不来 I 型长块，心好慌啊！！！

* Round 5 (2023-11-07)

今天把显示当前拼板掉落位置、显示得分、消除行数、提前预览下一块拼板等功能加上了。显示当前拼板掉落位置功能是我最喜欢的，之前没有这个功能，为了不串行，眼睛都要看花了！！！

* Round 6 (2023-11-08)

今天把游戏计时和难度等级功能加上了，解决了一个组件 infinite render 的 bug。今天的状态不错，采取了比较有效的消除策略，玩了 35 分钟累积了 1480 分还再继续！！！主要功能已经差不多实现好了，后面考虑加入一些有趣的小道具，比如可以用获得的炸弹炸掉不好的地方，再比如可以在慌乱时使用暂停几秒的道具等等。