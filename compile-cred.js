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

for (i in keys){
    let keyToBeSearch = `${branch}_${keys[i]}`.toUpperCase()
    console.log(`Searching the key ${keyToBeSearch} ...`)
    let value = process.env[keyToBeSearch]
    if ( value != null){
        data[keys[i]]=JSON.parse(value)
        console.log(`Updated ${keys[i]}`)
    }else{
        console.log(`${keys[i]} not found in environment`)
    }
}

let yamlStr = yaml.safeDump(data);
fs.writeFileSync('env.yml', yamlStr, 'utf8');