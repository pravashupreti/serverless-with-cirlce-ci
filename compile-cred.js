const fs = require('fs');
const yaml = require('js-yaml');

function environment(){
    var branch = process.env.CIRCLE_BRANCH
    if (branch=="master")
        return "prod"
    return branch
}

var data

// Open the environment template file
try {
    let fileContents = fs.readFileSync('./example.env.yml', 'utf8');
    data = yaml.safeLoad(fileContents);
} catch (e) {
    console.log(e);
}

// List out the keys used on yml file. This are first level attribute of json data
var keys = Object.keys(data);

let env = environment()
for (i in keys){
    let keyToBeSearch = `${env}_${keys[i]}`.toUpperCase()
    console.log(`Searching the key ${keyToBeSearch} ...`)
    
    // Get the value from
    let value = process.env[keyToBeSearch]
    if ( value != null){
        try{
            let isKeyValue=false;
            let stringValue

            // Try to parse the environment to json
            try{
                stringValue = JSON.parse(value)
            }catch(e){
                // Parsing failed mean this is key value type
                isKeyValue=true
            }
            
            if(isKeyValue){
                data[keys[i]]=value
                console.log(`Updated ${keys[i]}`)
            }else{
                // Parse the json string to json object
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

// Finally convert the json to yml and dump to env.yml file
let yamlStr = yaml.safeDump(data);
fs.writeFileSync('env.yml', yamlStr, 'utf8');