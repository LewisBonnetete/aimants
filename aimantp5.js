
let width = window.innerWidth
let height = window.innerHeight
let div = 5
const grid = Array.from(Array(parseInt(width / div)), () => new Array(parseInt(height / div)).fill(0))

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

function setup() {
    createCanvas(width, height)
    background(51)
}

function computeGrid() {
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            let xDist = Math.abs(x - mouseX / div)
            let yDist = Math.abs(y - mouseY / div)
            let odds = getRandomInt((xDist * xDist + yDist * yDist + grid[x][y] / 2) / 100)
            if (odds === 0 && mouseIsPressed) {
                grid[x][y] += 10
            } else {
                grid[x][y] -= 5
            }
            if (grid[x][y] > 510) {
                grid[x][y] = 510
            }
            if (grid[x][y] < 0) {
                grid[x][y] = 0
            }
        }       
    }
}

function drawGrid() {
    for (let x = 0; x < grid.length; x++) {
        const column = grid[x];
        for (let y = 0; y < column.length; y++) {
            const point = column[y];

            fill(255, point - 255, point - 255, point)
            noStroke()
            circle(x * div, y * div, div)
        }
    }
}

function  draw() {
    background(51)
    computeGrid()
    drawGrid()
}