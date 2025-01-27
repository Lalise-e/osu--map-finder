const searchForm = document.querySelector("#search-form")

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
