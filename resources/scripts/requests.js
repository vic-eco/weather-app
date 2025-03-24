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
        }else{
            return [data[0].lat, data[0].lon];
            // requestWeatherConditions(data[0].lat, data[0].lon, deg, reg, city);
        }
    }catch(error){
        console.log('Error: ', error);
        return null;
    }

}

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
