function generateStates (configArg, initialStateArg, mappingsArg) {
  const statesArr = []
  statesArr.push(initialStateArg)
  // Iterate over time
  for (let t = 1; t < configArg.maxTime; t++) {
    const currentState = statesArr[t - 1]
    const nextState = []
    for (let c = 0; c < configArg.cells; c++) {
      let self = currentState[c]
      let neighbor1 = currentState[(c + configArg.cells - 1) % configArg.cells]
      let neighbor2 = currentState[(c + 1) % configArg.cells]
      nextState.push(getState(mappingsArg, self, neighbor1, neighbor2))
    }
    statesArr.push(nextState)
  }
  return statesArr
}

function generateMapping (configArg, levels) {
  if (levels > 0) {
    const arr = []
    for (let i = 0; i < configArg.states; i++) {
      arr.push(generateMapping(configArg, levels - 1))
    }
    return arr
  }
  return getRandomInt(configArg.states)
}

function getState (mappingsArg, arg1, arg2, arg3) {
  return mappingsArg[Number(arg1)][Number(arg2)][Number(arg3)]
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
    window.alert('data in console')
  }
  function updateData (e) {
    const obj = JSON.parse(e.target.value)
    console.log(obj)
    emit('updateData', obj.config, obj.initialState, obj.mappings)
  }
  function importData () {
    emit('regenerate')
  }
  function generateRandom () {
    emit('generateRandom')
  }
  return html`
    <body>
      <button onclick=${exportData}>Export</button>
      <input oninput=${updateData}/>
      <button onclick=${importData}>Import</button>
      <button onclick=${generateRandom}>Generate</button>
      ${state.states.map(state => {
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

function randomize (state) {
  const config = {
    states: 5,
    maxTime: 1000,
    cells: 100
  }
  // Initialize with random state
  const initialState = []
  for (let c = 0; c < config.cells; c++) {
    initialState.push(getRandomInt(config.states))
  }
  // Initialize with random state mappings
  // const mappings = generateMapping(config, 3)
  const mappings = [[
    [
      2,
      1,
      1,
      3,
      0
    ],
    [
      2,
      1,
      1,
      0,
      2
    ],
    [
      3,
      1,
      1,
      0,
      2
    ],
    [
      3,
      0,
      2,
      0,
      0
    ],
    [
      4,
      1,
      3,
      3,
      2
    ]
  ],
  [
    [
      2,
      0,
      0,
      0,
      0
    ],
    [
      1,
      2,
      0,
      3,
      1
    ],
    [
      0,
      0,
      3,
      1,
      1
    ],
    [
      3,
      1,
      0,
      4,
      3
    ],
    [
      2,
      0,
      1,
      3,
      2
    ]
  ],
  [
    [
      2,
      1,
      0,
      0,
      1
    ],
    [
      4,
      3,
      1,
      4,
      4
    ],
    [
      1,
      2,
      1,
      0,
      3
    ],
    [
      4,
      4,
      1,
      2,
      1
    ],
    [
      3,
      0,
      3,
      2,
      1
    ]
  ],
  [
    [
      1,
      1,
      2,
      3,
      1
    ],
    [
      2,
      0,
      2,
      2,
      3
    ],
    [
      4,
      1,
      1,
      0,
      4
    ],
    [
      2,
      3,
      1,
      3,
      2
    ],
    [
      2,
      4,
      2,
      1,
      4
    ]
  ],
  [
    [
      0,
      3,
      4,
      1,
      0
    ],
    [
      3,
      1,
      3,
      4,
      1
    ],
    [
      1,
      2,
      0,
      1,
      0
    ],
    [
      3,
      3,
      4,
      1,
      1
    ],
    [
      4,
      4,
      1,
      0,
      2
    ]
  ]]

  state.states = generateStates(config, initialState, mappings)
  state.config = config
  state.initialState = initialState
  state.mappings = mappings
}

function globalStore (state, emitter) {
  randomize(state)
  // emitter.on('DOMContentLoaded', function () {
  //
  // })

  emitter.on('updateData', function (configArg, initialStateArg, mappingsArg) {
    state.inputData = {
      configArg,
      initialStateArg,
      mappingsArg
    }
  })

  emitter.on('regenerate', function () {
    const {
      configArg,
      initialStateArg,
      mappingsArg
    } = state.inputData || {}
    state.config = configArg
    state.initialState = initialStateArg
    state.mappings = mappingsArg
    state.states = generateStates(configArg, initialStateArg, mappingsArg)
    emitter.emit('render')
  })

  emitter.on('generateRandom', function () {
    randomize(state)
    emitter.emit('render')
  })
}
