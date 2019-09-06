class Sudoko {
  /**
   *
   * @param {Integer} n size of the grid should be
   * @param {Integer[][]} grid sudoku grid as 2d array
   */
  constructor(n, grid) {
    const sqrt = Math.sqrt(n)

    if (n % sqrt !== 0) {
      throw new Error('Size should be perfect square')
    }

    this.n = n
    this.sqrt = sqrt
    this.grid = []
    this.x = []  // row maps of numbers
    this.y = []  // column maps of number
    this.sector = [] // sector maps of numbers

    for (let i = 0; i < n; i++) {
      this.x.push({})
      this.y.push({})
      this.sector.push({})
    }

    for (let i = 0; i < n; i++) {
      this.grid.push([])
      for (let j = 0; j < n; j++) {
        const num = grid[i][j]
        if (num < 0 || num > n) {
          throw new Error('number must be between 0 and n')
        }
        this.grid[i][j] = num || 0

        if (num) {
          this.x[i][num] = true
          this.y[j][num] = true
          this.sector[this.getSector(i, j)][num] = true
        }
      }
    }
  }

  getSector (i, j) {
    let diff = 0

    if (i%this.sqrt === 0) {
      diff = -1
    }

    if (i%this.sqrt === this.sqrt - 1) {
      diff = 1
    }

    let newJ = j

    if ((j + diff) > 0 && (j + diff) < this.n) {
      newJ = j + diff
    }

    const sector = this.sqrt * Math.floor(i/this.sqrt) + Math.floor(newJ/this.sqrt)

    return sector
  }

  print() {
    let out = ''
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        out += (this.grid[i][j] || ' ') + ' '
      }
      out += '\n'
    }
    console.log(out)
  }

  solve() {
    const free = this.findFirstFree()

    if (!free) {
      return true
    }

    const {x, y} = free

    for (let num = 1; num <= this.n; num++) {
      if (this.isValid(num, x, y)) {
        this.set(num, x, y)

        if (this.solve()) {
          return true
        }

        this.set(0, x, y)
      }
    }

    return false
  }

  findFirstFree() {
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        if (this.grid[i][j] === 0) {
          return {x: i, y: j}
        }
      }
    }

    return false
  }

  isValid(num, x, y) {
    if (this.x[x][num]) {
      return false
    }

    if (this.y[y][num]) {
      return false
    }

    const sector = this.getSector(x, y)

    if (this.sector[sector][num]) {
      return false
    }

    return true
  }

  set (num, x, y) {
    const prev = this.grid[x][y]
    this.grid[x][y] = num

    if (num !== 0) {
      this.x[x][num] = true
      this.y[y][num] = true
      this.sector[this.getSector(x, y)][num] = true
    } else {
      this.x[x][prev] = false
      this.y[y][prev] = false
      this.sector[this.getSector(x, y)][prev] = false
    }
  }
}

if (require.main === module) {
  const grid = [
    [ 0, 0, 0, 2, 4, 8, 5, 0, 0 ],
    [ 0, 4, 9, 0, 6, 0, 0, 0, 0 ],
    [ 0, 8, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 6, 0, 0, 0, 0, 2 ],
    [ 0, 0, 0, 0, 0, 0, 3, 0, 0 ],
    [ 0, 5, 0, 8, 3, 0, 0, 7, 0 ],
    [ 0, 1, 0, 0, 0, 0, 0, 9, 0 ],
    [ 2, 0, 0, 0, 9, 0, 7, 5, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 8 ]
  ]

  const sudoku = new Sudoko(9, grid)

  console.log('sectors:')
  let out = ''
  for (let i = 0; i < sudoku.n; i++) {
    for (let j = 0; j < sudoku.n; j++) {
      out += `${sudoku.getSector(i, j)} `
    }
    out += '\n'
  }
  console.log(out)

  console.log('sudoku:')
  sudoku.print()
  if (sudoku.solve()) {
    console.log('solution:')
    sudoku.print()
  } else {
    console.log('no solution')
  }
}
