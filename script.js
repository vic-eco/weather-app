const searchBtn = document.getElementById("search_btn");
searchBtn.addEventListener('click', handleSearchClick);

const address = document.getElementById("add_input");
address.onclick = handleToValid
const region = document.getElementById("reg_input");
region.onclick = handleToValid
const city = document.getElementById("city_input");
city.onclick = handleToValid
const degrees = document.getElementsByName("degree")

function handleToValid({target}){
    if (target.classList.contains("is-invalid"))
        target.classList.remove("is-invalid")
}

function handleSearchClick(){

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
        console.log(degree.value)
    }

    if(valid){
        apiCalls(address.value, region.value, city.value, degree.value)
    }

}

function apiCalls(add, reg, city, deg){
    const url = `https://nominatim.openstreetmap.org/search?q=${add},${reg},${city}&format=json`;

    fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
        }
    })
    .then(
        response =>{
            if (!response.ok){
                console.log("Status Code:",response.status);
                return;
            }
        
        response.json().then(
            data => {
                if(data.length === 0){
                        console.log("No results found");
                }else{
                    const latitude = data[0].lat;
                    const longitude = data[0].lon;
                    requestWeatherConditions(latitude, longitude, deg);
                }
            }
        );
        }
    )
    .catch(error=>{
        console.log('Error: ', error);
    })


}

function requestWeatherConditions(lat, lon, deg){
    
    const key = "";
    let unit;
    if(deg === 'C'){
        unit = "metric";
    }else if(deg === 'F'){
        unit = "imperial";
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&APPID=${key}`;
    
    
    fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
        }
    })
    .then(
        response =>{
            if (!response.ok){
                console.log("Status Code:",response.status);
                return;
            }
        
        response.json().then(
            data => {
                createWeatherCard(data);
            }
        );
        }
    )
    .catch(error=>{
        console.log('Error: ', error);
    })
}

function createWeatherCard(data){

}