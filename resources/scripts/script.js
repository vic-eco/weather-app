const key = "";

const searchBtn = document.getElementById("search_btn");
searchBtn.addEventListener('click', handleSearchClick);

const clearBtn = document.getElementById("clear-btn");
clearBtn.addEventListener('click', handleClearClick);

const logBtn = document.getElementById("log-btn");
logBtn.addEventListener('click', handleLogClick);

const address = document.getElementById("add_input");
address.onclick = handleToValid
const region = document.getElementById("reg_input");
region.onclick = handleToValid
const city = document.getElementById("city_input");
city.onclick = handleToValid
const degrees = document.getElementsByName("degree")

const mainElement = document.getElementById("main")

let cardOn = 0;
let updateLogs = 0;

async function handleSearchClick(){

    searchBtn.setAttribute("disabled", true);
    document.querySelector("html").style.cursor = "wait";

    let degree;
    let valid = true;
    
    for (let i = 0; i < degrees.length; i++){
        if (degrees[i].checked){
            degree = degrees[i]
        }

    }
    if (address.value.match(/^\s*$/)){
        address.classList.add("is-invalid")
        valid = false
    }
    if (region.value.match(/^\s*$/)){
        region.classList.add("is-invalid")
        valid = false
    }
    if (city.value.match(/^\s*$/)){
        city.classList.add("is-invalid")
        valid = false
    }
    if(degree.value.match(/^\s*$/) || (degree.value !== 'C' && degree.value !== 'F')){
        degree.classList.add("is-invalid")
        valid = false
    }

    if(valid){
        const [lat, lon] = await requestLatLon(address.value, region.value, city.value)
        if (!lat || !lon){
            searchBtn.removeAttribute("disabled");
            document.querySelector("html").style.cursor = "";
        }
        const [weatherdata, forecastData] = await requestWeatherData(lat, lon, degree.value);
        createWeatherCard(weatherdata, forecastData, degree.value);
        createCharts(forecastData, degree.value, region.value, city.value);
        await storeToDB(region.value, city.value, address.value, "Cyprus");
        cardOn = 1;
        updateLogs = 1;
    }

    searchBtn.removeAttribute("disabled");
    document.querySelector("html").style.cursor = "";
}

function handleClearClick(){
    //Remove invalid messages
    if (address.classList.contains("is-invalid"))
        address.classList.remove("is-invalid")
    if (region.classList.contains("is-invalid"))
        region.classList.remove("is-invalid")
    if (city.classList.contains("is-invalid"))
        city.classList.remove("is-invalid")

    //Clear text boxes
    address.value = "";
    region.value = "";
    city.value = "";

    //Reset to Celcius
    degrees[0].checked = true;

    //Remove results
    if (cardOn === 1){
        mainElement.removeChild(mainElement.lastChild);
        mainElement.removeChild(mainElement.lastChild);
        mainElement.removeChild(mainElement.lastChild);
        mainElement.removeChild(mainElement.lastChild);
    }

    cardOn = 0;
}

async function handleLogClick() {
    let modal = document.getElementById('logs-modal');  

    if (!modal || updateLogs === 1) {
        const data = await retrieveLogsFromDB();
        modal = createLogsModal(data);
        document.querySelector("body").appendChild(modal);
    }

    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();

    updateLogs = 0;
}


function handleToValid({target}){
    if (target.classList.contains("is-invalid"))
        target.classList.remove("is-invalid")
}
