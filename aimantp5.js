const bg = 51
const div = 6

const add = 15
const del = -4

let width = parseInt(window.innerWidth / div)
let height = parseInt(window.innerHeight / div)
const grid = Array.from(Array(width), () => new Array(height).fill(0))

const merge = false

let isFullScreen = false
let ready = false

let total
let minTotal = 220000
let maxTotal = 450000

let panning = 0

let maxStep = 0.015
let minStep = 0
let step = maxStep
let diffStep = step / 4
let time = 5
let maxDiff = 5
let minDiff = 0
let diff = maxDiff

let feu

let me = {
    x: 0,
    y: 0,
    sound: {},
}
let her  = {
    x: 0,
    y: 0,
    sound: {},
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

function touchStarted () {
    var fs = fullscreen();
    if (!fs && !isFullScreen) {
        isFullScreen = true
        fullscreen(true);
    }
    ready = true;
  }

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
    width = parseInt(window.innerWidth / div)
    height = parseInt(window.innerHeight / div)
    background(bg)
}

document.ontouchmove = function(event) {
    event.preventDefault();
};

function play(sound) {
    if (!sound.isPlaying()) {
        sound.setVolume(0)
        sound.play()
    }
}

function preload() {
    soundFormats('mp3');
    feu = loadSound('./feu.mp3');
    me.sound = loadSound('./feu1.mp3');
    her.sound = loadSound('./feu2.mp3');
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight)
    background(51)
}

function computeLove(x, y) {
    let sum = 0
    let Xmin = x > 0
    let Xmax = x < width - 1
    let Ymin = y > 0
    let Ymax = y < height - 1

    if (Xmin) {
        sum += grid[x - 1][y]
    }
    if (Xmax) {
        sum += grid[x + 1][y]
    }
    if (Ymin) {
        sum += grid[x][y - 1]
    }
    if (Ymax) {
        sum += grid[x][y + 1]
    }
    if (Xmax && Ymax) {
        sum += grid[x + 1][y + 1]
    }
    if (Xmin && Ymin) {
        sum += grid[x - 1][y - 1]
    }
    if (Xmin && Ymax) {
        sum += grid[x - 1][y + 1]
    }
    if (Xmax && Ymin) {
        sum += grid[x + 1][y - 1]
    }
    return sum
}

function computeGrid(subjectX, subjectY, cap) {
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            // const love = computeLove(x, y)
            let xDist = Math.abs(x - subjectX / div)
            let yDist = Math.abs(y - subjectY / div)
            let odds = getRandomInt((xDist * xDist + yDist * yDist + grid[x][y] / 2) / 100)
            if (odds === 0 && cap) {
                grid[x][y] += add
            } else {
                grid[x][y] += del
            }
            grid[x][y] = constrain(grid[x][y], 0, 510)
        }      
    }
}

function drawGrid() {
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            const value = grid[x][y];
            total += grid[x][y]
            fill(255, value - 255, value - 255, value)
            noStroke()
            circle(x * div, y * div, div)
        }
    }
}

function  draw() {
    background(bg)
    if (ready) {
        total = 0
        play(me.sound)
        play(her.sound)
        time += step
        if (merge) {
            diff -= diffStep
            diff = constrain(diff, minDiff, maxDiff)
            if (diff === 0) {
                step -= maxStep / 1000
            }
            step = constrain(step, minStep, maxStep)
        }

        computeGrid(me.x, me.y, step !== 0)
        computeGrid(her.x, her.y, step !== 0)     

        let year = 0
        if (diff > 0) year = parseInt(map(diff, maxDiff, minDiff, 0, 59))
        else year = parseInt(map(step, maxStep, minStep, 59, 69))

        drawGrid()
        
        me.x = noise(time - diff) * window.innerWidth
        me.y = noise(time - diff + 2000) * window.innerHeight
        panning = map(me.x, 0, window.innerWidth, -1.5, 1.5);
        panning = constrain(panning, -1, 1)
        me.sound.pan(panning);
        me.sound.setVolume(map(total, minTotal, maxTotal, 0, 1))

        her.x = noise(time + diff) * window.innerWidth
        her.y = noise(time + diff + 2000) * window.innerHeight
        panning = map(her.x, 0, window.innerWidth, -1.5, 1.5);
        panning = constrain(panning, -1, 1)
        her.sound.pan(panning);
        her.sound.setVolume(map(total, minTotal, maxTotal, 0, 1))

        // textAlign(CENTER, TOP)
        // textSize(16);
        // fill(255)
        // text(`year: ${year}`, window.innerWidth - 1000, window.innerHeight - 50);

        // console.log('diff', diff);
        // console.log('step', step);
    } else {
        textAlign(CENTER, TOP);
        textSize(32);
        fill(255)
        text('Click to start', window.innerWidth / 2, window.innerHeight / 2);
    }
}