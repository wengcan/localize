const jsonToKeys = (json, key = '') => {
    let keys = [];
    for(var i in json){
        const currentKey = (key ==='' ? '' : key + ".") + i;
        if(typeof json[i] === "string"){
            keys.push(currentKey);
        }else{
            const childkeys = jsonToKeys(json[i], currentKey);
            keys = keys.concat(childkeys);
        }
    }
    return keys;
}

export default jsonToKeys;