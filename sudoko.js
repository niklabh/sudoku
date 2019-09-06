class Sudoko {
  /**
   *
   * @param {Integer} n size of the grid should be
   * @param {Integer[][]} grid sudoku grid as 2d array
   */
  constructor(n, grid, chars) {
    const sqrt = Math.sqrt(n)

    if (n % sqrt !== 0) {
      throw new Error('Size should be perfect square')
    }

    this.chars = chars
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
    return this.sqrt * Math.floor(i/this.sqrt) + Math.floor(j/this.sqrt)
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

    for (let i = 0; i <= this.chars.length; i++) {
      const num = this.chars[i]
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
    [ 0, 0, 'J', 'E', 'I', 'A', 0, 0, 0, 0, 'G', 'O', 'N', 'M', 0, 0 ],
    [ 'G', 0, 'P', 'I', 'B', 'K', 'J', 'H', 0, 0, 0, 0, 'F', 'A', 0, 'O' ],
    [ 0, 0, 'F', 0, 'D', 0, 'E', 'G', 0, 'B', 'P', 0, 'L', 0, 'K', 'C' ],
    [ 0, 0, 0, 'H', 'M', 'O', 0, 'L', 'F', 'K', 'E', 'A', 'P', 'G', 0, 'J' ],
    [ 'B', 'P', 'G', 'K', 0, 'D', 'F', 'J', 0, 0, 'N', 'I', 'A', 0, 0, 'H' ],
    [ 'E', 'M', 0, 'C', 'O', 'B', 'I', 'P', 'A', 0, 'H', 'F', 0, 'D', 'N', 0 ],
    [ 'D', 'I', 'H', 0, 0, 0, 'N', 'E', 'K', 'G', 'C', 'P', 'J', 0, 'M', 'F' ],
    [ 'F', 'N', 0, 0, 0, 'M', 'G', 0, 0, 0, 0, 'L', 'I', 'E', 0, 'P' ],
    [ 0, 'J', 'M', 0, 'N', 'E', 'K', 'D', 0, 0, 'L', 'C', 'H', 0, 0, 0 ],
    [ 'I', 'D', 0, 'G', 0, 0, 'M', 'A', 'J', 'P', 0, 'N', 0, 0, 'B', 'L' ],
    [ 'L', 'A', 'C', 0, 0, 'G', 'O', 'I', 'B', 0, 0, 0, 0, 0, 'J', 'D' ],
    [ 'P', 0, 'K', 'N', 'L', 'J', 0, 0, 'E', 'F', 0, 'D', 0, 'O', 'A', 'G' ],
    [ 'A', 'F', 0, 'L', 'K', 0, 'H', 'B', 'D', 'O', 0, 0, 0, 'I', 'G', 'M' ],
    [ 0, 'E', 0, 'D', 'J', 'I', 0, 0, 'P', 'C', 'F', 'G', 'O', 'K', 'L', 0 ],
    [ 0, 0, 'O', 'P', 'E', 'C', 'D', 0, 'L', 'I', 'M', 0, 0, 'F', 'H', 0 ],
    [ 'K', 'C', 0, 'M', 0, 'F', 0, 0, 'N', 'H', 0, 0, 0, 'J', 'P', 'E' ]
  ]

  const chars = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P']

  const sudoku = new Sudoko(16, grid, chars)
  sudoku.print()
  if (sudoku.solve()) {
    sudoku.print()
    console.log(sudoku.grid)
  }
}
