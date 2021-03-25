/*
    The BuildForm class handles building the form on the single_day page,
    and the form on the all_states_data page.

    The form element that selects a state is entirely static.

    The form element that selects a date needs to update the days of the month
    according to the year and month that is selected. This allows us to account
    for the fact that months vary in days from 28 to 31.
*/
class BuildForm{
    constructor(){
        //For the future, consider mapping abbreviations to full state names
        this.states = {
            1:'AL', 2:'AK', 3:'AZ', 4:'AR', 5:'CA', 6:'CO', 7:'CT', 8:'DE', 9:'FL', 10:'GA',
            11:'HI', 12:'ID', 13:'IL', 14:'IN', 15:'IA', 16:'KS', 17:'KY', 18:'LA', 19:'ME', 20:'MD',
            21:'MA', 22:'MI', 23:'MN', 24:'MS', 25:'MO', 26:'MT', 27:'NE', 28:'NV', 29:'NH', 30:'NJ',
            31:'NM', 32:'NY', 33:'NC', 34:'ND', 35:'OH', 36:'OK', 37:'OR', 38:'PA', 39:'RI', 40:'SC',
            41:'SD', 42:'TN', 43:'TX', 44:'UT', 45:'VT', 46:'VA', 47:'WA', 48:'WV', 49:'WI', 50:'WY',
        }
        this.months = {
            0:"January", 1:"February", 2:"March", 3:"April", 4:"May", 5:"June",
            6:"July", 7:"August", 8:"September", 9:"October", 10:"November", 11:"December"
        }
    }

    generateMonthsMenu(){
        let setDateForm = document.getElementById('set-date');
        let selectMonthLabel = document.createElement('label');
        let selectMonthEl = document.createElement('select');
        let menusContainer = document.getElementById('menus-container');
    
        selectMonthLabel.htmlFor = "months";
        selectMonthEl.name = "months"
        selectMonthEl.id = "months-input";
    
        for (let i = 0; i < 12; i++) {
            let optionEl = document.createElement('option');
            optionEl.value = i + 1;
            optionEl.innerHTML = this.months[i];
            selectMonthEl.appendChild(optionEl);
        }

        selectMonthEl.addEventListener('change', this.generateDaysMenu.bind(this));
    
        setDateForm.appendChild(selectMonthLabel);
        menusContainer.appendChild(selectMonthEl);
    }
    
    daysInMonth (month, year) {
        return new Date(year, month, 0).getDate();
    }
    
    //This function is called every time the month or year menu change their value
    generateDaysMenu(defaultDay = 0){
        if(defaultDay != 0){
    
        }
        let yearInput = document.getElementById('year-input').value;
        let monthsInput = document.getElementById('months-input').value;
        let numberOfDays = this.daysInMonth(monthsInput, yearInput);
    
        let daySelectEl = document.getElementById('days-input');
        daySelectEl.innerHTML = '';
    
        for (let i = 1; i < numberOfDays + 1; i++) {
            let dayOptionEl = document.createElement('option');
            dayOptionEl.value = i;
            dayOptionEl.innerHTML = i;

            if(defaultDay === i){
                dayOptionEl.selected = "selected";
            }
            daySelectEl.appendChild(dayOptionEl);
        }
    }
    
    generateSelectSingleDate(){
        this.generateMonthsMenu();
    
        let setDateForm = document.getElementById('set-date');
        let daySelectLabel = document.createElement('label');
        let daySelectEl = document.createElement('select');
        let menusContainer = document.getElementById('menus-container');
    
        daySelectLabel.htmlFor = "days";
        daySelectEl.name = "days"
        daySelectEl.id = "days-input";
    
        setDateForm.appendChild(daySelectLabel);
        menusContainer.appendChild(daySelectEl);
    
        this.generateDaysMenu(14); //2020-01-14 is day one of the data from the api
    
        let submitBtn = document.createElement('button');
        submitBtn.type = 'button';
        submitBtn.innerHTML = 'Submit';
        submitBtn.id = "submit-btn";
    
        setDateForm.appendChild(submitBtn);

        let yearsMenu = document.getElementById('year-input');
        yearsMenu.addEventListener('change', this.generateDaysMenu.bind(this))
    }
    
    generateStateDropDownMenu(){
        let statesMenu = document.getElementById('state-input');

        for (let i = 1; i < 51; i++) {
            let optionEl = document.createElement('option');
            optionEl.value = this.states[i];
            optionEl.innerHTML = this.states[i];
            
            statesMenu.appendChild(optionEl);
        }
    }
}

export default BuildForm;