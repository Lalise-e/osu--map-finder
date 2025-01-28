//file wide constants.
import { API_KEY } from "./key.js";
export { getBeatmaps, intToModString, modStringToInt, getUser };
const apiEndpoint = "https://osu.ppy.sh/api";

//api functions
async function get(path, parameters){
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