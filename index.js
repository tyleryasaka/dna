var html = require('choo/html')
var devtools = require('choo-devtools')
var choo = require('choo')

var app = choo()
app.use(devtools())
app.use(globalStore)
app.route('/', mainView)
app.mount('body')

function mainView (state, emit) {
  return html`
    <body>
      Hello world
    </body>
  `
}

function globalStore (state, emitter) {
  // emitter.on('updateBrightness', function (value) {
  //   state.brightness = value
  //   emitter.emit('render')
  // })

  emitter.on('render', function () {
    console.log('rendered')
  })
}
