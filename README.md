### Goal: Figure out best practices for writing HTML5 games

### Dev
`gulp`

### Production
`gulp build`

### Server for testing
##### Dev
(serves files out of ./app)
`node server`
##### Prod
(serves files out of ./build)
`NODE_ENV=production node server`

### Flo
Server also runs [fb-flo](http://facebook.github.io/fb-flo/) for live updating

### Build process
Builds look like this

- build/
  - index.html
  - cache.appcache
  - dist/
    - bundle.js
    - bundle.js.map (currently missing)
    - vendor.js
    - vendor.js.map (currently missing)
    - bundle.css
    - bundle.css.map (currently missing)
  - assets/
    - image.jpg
    - ...

`cache.appcache` has all non `asset/` files in it  
(nor `*.map` files, nor `cache.appcache`)

### TODO
- add build step to add all `asset` files to `cache.appcache`
- minify/concat css w/source maps
- fix missing js maps
