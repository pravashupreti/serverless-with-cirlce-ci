const fs = require('fs');
const yaml = require(`${process.env.NODE_PATH}/js-yaml`);

function environment(){
    var branch = process.env.CIRCLE_BRANCH
    
    if(branch==null){
        return "local"
    }
    
    if (branch=="master")
        return "prod"

    if (branch=="staging")
        return "stage"

    if (branch=="development")
        return "dev"

}

var data
var fileContents

// Open the environment template file
try {
    fileContents = fs.readFileSync('./env.yml', 'utf8');
    loadedData = yaml.safeLoad(fileContents);
    data = loadedData["dev"]
} catch (e) {
    console.log(e);
}

// List out the keys used on yml file. This are first level attribute of json data
var keys = []
try{
    keys= Object.keys(data);
}catch(e){
    console.log("No keys present on .env")
    console.log(fileContents)
    console.log(e)
}

let env = environment()

// Loop to overwrite a value from environment
for (i in keys){
    let keyToBeSearch = `${env}_${keys[i]}`.toUpperCase()
    //console.log(`Searching the key ${keyToBeSearch} ...`)
    
    // Get the value from
    let value = process.env[keyToBeSearch]
    let globalValue = process.env[keys[i]]
    
    if ( globalValue != null){
        try{
            let isKeyValue=false;
            let stringValue

            // Try to parse the environment to json
            try{
                stringValue = JSON.parse(globalValue)
            }catch(e){
                // Parsing failed mean this is key value type
                isKeyValue=true
            }
            
            if(isKeyValue){
                data[keys[i]]=globalValue
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
        
    }else if( value != null){
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
        //console.log(`${keys[i]} not found in environment`)
        if(data[keys[i]]==null){
            data[keys[i]]=''
        }
    }
}

// Loop to add environment variable which are not in .env.yml 
env = env.toUpperCase()
var envVariables = Object.keys(process.env)
for(i in envVariables){
    if(envVariables[i].startsWith(`${env}_`)){
        let key = envVariables[i].replace(`${env}_`,'')
        
        if(data.hasOwnProperty(key))
            continue
        
        console.log(`Adding new key :  ${key}`)
        data[key]=process.env[envVariables[i]]
    }
}

// Finally convert the json to yml and dump to env.yml file

env = env.toLowerCase()

let yamlStr = yaml.safeDump({[env]:data});
fs.writeFileSync('env.yml', yamlStr, 'utf8');
