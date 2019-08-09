const config = {
  states: 5,
  maxTime: 1000,
  cells: 100
}

const states = []
const initialState = []

// Initialize with random state
for (let c = 0; c < config.cells; c++) {
  initialState.push(getRandomInt(config.states))
}
states.push(initialState)

// Initialize with random state mappings
const mappings = generateMapping(3)

// Iterate over time
for (let t = 1; t < config.maxTime; t++) {
  const currentState = states[t - 1]
  const nextState = []
  for (let c = 0; c < config.cells; c++) {
    let self = currentState[c]
    let neighbor1 = currentState[(c + config.cells - 1) % config.cells]
    let neighbor2 = currentState[(c + 1) % config.cells]
    nextState.push(getState(self, neighbor1, neighbor2))
  }
  states.push(nextState)
}

function generateMapping (levels) {
  if (levels > 0) {
    const arr = []
    for (let i = 0; i < config.states; i++) {
      arr.push(generateMapping(levels - 1))
    }
    return arr
  }
  return getRandomInt(config.states)
}

function getState (arg1, arg2, arg3) {
  return mappings[Number(arg1)][Number(arg2)][Number(arg3)]
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt (max) {
  return Math.floor(Math.random() * Math.floor(max))
}

var html = require('choo/html')
var devtools = require('choo-devtools')
var choo = require('choo')

var app = choo()
app.use(devtools())
app.use(globalStore)
app.route('/', mainView)
app.mount('body')

function mainView (state, emit) {
  function exportData () {
    console.log(JSON.stringify({
      config: state.config,
      mappings: state.mappings,
      initialState: state.initialState
    }))
  }
  return html`
    <body>
      <button onclick=${exportData}>Export</button>
      ${states.map(state => {
        return renderState(state)
      })}
    </body>
  `
}

function renderState (state) {
  return html`
    <div class="state">
      ${state.map(cell => {
        return html`
          <div class="cell cell-${cell}"></div>
        `
      })}
    </div>
  `
}

function globalStore (state, emitter) {
  // emitter.on('updateBrightness', function (value) {
  //   state.brightness = value
  //   emitter.emit('render')
  // })

  emitter.on('DOMContentLoaded', function () {
    state.initialState = initialState
    state.config = config
    state.mappings = mappings
  })
}
