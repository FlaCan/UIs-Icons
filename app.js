const fs = require('fs');

fs.readFile("svg/sprite.svg", "utf-8", (err, data) => {

console.log(data);

});