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

// Open the environment template file
try {
    let fileContents = fs.readFileSync('./env.yml', 'utf8');
    loadedData = yaml.safeLoad(fileContents);
    data = loadedData["local"]
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
        //console.log(`${keys[i]} not found in environment`)
        if(data[keys[i]]==null){
            data[keys[i]]=''
        }
    }
}

// Loop to add environment variable which are not in .env.yml 
for(i in process.env){
    env = env.toUpperCase()
    if(process.env[i].startsWith(`${env}_`)){
        let key = process.env[i].replace(`${env}_`,'')
        console.log(`Adding new key :  ${key}`)
        data[key]=process.env[i]
    }
}

// Finally convert the json to yml and dump to env.yml file

let yamlStr = yaml.safeDump({[env]:data});
fs.writeFileSync('env.yml', yamlStr, 'utf8');
