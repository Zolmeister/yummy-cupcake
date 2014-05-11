### Goal: Figure out best practices for writing HTML5 games

### Build process
Builds look like this

- build/
  - index.html
  - cache.appcache
  - dist/
    - bundle.min.js
    - bundle.min.js.map (currently missing)
    - vendor.min.js
    - vendor.min.js.map (currently missing)
    - bundle.min.css
    - bundle.min.css.map (currently missing)
  - assets/
    - image.jpg
    - ...

`cache.appcache` has all non `asset/` files in it  
(nor `*.map` files, nor `cache.appcache`)

### TODO
- add build step to add all `asset` files to `cache.appcache`
- minify/concat css w/source maps
- fix missing js maps
