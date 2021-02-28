//make default values of 2020-01-14 (day 1)
function generateMonthsMenu(){
    let setDateForm = document.getElementById('set-date');
    let selectLabel = document.createElement('label');
    let selectEl = document.createElement('select');
    let menusContainer = document.getElementById('menus-container');

    selectLabel.htmlFor = "months";
    // selectLabel.innerHTML = "Months: ";
    selectEl.name = "months"
    selectEl.id = "months-input";

    for (let i = 0; i < 12; i++) {
        let optionEl = document.createElement('option');
        optionEl.value = i + 1;
        optionEl.innerHTML = months[i];
        selectEl.appendChild(optionEl);
    }
    //I might only need one event listener for the whole select element
    selectEl.addEventListener('change', generateDaysMenu);

    setDateForm.appendChild(selectLabel);
    menusContainer.appendChild(selectEl);
}

function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}

//the event listener that will be called when the months element changes
function generateDaysMenu(defaultDay = 0){
    if(defaultDay != 0){

    }
    let yearInput = document.getElementById('year-input').value;
    let monthsInput = document.getElementById('months-input').value;
    let numberOfDays = daysInMonth(monthsInput, yearInput);

    let daySelectEl = document.getElementById('days-input');
    daySelectEl.innerHTML = ''; // this might remove stuff I don't want removed

    for (let i = 1; i < numberOfDays + 1; i++) {
        let dayOptionEl = document.createElement('option');
        dayOptionEl.value = i;
        dayOptionEl.innerHTML = i;
        //I might just be able to put 14 instead of having a variable
        if(defaultDay === i){ //2020-01-14 is day one of the data from the api
            dayOptionEl.selected = "selected";
        }
        daySelectEl.appendChild(dayOptionEl);
    }
}

function generateForm(){
    generateMonthsMenu();

    let setDateForm = document.getElementById('set-date');
    let daySelectLabel = document.createElement('label');
    let daySelectEl = document.createElement('select');
    let menusContainer = document.getElementById('menus-container');


    daySelectLabel.htmlFor = "days";
    // daySelectLabel.innerHTML = "Days: ";
    daySelectEl.name = "days"
    daySelectEl.id = "days-input";

    setDateForm.appendChild(daySelectLabel);
    menusContainer.appendChild(daySelectEl);

    generateDaysMenu(14);

    let submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.innerHTML = 'Submit';
    submitBtn.id = "submit-btn";
    submitBtn.addEventListener('click', covid19Data.getUSTotalsByDate.bind(covid19Data));

    setDateForm.appendChild(submitBtn);
}

//if there is time, I could map abbreviations to full state names
let states = {
    1: 'AL',
    2: 'AK',
    3: 'AZ',
    4: 'AR',
    5: 'CA',
    6: 'CO',
    7: 'CT',
    8: 'DE',
    9: 'FL',
    10: 'GA',
    11: 'HI',
    12: 'ID',
    13: 'IL',
    14: 'IN',
    15: 'IA',
    16: 'KS',
    17: 'KY',
    18: 'LA',
    19: 'ME',
    20: 'MD',
    21: 'MA',
    22: 'MI',
    23: 'MN',
    24: 'MS',
    25: 'MO',
    26: 'MT',
    27: 'NE',
    28: 'NV',
    29: 'NH',
    30: 'NJ',
    31: 'NM',
    32: 'NY',
    33: 'NC',
    34: 'ND',
    35: 'OH',
    36: 'OK',
    37: 'OR',
    38: 'PA',
    39: 'RI',
    40: 'SC',
    41: 'SD',
    42: 'TN',
    43: 'TX',
    44: 'UT',
    45: 'VT',
    46: 'VA',
    47: 'WA',
    48: 'WV',
    49: 'WI',
    50 : 'WY',
}

function generateStateDropDownMenu(){
    let statesMenu = document.getElementById('state-input');

    for (let i = 1; i < 51; i++) {
        let optionEl = document.createElement('option');
        optionEl.value = states[i];
        optionEl.innerHTML = states[i];
        
        statesMenu.appendChild(optionEl);
    }
    statesMenu.addEventListener('change', covid19Data.getAllStatesData.bind(covid19Data))
}


function showFootNote(event){
    let footNoteMsg = document.getElementById('footnote-message');
    footNoteMsg.style.left = event.clientX + 10 + "px";
    footNoteMsg.style.top = event.clientY + 10 + "px";
    // footNoteMsg.style.display = "block";
    if(footNoteMsg.style.visibility.localeCompare("visible") === 0){
        footNoteMsg.style.visibility = "hidden";

    }else{
        footNoteMsg.style.visibility = "visible";
    }

    console.log('mousein');

}

function hideFootNote(event){
    let footNoteMsg = document.getElementById('footnote-message');
    // footNoteMsg.style.display = "none";
    footNoteMsg.style.visibility = "hidden";

    console.log('mouseout');

}