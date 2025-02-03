import { getBeatmaps, initialize, markDownload } from "./api.js";
import { MODE_CATCH, MODE_MANIA, MODE_OSU, MODE_TAIKO } from "./modeIcons.js";
const searchForm = document.querySelector("#search-form");
const resultList = document.querySelector("#result-list");

//Events
async function searchSubmit(e){
    e.preventDefault();
    const filters = [];
    for(let i = 0; i < searchForm.length; i++){
        //This bit might be a hard to follow but we go through each fieldset and build a filter.
        //We pass it node.values() which is a function that generates an object containing the values
        //of the fieldset. This function should be created in the applicable createX function unless a certain someone forgets to.
        const node = searchForm.children[i];
        if(node === undefined)
            continue;
        if(node.nodeName !== "FIELDSET")
            continue;
        filters.push(node.filter(node.values()));
    }

    //Ranked and loved statuses allow us to use the "since" parameter to get more efficient searches
    //That is why we have this here
    let useDateSearch = false;
    const statusFields = document.querySelector("#form-checkbox-status").values();
    Object.keys(statusFields).forEach((field, index) =>{
        if((index < 2) && (statusFields[field]))
            useDateSearch = true
        else if (statusFields[field])
            useDateSearch = false;
    })

    const mapSets = await getBeatmaps(filters, 5);
    mapSets.forEach(e =>{
        createSetArticle(e);
    })
}
async function downloadMap(beatmapsetID){
    markDownload(beatmapsetID);
    window.open(`osu://dl/${beatmapsetID}`, "_self")
}

//Functions to create form fields, the fieldName is the name that will be displayed and used in html
//filter is a function that will return true or false depending on whether a map passes it or not.
function createRadio(fieldName, options, filter){
    //Options should be 2 dimensional array of strings like this
    //[[name, keyname1, keyname2], //This will result in keyname 1 & 2 to be exclusive to each other
    //[name2, keyname3, keyname4, keyname5] // and 3, 4 & 5 to be exclusive to each other.

}
function createCheckBox(fieldName, options, filter){
    //Options should be a 1 dimensional array of strings where each item is the name of a checkbox
    fieldName = `form-checkbox-${fieldName}` 
    const field = createFieldset(fieldName);
    field["filter"] = filter;
    field["checkBoxes"] = [];
    options.forEach(element => {
        const name = `${fieldName}-${element}`
        const label = document.createElement("label");
        label.setAttribute("for", `${name}`)
        label.innerText = element;
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox")
        checkbox.setAttribute("id", `${name}`)
        checkbox.setAttribute("name", `${name}`);
        checkbox["valueName"] = element;
        field.appendChild(label);
        field.appendChild(checkbox);
        field["checkBoxes"].push(checkbox);
    });
    field["values"] = () =>{
        const result = {};
        field["checkBoxes"].forEach(element => {
            result[element["valueName"]] = element.checked;
        })
        return result;
    }
    searchForm.appendChild(field);
}
function createTextBox(fieldName, filter){

}
function createRangeSlider(fieldName, min, max, step, filter){

}
function createFieldset(name, filter){
    const field = document.createElement("fieldset");
    field.setAttribute("name", name);
    field.setAttribute("id", name);
    return field;
}

async function createSetArticle(mapSet){
    if(mapSet.length === 0)
        return;
    const [map] = mapSet;
    const diffListID = `article-difficulties-${map.beatmapset_id}`;
    let status = "";
    const date = new Date(map.submit_date + " UTC+0");
    switch(map.approved){
        case "4":
            status = "Loved!"
            break;
        case "3":
            status = "Qualified!";
            break;
        case "2":
            status = "Approved!";
            break;
        case "1":
            status = "Ranked!";
            break;
        case "0":
            status = "Pending";
            break;
        case "-1":
            status = "Work in Progress";
            break;
        case "-2":
            status = "Graveyard";
            break;
        default:
            status = "???";
            break;
    }
    const article = document.createElement("article");
    article.classList.add(["list"])
    article.classList.add(["vertical"]);
    article.innerHTML = 
`<header style="background-image: url(https://assets.ppy.sh/beatmaps/${map.beatmapset_id}/covers/list@2x.jpg);">
    <ul class="difficulties vertical list" id="${diffListID}">
    </ul>
</header>
<main class="mapset-info list vertical">
    <a href="https://osu.ppy.sh/beatmapsets/${map.beatmapset_id}" target="_blank" class="mapset-title"><h3>${map.title}</h3></a>
    <p class="mapset-artist">by ${map.artist}</p>
    <p class="mapset-submit">Submited: <time datetime="${map.submit_date} UTC+0">${date.getUTCFullYear()}-${date.getUTCMonth() + 1 /*apparently the month is 0 indexed*/}-${date.getUTCDate()}</time></p>
    <p class="mapset-status">Status: ${status}</p>
    <div class="mapset-downloads list">
        <button type="button" name="download-${map.beatmapset_id}" id="download-${map.beatmapset_id}">Download</button>
    </div>
    <!-- <a href="osu://s/${map.beatmapset_id}" class="mapset-download">Download!</a> -->
</main>
<footer class="mapset-creator list">
    <img src="https://a.ppy.sh/${map.creator_id}" class="mapset-creator-pfp">
    <a class="mapset-creator-name" target="_blank" href="https://osu.ppy.sh/users/${map.creator_id}">${map.creator}</a>
</footer>`;
    article.querySelector(`#download-${map.beatmapset_id}`).addEventListener("click", () => {downloadMap(map.beatmapset_id);});

    const diffList = article.querySelector(`#${diffListID}`);
    mapSet.forEach(e =>{
        const listItem = document.createElement("li");
        let modeSVG;
        switch(e.mode){
            case "0":
                modeSVG = MODE_OSU;
                break;
            case "1":
                modeSVG = MODE_TAIKO;
                break;
            case "2":
                modeSVG = MODE_CATCH;
                break;
            case "3":
                modeSVG = MODE_MANIA;
                break;
        }
        listItem.classList.add("list");
        listItem.innerHTML = `${modeSVG}<p>☆${Number(e.difficultyrating).toFixed(2)} - ${e.version}</p>`;
        diffList.appendChild(listItem);
    })
    resultList.appendChild(article);
}

initialize();

//Add events
searchForm.addEventListener('submit', searchSubmit);