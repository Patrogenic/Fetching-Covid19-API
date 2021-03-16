import BuildForm from './BuildForm';

/*
    The UserInterface class receives data and displays the data.
    BuildForm is instanstiated here and tucked away in this class.
*/

class UserInterface{
    constructor(){
        this.buildForm = new BuildForm();
    }

    displayAllData(data){
        let dataContainer = document.getElementById('data-container');
        dataContainer.innerHTML = '';
        
        let monthContainer = document.createElement('div');
        let currentMonth = new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(data[data.length - 1].date));
        let currentYear = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(new Date(data[data.length - 1].date));
        let monthHeading = document.createElement('div');
        let idCounter = 0;

        //we iterate the array backwards; data[0] is the most recent date, data[data.length - 1] is the oldest date
        for (let i = data.length - 1; i >= 0; i--) {
            let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(new Date(data[i].date));
            let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(data[i].date));
            let da = new Intl.DateTimeFormat('en', { day: 'numeric' }).format(new Date(data[i].date));

            //This checks to see if we have looped on to the next month
            if(currentMonth.localeCompare(mo) !== 0){
                monthHeading.innerHTML = currentMonth + " " + currentYear;
                this.buildMonthContainer(monthHeading, monthContainer, dataContainer, idCounter)
                idCounter++;

                monthHeading = document.createElement('div');
                monthContainer = document.createElement('div');;

                currentMonth = mo;
                currentYear = ye;
            }
            monthContainer.appendChild(this.buildDataPoint(data[i], da));
        }
        monthHeading.innerHTML = currentMonth + " " + currentYear;
        this.buildMonthContainer(monthHeading, monthContainer, dataContainer, idCounter)
    }
    buildDataPoint(dataPoint, day){
        let dataPointEl = document.createElement('div');

        dataPointEl.appendChild(this.makeElement('day-data-point', day, 'span'));

        dataPointEl.appendChild(this.buildTotalNewContainer(dataPoint));

        dataPointEl.classList.add('data-point');

        return dataPointEl;
    }
    buildTotalNewContainer(dataPoint){
        let labelNumberGroupEl = document.createElement('div');
        let totalNewContainer = document.createElement('div');

        totalNewContainer.classList.add('total-new-container');

        labelNumberGroupEl.appendChild(this.makeElement('labels-data-point', ' Total: ', 'span'));
        labelNumberGroupEl.appendChild(this.makeElement('numbers-data-point', this.numberWithCommas(dataPoint.cases.total.value || 0), 'span'));
        totalNewContainer.appendChild(labelNumberGroupEl);

        labelNumberGroupEl = document.createElement('div');
        labelNumberGroupEl.appendChild(this.makeElement('labels-data-point', ' New: ', 'span'));
        labelNumberGroupEl.appendChild(this.makeElement('numbers-data-point', this.numberWithCommas(dataPoint.cases.total.calculated.change_from_prior_day || 0), 'span'));

        totalNewContainer.appendChild(labelNumberGroupEl);
        return totalNewContainer;
    }
    buildMonthContainer(monthHeading, monthContainer, dataContainer, idCounter){
        monthContainer.classList.add('month-container');
        monthHeading.classList.add('month-heading');
        monthHeading.id = idCounter;
        monthContainer.id = idCounter + "container";

        monthHeading.addEventListener('click', this.expandMonth.bind(this));

        dataContainer.appendChild(monthHeading); //monthheading currently has no text
        dataContainer.appendChild(monthContainer);
    }
    displayOneDayOfUSTotals(data){
        let cases = data.cases.total.value;
        let changeFromPriorDay = data.cases.total.calculated.change_from_prior_day;
        let populationPercentInfected = data.cases.total.calculated.population_percent;
        let testsAdministered = data.testing.total.value;
        let totalDeaths = data.outcomes.death.total.value;
        let percentOfPopulationDeaths = data.outcomes.death.total.calculated.population_percent;

        //I can use the object to format all the data correctly (the api returns null for certain values on certain dates, so I include "|| 0")
        let dataExtracted = {
            "Cases": this.numberWithCommas(cases || 0),
            "New Cases": this.numberWithCommas(changeFromPriorDay || 0),
            "Percent of population infected": (populationPercentInfected || 0) + "%",
            "Total tests administered": this.numberWithCommas(testsAdministered || 0),
            "Total death toll": this.numberWithCommas(totalDeaths || 0),
            "Percent of population dead": (percentOfPopulationDeaths || 0) + "%"
        }

        //I loop through the property names of the object to display the data
        let keys = Object.keys(dataExtracted);

        let dataContainer = document.getElementById('data-container');
        dataContainer.innerHTML = '';

        for (let i = 0; i < keys.length; i++) {
            let labelNumberGroupEl = document.createElement('div');
            labelNumberGroupEl.classList.add('data-details');
            labelNumberGroupEl.innerHTML = keys[i] + ": " + dataExtracted[keys[i]]; //might split into two elements, but we will see
            
            //make some kind of CSS class to add to the elements
            dataContainer.appendChild(labelNumberGroupEl);
        }
    }
    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    makeElement(styleClass, text, type){
        let element = document.createElement(type);
        element.classList.add(styleClass);
        element.innerHTML = text;
        return element;
    }
    expandMonth(event){
        let currEl = event.srcElement;
        let monthContainer = document.getElementById(currEl.id + "container");
        let animationStyle = document.getElementById('animation-style');
        let height = monthContainer.childNodes.length * 45;

        //solution to handling dynamic animations (not ideal, see footnote at the bottom of the file (1))
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
        }
    }
}

export default UserInterface;


/* (1)
    a) [The Issue] Identical styles can be appended indefinitely. A new style is added on every button click.
    While that is true, this is unlikely to impact the user experience in any way.

    b) Another solution is to make 31 static styles, not an attractive solution, and not fun to maintain, but viable.

    c) Using a CSS preprocessor could provide a better solution (SASS for example)

    d) Possibly the best solution would be to add styles to an array when
    they don't exist on every button click. On every button click I would check to see if
    a certain style exists in the array, and if not, I can add it to the array. No more
    than six styles would ever be added (months with days 28-31, first month, last month)

*/