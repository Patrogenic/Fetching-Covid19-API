
/*
    The Covid19Data class handles getting form data, submits API requests,
    and returns data. In the context of this application, all that data is
    then fed into the UserInterface class.
*/

class Covid19Data{
    constructor(){
        //the API has time bounds
        //January 14, 2020 is the first day, March 6, 2021 will be the last day
        this.firstDate = new Date(2020, 0, 14);
        this.lastDate = new Date();
        this.lastDate.setDate(this.lastDate.getDate() - 1); //the API doesn't always have data for current day; set the bound to yesterday

        if(this.lastDate.getTime() > new Date(2021, 2, 6).getTime()){
            this.lastDate = new Date(2021, 2, 6); //this is the last day the api will provide data
        }
    }
    //Perhaps for this function, I can just call the total by date function with a specific number
    //I can set the values of the inputs then just call that function instead of having this one
    //Perhaps I can put that data on the home page
    getUSTotals(){
        fetch("")
        .then(response => {
            return response.json();
        })
        .then(json => {
            let data = json[0];
            // console.log(data);
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
            document.getElementById('data-container').innerHTML = 'Invalid input, out of bounds';
            return;
        }

        //Formatting the date
        const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
        const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
        const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
        let dateFormatted = ye + "-" + mo + "-" + da;

        document.getElementById('data-container').innerHTML = "Loading...";

        return(fetch("https://api.covidtracking.com/v2/us/daily/" + dateFormatted + ".json")
        .then(response => {
            return response.json();
        })
        .then(json => {
            let data = json.data;
            
            return data;
        })
        .catch(err => {
            console.error(err);
        }))
    }
    getAllUSData(){
        document.getElementById('data-container').innerHTML = "Loading...";
        return (fetch('https://api.covidtracking.com/v2/us/daily.json')
            .then(response => {
                return response.json();
            })
            .then(json => {
                let data = json.data;

                data.pop(); data.pop(); //the API returns undefined for the case number on 2020-01-13, so I remove that entry
                
                // console.log(data);
                return data;
            }))
    }
    getAllStatesData(){
        let stateInput = document.getElementById('state-input').value;
        let dataContainer = document.getElementById('data-container');
        dataContainer.innerHTML = "Loading...";

        return (fetch('https://api.covidtracking.com/v2/states/' + stateInput + '/daily.json')
            .then(response => {
                return response.json();
            })
            .then(json => {
                let data = json.data;

                //the API returns null for some early data values, so I clean that up
                while(data[data.length - 1].cases.total.value === null){
                    data.pop();
                }
                //I might need to clean the data a little more here

                return data;
            }))
    }
}

export default Covid19Data;