"use strict";

var fs = require('fs');

var path = require('path');

var ROOT_PATH = fs.realpathSync(process.cwd());

(function checkIfCurrentWorkingDirectoryIsCorrect() {
  console.info('ROOT_PATH', ROOT_PATH);
  var pJson = fs.existsSync("".concat(ROOT_PATH, "/package.json"));

  if (!pJson) {
    console.error("\nCurrent working directory might not be the project root directory.\nDid you call process.chdir() properly?");
    process.exit(0);
  }
})();

module.exports = {
  lib: path.resolve(ROOT_PATH, 'lib'),
  src: path.resolve(ROOT_PATH, 'src')
};
//# sourceMappingURL=paths.js.map
