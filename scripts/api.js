//file wide constants.
import { API_KEY } from "./key.js";
export { initialize, getBeatmaps, intToModString, modStringToInt, getUser };
const apiEndpoint = "https://osu.ppy.sh/api";
const rateLimit = 1000;
const rateLimitPeriod = 60000; //1 min
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
    const path = `${apiEndpoint}/get_beatmaps`
    let maps = await get(path, []);
    maps.forEach(map => {
        if(maxBeatmapSetID < Number(map.beatmapset_id))
            maxBeatmapSetID = Number(map.beatmapset_id);
    });
}
}

//map functions
function getBeatmaps(filters, count = 1, mapper, mode, mods = 0){
    if(typeof(mods) === "string")
        mods = modStringToInt(mods);
function intToModString(mods){

}
function modStringToInt(modString){

}

//user functions
function getUser(user){
    
}