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
        try{
            let isKeyValue=false;
            try{
            let stringValue = JSON.parse(value)
            }catch(e){
                isKeyValue=true
            }
            
            if(isKeyValue){
                data[keys[i]]=value
                console.log(`Updated ${keys[i]}`)
            }else{
                try{
                    data[keys[i]]=JSON.parse(stringValue)
                    console.log(`Updated ${keys[i]}`)
                }catch(e){
                    console.log(e)
                }
            }

        } catch (e) {
            console.log(e);
        }
    }else{
        console.log(`${keys[i]} not found in environment`)
    }
}

console.log(data)

let yamlStr = yaml.safeDump(data);
fs.writeFileSync('env.yml', yamlStr, 'utf8');