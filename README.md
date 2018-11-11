# find-msbuild

Find your local msbuild.exe install. Useful when building on Windows

```
npm install find-msbuild
```

## Usage

``` js
const msbuild = require('find-msbuild')

msbuild(function (err, path) {
  if (err) throw err
  console.log('msbuild.exe is here:', path)
})
```

Inspired by the msbuild.exe finder in [nodejs/node-gyp](https://github.com/nodejs/node-gyp).

## License

MIT
