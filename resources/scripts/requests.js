/*
 * Makes an HTTP request to the Nominatim OpenStreetMap API
 * based on an address, region and city.
 * 
 * returns latitude and longitude
 */ 
async function requestLatLon(add, reg, city){
    const url = `https://nominatim.openstreetmap.org/search?q=${add},${reg},${city}&format=json`;

    try{
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json",
            }
        });

        if (!response.ok){
            console.log("Status Code:",response.status);
            throw new Error("Failed to fetch data");
        }

        data = await response.json();
        if(data.length === 0){
            alert("Results Not Found! Try Again.")
            return [null,null];
        }else{
            return [data[0].lat, data[0].lon];
        }
    }catch(error){
        console.log('Error: ', error);
        return null;
    }

}

/*
 * Makes two HTTP requests to the OpenWeatherMap API
 * based on an latitude, longitute and chosen degree unit.
 * 
 * First request: current weather data
 * Second request: 5 day weather forecast data
 * 
 * returns current weather data and forecast data 
 */ 
async function requestWeatherData(lat, lon, deg){
    let unit;
    if(deg === 'C'){
        unit = "metric";
    }else if(deg === 'F'){
        unit = "imperial";
    }

    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&APPID=${key}`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&APPID=${key}`;

    try{

    //current weather
    const weatherResponse = await fetch(weatherURL, {
        method: "GET",
        headers: {
            "Accept": "application/json",
        }
    });

    if (!weatherResponse.ok){
        console.log("Status Code:",weatherResponse.status);
        throw new Error("Failed to fetch data");
    }

    const weatherData = await weatherResponse.json();

    //5 day forecast
    const forecastResponse = await fetch(forecastURL, {
        method: "GET",
        headers: {
            "Accept": "application/json",
        }
    });

    if (!forecastResponse.ok){
        console.log("Status Code:",forecastResponse.status);
        throw new Error("Failed to fetch data");
    }

    const forecastData = await forecastResponse.json();
    return [weatherData, forecastData];

    }catch(error){
        console.log('Error: ', error);
        return null;
    }
}

/*
 * Stores search values to database.
 */
async function storeToDB(region, city, address, country){

    const body = {
        region: region,
        city: city,
        address: address,
        country: country
    };

    try{
        const response = await fetch("./resources/server/storeSearch.php", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(body), 
        });
        if (!response.ok){
            console.log("Status Code:",response.status);
            throw new Error("Failed to store data");
        }

        const data = await response.json()

        console.log(data);

    }catch(error){
        console.log('Error: ', error);
        return null;
    }
}

/* 
 * Requests last 5 searches from database.
 */
async function retrieveLogsFromDB(region, city, address, country){

    try{
        const response = await fetch("./resources/server/getLogs.php", {
            method: "GET",
            headers: {
            "Accept": "application/json"
            },
        });
        if (!response.ok){
            console.log("Status Code:",response.status);
            throw new Error("Failed to store data");
        }

        const data = await response.json()
        return data;

    }catch(error){
        console.log('Error: ', error);
        return null;
    }
}