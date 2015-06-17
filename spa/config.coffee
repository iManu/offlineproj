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
      ignore: /[/][.]|(visual_)[0-9]{3}(\.jpg)+/
      manifestFile: "appcache.manifest"

  server:
    path: 'jst-server.coffee'
    run: yes

  watcher:
    # If on Windows and you don't see new files / modified files, make this true
    # and restart Brunch. Slower detects, but more reliable.
    usePolling: true
