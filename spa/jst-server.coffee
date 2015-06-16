http     = require('http')
express  = require('express')
socketio = require('socket.io')

module.exports = startServer: ->
  app = express()
  server = http.createServer(app)
  io = socketio.listen(server)

  # The basics

  app.configure ->
    app.use express.static "#{__dirname}/public"
    app.use express.errorHandler dumpExceptions: true, showStack: true
    app.use express.logger format: ':method :url'
    app.use express.urlencoded()
    app.use express.json()
    app.use express.methodOverride()

  app.get '/', (request, response) ->
    response.sendfile 'public/index.html'

  server.listen 3333, ->
    console.log "Listening on port 3333… WebSockets enabled."
