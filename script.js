const months = {
    0 :"January",
    1 :"February",
    2 :"March",
    3 :"April",
    4 :"May",
    5 :"June",
    6 :"July",
    7 :"August",
    8 :"September",
    9 :"October",
    10 :"November",
    11 :"December"
}

//TODO
//-major refactoring and seperating UI concerns with the getting data concerns
//--I should have seperate classes for getting the covid19 data and displaying the data
class Covid19Data{
    constructor(){
        //the API has time bounds
        //January 14, 2020 is the first day, March 6, 2021 will be the last day
        this.firstDate = new Date(2020, 0, 14);
        this.lastDate = new Date();

        if(this.lastDate.getTime() > new Date(2021, 2, 6).getTime()){
            this.lastDate = new Date(2021, 2, 6); //last day the api will provide data
        }
    }
    //Perhaps for this function, I can just call the total by date function with a specific number
    //I can set the values of the inputs then just call that function instead of having this one
    //Perhaps I can put that data on the home page
    getUSTotals(){
        fetch("https://covid-19-data.p.rapidapi.com/totals?format=json", {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "b7a09f2741mshfcc771832e886aep190d16jsnaae30473af9e",
                "x-rapidapi-host": "covid-19-data.p.rapidapi.com"
            }
        })
        .then(response => {
            return response.json();
        })
        .then(json => {
            let data = json[0];
            console.log(data);
        })
        .catch(err => {
            console.error(err);
        });
    }
    getUSTotalsByDate(){
        let yearInput = document.getElementById('year-input').value;
        let monthsInput = document.getElementById('months-input').value - 1;
        let dayInput = document.getElementById('days-input').value;

        const d = new Date(yearInput, monthsInput, dayInput); //2020-01-14 is day 1 of statistics

        if(this.firstDate.getTime() > d.getTime() || this.lastDate.getTime() < d.getTime()){
            console.log('invalid input, out of bounds');
            document.getElementById('data-container').innerHTML = 'Invalid input, out of bounds';
            return;
        }

        //Formatting the date
        const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
        const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
        const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
        let dateFormatted = ye + "-" + mo + "-" + da;

        document.getElementById('data-container').innerHTML = "Loading...";

        fetch("https://api.covidtracking.com/v2/us/daily/" + dateFormatted + ".json")
        .then(response => {
            return response.json();
        })
        .then(json => {
            let data = json.data;
            let cases = data.cases.total.value;
            let changeFromPriorDay = data.cases.total.calculated.change_from_prior_day;
            let populationPercentInfected = data.cases.total.calculated.population_percent;
            let testsAdministered = data.testing.total.value;
            let totalDeaths = data.outcomes.death.total.value;
            let percentOfPopulationDeaths = data.outcomes.death.total.calculated.population_percent;

            //interesting, I can use the object to format all the data correctly (the api returns null for certain values on certain dates, so I include "|| 0")
            let dataExtracted = {
                "Cases": numberWithCommas(cases || 0),
                "New Cases": numberWithCommas(changeFromPriorDay || 0),
                "Percent of population infected": (populationPercentInfected || 0) + "%",
                "Total tests administered": numberWithCommas(testsAdministered || 0),
                "Total death toll": numberWithCommas(totalDeaths || 0),
                "Percent of population dead": (percentOfPopulationDeaths || 0) + "%"
            }

            let keys = Object.keys(dataExtracted);

            let dataContainer = document.getElementById('data-container');
            dataContainer.innerHTML = '';

            for (let i = 0; i < keys.length; i++) {
                console.log(keys[i] + ": " + dataExtracted[keys[i]]);
                let divEl = document.createElement('div');
                divEl.innerHTML = keys[i] + ": " + dataExtracted[keys[i]]; //might split into two elements, but we will see
                //make some kind of CSS class to add to the elements

                dataContainer.appendChild(divEl);
            }
            function numberWithCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        })
        .catch(err => {
            console.error(err);
        });
    }
    getAllUSData(){
        document.getElementById('data-container').innerHTML = "Loading...";
        fetch('https://api.covidtracking.com/v2/us/daily.json')
            .then(response => {
                return response.json();
            })
            .then(json => {
                let data = json.data;

                data.pop(); data.pop(); //the API returns undefined for the case number on 2020-01-13, so I remove that entry
                
                this.displayData(data);
            })
    }
    getAllStatesData(){
        let stateInput = document.getElementById('state-input').value;
        let dataContainer = document.getElementById('data-container');
        dataContainer.innerHTML = "Loading...";

        fetch('https://api.covidtracking.com/v2/states/' + stateInput + '/daily.json')
            .then(response => {
                return response.json();
            })
            .then(json => {
                let data = json.data;

                //the API returns null for some early data values, so I clean that up
                while(data[data.length - 1].cases.total.value=== null){
                    data.pop();
                }

                this.displayData(data);
            })
    }
    displayData(data){
        let dataContainer = document.getElementById('data-container');
        dataContainer.innerHTML = '';

        
        let monthContainer = document.createElement('div');
        let currentMonth = new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(data[data.length - 1].date));
        let currentYear = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(new Date(data[data.length - 1].date));
        let monthHeading = document.createElement('div');
        let idCounter = 0;

        //data[0] is the most recent date, data[data.length - 1] is the oldest date
        for (let i = data.length - 1; i >= 0; i--) {
            // console.log(data[i].date + " " + data[i].cases.total.value);
            let dataPointEl = document.createElement('div');

            let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(new Date(data[i].date));
            let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(data[i].date));
            let da = new Intl.DateTimeFormat('en', { day: 'numeric' }).format(new Date(data[i].date)); 
            let dateFormatted = mo + " " + da + ', ' + ye;

            //I have to format this data to make it look better, add commas and whatnot (which will also add length)
            //It looks like I will just have to use multiple lines for the display
            dataPointEl.appendChild(this.makeElement('day-data-point', da, 'span'));
            let divEl = document.createElement('div');
            let divEl2 = document.createElement('div');

            divEl2.classList.add('total-new-container');

            divEl.appendChild(this.makeElement('labels-data-point', ' Total: ', 'span'));
            divEl.appendChild(this.makeElement('numbers-data-point', this.numberWithCommas(data[i].cases.total.value || 0), 'span'));
            divEl2.appendChild(divEl);

            divEl = document.createElement('div');
            divEl.appendChild(this.makeElement('labels-data-point', ' New: ', 'span'));

            divEl.appendChild(this.makeElement('numbers-data-point', this.numberWithCommas(data[i].cases.total.calculated.change_from_prior_day || 0), 'span'));

            divEl2.appendChild(divEl);
            dataPointEl.appendChild(divEl2);

            dataPointEl.classList.add('data-point');

            if(currentMonth.localeCompare(mo) !== 0){
                monthHeading.innerHTML = currentMonth + " " + currentYear; //also will probably add a class and child elements
                //monthHeading.classList.add();
                monthContainer.classList.add('month-container');
                monthHeading.classList.add('month-heading');
                monthHeading.id = idCounter;
                monthContainer.id = idCounter + "container"; //possibly could be idCounter++, since that increments after assignment
                idCounter++;

                monthHeading.addEventListener('click', this.expandMonth.bind(this));
                monthHeading.style.cursor = "pointer";

                dataContainer.appendChild(monthHeading);
                dataContainer.appendChild(monthContainer);

                monthHeading = document.createElement('div');
                monthContainer = document.createElement('div');;

                currentMonth = mo;
                currentYear = ye;
            }
            monthContainer.appendChild(dataPointEl);
        }
        monthHeading.innerHTML = currentMonth + " " + currentYear; //also will probably add a class and child elements
        monthContainer.classList.add('month-container');
        monthHeading.classList.add('month-heading');
        monthHeading.id = idCounter;
        monthContainer.id = idCounter + "container";
        monthHeading.addEventListener('click', this.expandMonth.bind(this));

        dataContainer.appendChild(monthHeading); //monthheading currently has no text
        dataContainer.appendChild(monthContainer);
    }
    makeElement(styleClass, text, type){
        let element = document.createElement(type);
        element.classList.add(styleClass);
        element.innerHTML = text;
        return element;
    }
    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    expandMonth(event){
        let currEl = event.srcElement;
        console.log(currEl);
        let monthContainer = document.getElementById(currEl.id + "container");
        let animationStyle = document.getElementById('animation-style');
        // let childHeight = monthContainer.childNodes[0].style.height;
        // console.log('childheight: ' + childHeight);
        let height = monthContainer.childNodes.length * 45;

        //solution to handling dynamic animations
        if(monthContainer.style.animationName === 'collapse-month' + height || monthContainer.style.animationName === ''){
            animationStyle.innerHTML += "\
                \@keyframes expand-month" + height + "{\
                    from{\
                        visibility: hidden;\
                        height: 0;\
                    }\
                    to{\
                        visibility: visible;\
                        height:" + height + "px;\
                    }\
                }\
                @keyframes collapse-month" + height + "{\
                    from{\
                        visibility: visible;\
                        height:" + height + "px;\
                    }\
                    to{\
                        visibility: hidden;\
                        height: 0;\
                    }\
                }";
            monthContainer.style.animationName = "expand-month" + height;

        }else{
            monthContainer.style.animationName = "collapse-month" + height;

            console.log(true);
        }
    }
}

//--expand each month
//I might be able to use some kind of while loop for adding elements to a parent element (or maybe it's an if statement)
//if(currentMonth.localeCompare(mo) === 0){
    // append node to a container element
// }
//we kind of lose speration of concerns here, ideally this method just fetches and returns the data to some UI class that displays the data (maybe I want to fix that)
//everywhere I'm displaying information to the DOM, I should probably be passing it to a UI class (maybe I'll worry about that after the project is due)
/*
    if(!currentMonth.localeCompare(mo) === 0){
        make a new container to append children to
        append container to data-container
    }
*/

//--dynamic animations--
//perhaps I can get a style tag element by id and then modify the innerHTML for a dynamic animation
//as to whether that's good practice or not is beside the point, because it sounds pretty good to me it if will work
// console.log(document.getElementById('animation-style'));






//--form stuff--
//no event listeners for years
//one event listener for every month to change the days menu (or not)
//for form validation, reject it if it is before or after the bounds of dates the API provides