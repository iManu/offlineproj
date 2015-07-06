exports.config =
  # See https://github.com/brunch/brunch/blob/stable/docs/config.md for documentation.
  files:
    javascripts:
      joinTo:
        'javascripts/app.js': /^app/
        'javascripts/vendor.js': /^vendor/
      order:
        before: [
          'vendor/scripts/console-helper.js',
          'vendor/scripts/jquery-1.10.2.js',
          'vendor/scripts/underscore-1.5.2.js',
          'vendor/scripts/backbone-1.0.0.js',
          'vendor/scripts/backbone-mediator.js',
          'vendor/scripts/modernizr.custom.min.js',
        ]

    stylesheets:
      defaultExtension: 'scss'
      joinTo:
        'stylesheets/app.css': /^app\/styles/

    templates:
      joinTo: 'javascripts/app.js'

  plugins:
    appcache:
      externalCacheEntries: []
      network: ['*', 'http://*', 'https://*']
      ignore: /[/][.]|(\.manifest)|(.*)(_media_)[1-9]{1}(.*)(\.jpg|\.png)|(.*)(\.map)+/
      manifestFile: "appcache.manifest"
    postcss:
      processors: [
          require('autoprefixer')(['last 8 versions'])
      ]
    browserSync:
      server:         false
      online:         false
      logConnections: false
      logLevel:       'debug'
      open:           false
      port:           3333
      proxy:          'local.samsung.com/tests/offlineproj/spa/public'
      debugInfo:      true
      notify:         true
      snippetOptions:
        rule:
          match: /<\/body>/i


  server:
    command: 'node jst-server.coffee'

  watcher:
    # If on Windows and you don't see new files / modified files, make this true
    # and restart Brunch. Slower detects, but more reliable.
    usePolling: true
