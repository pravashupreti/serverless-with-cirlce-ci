// read.js
const fs = require('fs');
const yaml = require('js-yaml');

var data

try {
    let fileContents = fs.readFileSync('./example.env.yml', 'utf8');
    data = yaml.safeLoad(fileContents);

    // console.log(data);
} catch (e) {
    console.log(e);
}

var keys = Object.keys(data);
console.log(keys)

var branch = process.env.CIRCLE_BRANCH

let yamlStr = yaml.safeDump(data);
fs.writeFileSync('env.yml', yamlStr, 'utf8');