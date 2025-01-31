import { getBeatmaps, initialize } from "./api.js";
const searchForm = document.querySelector("#search-form");
const resultList = document.querySelector("#result-list");

//Events
async function searchSubmit(e){
    e.preventDefault();
    const mapSets = await getBeatmaps([], 2);
    mapSets.forEach(e =>{
        createSetArticle(e);
    })
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
    const field = createFieldset(fieldName)
    options.forEach(element => {
        const name = `${fieldName}-${element}`
        const label = document.createElement("label");
        label.setAttribute("for", `${name}`)
        label.innerText = element;
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox")
        checkbox.setAttribute("id", `${name}`)
        checkbox.setAttribute("name", `${name}`);
        field.appendChild(label);
        field.appendChild(checkbox);
    });
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
    article.innerHTML = 
`<header style="background-image: url(https://assets.ppy.sh/beatmaps/${map.beatmapset_id}/covers/cover.jpg);">
    <ul class="difficulties vertical list" id="${diffListID}">
    </ul>
</header>
<main>
    <a href="https://osu.ppy.sh/beatmapsets/${map.beatmapset_id}" target="_blank" class="mapset-title">${map.title}</a>
    <p class="mapset-artist">${map.artist}</p>
    <p class="mapset-status">${status}</p>
    <p class="mapset-submit">Submited: <time datetime="${map.submit_date} UTC+0">${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}</time></p>
    <a href="osu://s/${map.beatmapset_id}" target="_blank" class="mapset-download">Download!</a>
</main>
<footer>
    <a class="mapset-creator" target="_blank" href="https://osu.ppy.sh/users/${map.creator_id}">${map.creator}</a>
</footer>`;
    const diffList = article.querySelector(`#${diffListID}`);
    mapSet.forEach(e =>{
        const listItem = document.createElement("li");
        listItem.innerHTML = `☆${Number(e.difficultyrating).toFixed(2)} - ${e.version}`;
        diffList.appendChild(listItem);
    })
    resultList.appendChild(article);
}

initialize();

//Add events
searchForm.addEventListener('submit', searchSubmit);