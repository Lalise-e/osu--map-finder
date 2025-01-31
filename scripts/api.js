//file wide constants.
import { API_KEY } from "./key.js";
export { initialize, getBeatmaps, intToModString, modStringToInt, getUser, randomInt };
const apiEndpoint = "https://osu.ppy.sh/api";
let maxBeatmapSetID = 0;
const rateLimit = 120;
const rateLimitPeriod = 60000; //1 min
const retries = 5;
let requests = 0;

//api functions
async function get(path, parameters){
    //todo: error handling
    const url = new URL(path);
    parameters.push(["k", API_KEY]);
    parameters.forEach(element => {
        url.searchParams.append(element[0], element[1]);
    });
    while(requests >= rateLimit)
        await new Promise(res => {setTimeout(res, 100)}); //waits 100ms as to not freeze the browser
    requests++;
    const item = await (await fetch(url)).json();
    setTimeout(() => requests--, rateLimitPeriod)
    return item;
}
async function initialize() {
    //We store maxBeatmapSetID so if you were hit search before this get requests finish you won't get weird results
    maxBeatmapSetID = Number(localStorage.getItem("maxID"));
    const path = `${apiEndpoint}/get_beatmaps`
    let maps = await get(path, [["limit", 200]]);
    maps.forEach(map => {
        if(maxBeatmapSetID < Number(map.beatmapset_id))
            maxBeatmapSetID = Number(map.beatmapset_id);
    });
    localStorage.setItem("maxID", maxBeatmapSetID);
    function conscructYearCompare(year){
        return async function(map) {
            const checkingDate = new Date(map.submit_date + " UTC+0");
            if (checkingDate.getUTCFullYear() > year)
                return 1;
            if (checkingDate.getUTCFullYear() < year)
                return -1;
    
            let difference = 1;
            let previousMap = undefined;
            while(previousMap === undefined){
                [previousMap] = await get(path, [["s", Number(map.beatmapset_id) - difference]]);
                difference++;
            }
    
            if(new Date(previousMap.submit_date + " UTC+0").getUTCFullYear() === (year - 1))
                return 0;
            return 1;
        }
    }
    for(let i = 2008; i < 2008; i++){
        new Promise(async function(){console.log(`${i}: ${await binarySetSearch(conscructYearCompare(i))}`)});
    }
}
async function binarySetSearch(compare, min = 1, max = maxBeatmapSetID) {
    //compare will given a map, it should return -1 if the index is less than the correct one,
    //1 if it is more than the correct one
    //and 0 if it's correct.
    let searchID = Math.ceil((min + max) / 2);
    let map = undefined;
    let increment = function(number){return number + 1;};
    while(map === undefined){
        [map] = await get(`${apiEndpoint}/get_beatmaps`, [["s", searchID]]);
        if(map === undefined)
            searchID = increment(searchID);
        if(searchID >= max){
            increment = function(number){return number - 1;};
            searchID = Math.ceil((min + max) / 2);
            searchID = increment(searchID);
        }
    }
    switch (await compare(map)){
        case -1:
            min = searchID;
            break;
        case 1:
            max = searchID;
            break;
        case 0:
            return searchID;
    }
    return await binarySetSearch(compare, min, max);
}

//map functions
async function getBeatmaps(filters, count = 1, mapper, mode, mods = 0){
    if(typeof(mods) === "string")
        mods = modStringToInt(mods);
    const parameters = [];
    const path = `${apiEndpoint}/get_beatmaps`;

    const mapSets = Array(count);
    let complete = 0;
    for(let i = 0; i < mapSets.length; i++){
        const iCopy = i;
        new Promise(async () => {
            let mapset = undefined;
            for(let j = 0; j < retries; j++){
                const parmCopy = Array.from(parameters);
                parmCopy.push(["s", randomInt(maxBeatmapSetID, 1)]);
                mapset = await get(path, parmCopy);
                if(mapset.length > 0)
                    j = retries;
            }
            mapSets[iCopy] = mapset;
            // console.log(mapSets);
            complete++;
        });
    }
    while(count > complete){
        await new Promise(res => {setTimeout(res, 10)}); //waits 10ms as to not freeze the browser
    }
    return mapSets;
}
function intToModString(mods){

}
function modStringToInt(modString){

}

//user functions
async function getUser(user){
    
}

//other functions
//both min and max are inclusive bounds.
function randomInt(max, min){
    return Math.floor(Math.random() * (max - min - 1)) + min + 1;
}