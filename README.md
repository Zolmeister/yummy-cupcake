### Goal: Figure out best practices for writing HTML5 games

### Build process
Builds look like this

- build/
  - index.html
  - cache.appcache
  - dist/
    - bundle.min.js
    - bundle.min.js.map
    - vendor.min.js
    - vendor.min.js.map
    - bundle.min.css
    - bundle.min.css.map
  - assets/
    - image.jpg
    - ...

`cache.appcache` has all non `asset/` files in it  
(nor `*.map` files, nor `cache.appcache`)

### TODO
- add build step to add all `asset` files to `cache.appcache`
