//I could include a UML diagram in the README
//A plain javascript application (with webpack, great help for organization)

import Covid19Data from './Covid19Data';
import UserInterface from './UserInterface';

// const path = '/dist/'; //development
const path = '/'; //production
let covid19Data = new Covid19Data();
let userInterface = new UserInterface();

//Routing
if(window.location.pathname.localeCompare(path + "index.html") === 0){
    // window.location.pathname = "all_country_data.html"; //redirect
}else if(window.location.pathname.localeCompare(path + "all_country_data.html") === 0){
    getUSData();
}else if(window.location.pathname.localeCompare(path + "all_states_data.html") === 0){
    userInterface.buildForm.generateStateDropDownMenu();
    addEventListenerStatesMenu();
    
    getStatesData();
}else if(window.location.pathname.localeCompare(path + "single_day.html") === 0){
    userInterface.buildForm.generateSelectSingleDate();
    addEventListenerSubmitBtn();

    getSingleDayData();
}

function addEventListenerStatesMenu(){
    let statesMenu = document.getElementById('state-input');
    statesMenu.addEventListener('change', getStatesData)
}
function addEventListenerSubmitBtn(){
    let submitBtn = document.getElementById('submit-btn');
    submitBtn.addEventListener('click', getSingleDayData);
}
async function getUSData(){
    let data = await covid19Data.getAllUSData();
    data.pop(); data.pop();
    userInterface.displayAllData(data)
}
async function getStatesData(){
    let data = await covid19Data.getAllStatesData();
    userInterface.displayAllData(data)
}
async function getSingleDayData(){
    let data = await covid19Data.getUSTotalsByDate();
    userInterface.displayOneDayOfUSTotals(data)
}