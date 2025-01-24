//file wide constants.
import { API_KEY } from "./key.js";
const apiEndpoint = "https://osu.ppy.sh/p/api";

//api functions
function get(path, parameters){

}

//map functions
export function getBeatmaps(filters, count = 20, mapper, mode, mods = 0){
    if(typeof(mods) === "string")
        mods = modStringToInt(mods);
}
export function intToModString(mods){

}
export function modStringToInt(modString){

}

//user functions
export function getUser(user){
    
}