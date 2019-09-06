class Sudoko {
  /**
   *
   * @param {Integer} n size of the grid should be
   * @param {Integer[][]} grid sudoku grid as 2d array
   */
  constructor(n, grid, subsectorBorder) {
    const sqrt = Math.sqrt(n)

    if (n % sqrt !== 0) {
      throw new Error('Size should be perfect square')
    }

    this.n = n
    this.sqrt = sqrt
    this.subsectorBorder = subsectorBorder
    this.grid = []
    this.x = []  // row maps of numbers
    this.y = []  // column maps of number
    this.sector = [] // sector maps of numbers
    this.subsector = [] // subsector maps of numbers

    for (let i = 0; i < n; i++) {
      this.x.push({})
      this.y.push({})
      this.sector.push({})
    }

    for (let i = 0; i < subsectorBorder.length; i++) {
      this.subsector.push({})
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

          const subsector = getSubsector(i, j)
          if (!isNaN(subsector)) {
            this.subsector[subsector][num] = true
          }
        }
      }
    }
  }

  getSector (i, j) {
    return this.sqrt * Math.floor(i/this.sqrt) + Math.floor(j/this.sqrt)
  }

  getSubsector (i, j) {
    for (let s = 0; s < this.subsectorBorder.length; s++) {

      if (
        i >= this.subsectorBorder[s].x &&
        i < this.subsectorBorder[s].x + this.sqrt &&
        j >= this.subsectorBorder[s].y &&
        j < this.subsectorBorder[s].y + this.sqrt
      ) {
        return s
      }
    }
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

    const subsector = getSubsector(x, y)

    if (this.subsector[subsector][num]) {
      return false
    }

    return true
  }

  set (num, x, y) {
    const prev = this.grid[x][y]
    this.grid[x][y] = num

    const subsector = getSubsector(x, y)

    if (num !== 0) {
      this.x[x][num] = true
      this.y[y][num] = true
      this.sector[this.getSector(x, y)][num] = true

      if (!isNaN(subsector)) {
        this.subsector[subsector][num] = true
      }
    } else {
      this.x[x][prev] = false
      this.y[y][prev] = false
      this.sector[this.getSector(x, y)][prev] = false

      if (!isNaN(subsector)) {
        this.subsector[subsector][prev] = false
      }
    }
  }
}

if (require.main === module) {
  const grid = [
    [4, 1, 9, 0, 8, 0, 0, 0, 0],
    [5, 0, 8, 0, 0, 0, 0, 0, 6],
    [0, 0, 0, 5, 0, 0, 0, 0, 0],
    [0, 9, 0, 6, 0, 0, 0, 0, 4],
    [0, 4, 0, 0, 0, 0, 0, 0, 3],
    [6, 0, 0, 2, 9, 0, 0, 8, 0],
    [0, 0, 2, 3, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 9, 2, 5, 0],
    [0, 7, 0, 0, 0, 0, 0, 0, 0]
  ]

  const n = 9
  const sqrt = Math.sqrt(n)

  // start of subsectors
  const subsectors = [
    {x: 1, y: 1},
    {x: 1, y: 2 + sqrt},
    {x: 2 + sqrt, y: 1},
    {x: 2 + sqrt, y: 2 + sqrt},
  ]
}
