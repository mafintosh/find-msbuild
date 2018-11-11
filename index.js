const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

module.exports = msbuild

function msbuild (cb) {
  if (process.platform !== 'win32') return process.nextTick(new Error('Only works on Windows'))

  const arch = process.arch === 'ia32' ? '' : '/reg:32'

  exec(`reg query "HKLM\\Software\\Microsoft\\MSBuild\\ToolsVersions" /s ${arch}`, function (err, stdout) {
    if (err) return cb(err)

    const candidates = stdout.split('\r\n\r\n')
      .map(function (section) {
        const path = (section.match(/[ \t]MSBuildToolsPath[ \t]+REG_SZ[ \t]+(.+)/m) || [])[1]
        const versionString = (section.match(/ToolsVersions\\([^\\\r]+)/m) || [])[1]
        const version = parseFloat(versionString, 10)

        if (version >= 3.5 && path) return { path, version }
        return null
      })
      .filter(x => x)
      .sort((a, b) => b.version - a.version)

    loop()

    function loop () {
      const next = candidates.pop()
      if (!next) return cb(new Error('Could not find msbuild.exe'))

      const msbuild = path.resolve(next.path, 'msbuild.exe')

      fs.stat(msbuild, function (err) {
        if (err) {
          if (err.code === 'ENOENT') return loop()
          return cb(err)
        }

        cb(null, msbuild)
      })
    }
  })
}