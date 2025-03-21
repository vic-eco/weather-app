const key = "";

const searchBtn = document.getElementById("search_btn");
searchBtn.addEventListener('click', handleSearchClick);

const address = document.getElementById("add_input");
address.onclick = handleToValid
const region = document.getElementById("reg_input");
region.onclick = handleToValid
const city = document.getElementById("city_input");
city.onclick = handleToValid
const degrees = document.getElementsByName("degree")

let cardOn = 0;

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
                    requestWeatherConditions(data[0].lat, data[0].lon, deg);
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
    
    let unit;
    if(deg === 'C'){
        unit = "metric";
    }else if(deg === 'F'){
        unit = "imperial";
    }

    const outerURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&APPID=${key}`;
    const innerURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&APPID=${key}`;

    fetch(outerURL, {
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
            outerData => {
                fetch(innerURL, {
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
                        innerData => {
                            createWeatherCard(outerData, innerData, deg);
                        }
                    );
                    }
                )
                .catch(error=>{
                    console.log('Error: ', error);
                })
            }
        );
        }
    )
    .catch(error=>{
        console.log('Error: ', error);
    })
}

function createWeatherCard(dataNow,dataNextHours, deg){
    console.log(dataNow);
    console.log(dataNextHours);
    let windUnit;
    if (deg === 'C'){
        windUnit = "meters/sec";
    }else{
        windUnit = "miles/hour";
    }

    let desc = dataNow.weather[0].description;
    desc = capitalizeWords(desc);

    const icon = dataNow.weather[0].icon;
    const temp = dataNow.main.temp
    const tempMin = dataNow.main["temp_min"];
    const tempMax = dataNow.main["temp_max"];
    const pressure = dataNow.main.pressure;
    const humidity = dataNow.main.humidity;
    const windSpeed = dataNow.wind.speed;
    const cloudCover = dataNow.clouds.all;
    const sunrise = formatTimestamp(dataNow.sys.sunrise);
    const sunset = formatTimestamp(dataNow.sys.sunset);
    const location = dataNow.name;


    const mainElement = document.getElementById("main")

    if(cardOn == 1){
    mainElement.removeChild(mainElement.lastChild);
    mainElement.removeChild(mainElement.lastChild);
    }

    const hLine = document.createElement("hr");
    mainElement.appendChild(hLine);

    const labels = ["Pressure:", "Humidity:", "Wind Speed:", "Cloud Cover:", "Sunrise:", "Sunset:"];
    const values = [`${pressure} hPa`, `${humidity} %`, `${windSpeed} ${windUnit}`, `${cloudCover} %`, sunrise, sunset];
    let labelIndex = 0;

    const container = document.createElement("div");
    container.classList.add("container", "mt-3");
    container.id = "weather-details-card"

    const navList = document.createElement("ul");
    navList.classList.add("nav", "nav-tabs");


    for(let i=0; i<2; i++){
        const listItem = document.createElement("li");
        listItem.classList.add("nav-item");
        const anchor = document.createElement("a");
        anchor.classList.add("nav-link");
        anchor.setAttribute("data-bs-toggle", "tab");

        if(i%2 == 0){
            anchor.classList.add("active");
            anchor.setAttribute("href", "#right-now");
            anchor.innerHTML = "Right Now";
        }else{
            anchor.setAttribute("href", "#next-24-hours");
            anchor.innerHTML = "Next 24 Hours";
        }

        listItem.appendChild(anchor);
        navList.appendChild(listItem);
    }

    container.appendChild(navList);


    const tabs = document.createElement("div");
    tabs.classList.add("tab-content", "bg-light");

    const rightNow = document.createElement("div");
    rightNow.id = "right-now";
    rightNow.classList.add("tab-pane", "fade", "show", "active");

    const rowOuter = document.createElement("div");
    rowOuter.classList.add("row");

    const tabDivider = document.createElement("div");
    tabDivider.classList.add("col-md-6");

    const rowInner = document.createElement("div");
    rowInner.classList.add("row", "px-2", "pt-2");

    const generalInfo = document.createElement("div");
    generalInfo.classList.add("text-end");

    const generalInfo2 = generalInfo.cloneNode();

    generalInfo.innerHTML = `<h6 id="weather-desc">${desc} in ${location}</h6>`;
    generalInfo2.innerHTML = `<h2 id="temp">${temp} °${deg}</h2>`

    rowInner.appendChild(generalInfo);
    rowInner.appendChild(generalInfo2);

    const lowHigh = document.createElement("div");
    lowHigh.id = "low-high";
    lowHigh.classList.add("text-end");
    const low = document.createElement("span");
    low.style.color = "blue";
    low.textContent = `L:${tempMin} °${deg}`;
    const line = document.createElement("span");
    line.textContent = " | ";
    const high = document.createElement("span");
    high.style.color = "red";
    high.textContent = `H:${tempMax} °${deg}`;

    lowHigh.appendChild(low);
    lowHigh.appendChild(line);
    lowHigh.appendChild(high);

    rowInner.appendChild(lowHigh)

    const tableContainer = document.createElement("div");
    tableContainer.classList.add("px-4");

    const table = document.createElement("table");
    table.classList.add("table", "table-striped", "text-center");
    const tableBody = document.createElement("tbody");


    for(let i=0; i<6; i++){
        const tableRow = document.createElement("tr");
        const rowLabel = document.createElement("td");
        rowLabel.textContent = labels[labelIndex];
        const rowData = document.createElement("td");
        rowData.textContent = values[labelIndex++];

        tableRow.appendChild(rowLabel);
        tableRow.appendChild(rowData);
        tableBody.appendChild(tableRow);
    }

    table.appendChild(tableBody);
    tableContainer.appendChild(table);
    rowInner.appendChild(tableContainer);

    tabDivider.appendChild(rowInner);
    rowOuter.appendChild(tabDivider);

    const tabDivider2 = tabDivider.cloneNode(false);
    const mapDiv = document.createElement("div");
    mapDiv.id = "map";
    mapDiv.classList.add("map")

    tabDivider2.appendChild(mapDiv);

    rowOuter.appendChild(tabDivider2)

    rightNow.appendChild(rowOuter);
    tabs.appendChild(rightNow);

    const next24Hours = document.createElement("div");
    next24Hours.id = "next-24-hours";
    next24Hours.classList.add("tab-pane", "fade");

    tabs.appendChild(next24Hours);

    container.appendChild(tabs);

    mainElement.appendChild(container);

    
    let map = new ol.Map({ 
        target: 'map',
        layers: [
        new ol.layer.Tile({
        source: new ol.source.OSM()
        })
        ],
        view: new ol.View({
        center: ol.proj.fromLonLat([parseFloat(dataNow.coord.lon), parseFloat(dataNow.coord.lat)]),
        zoom: 15
        })
       });

    let layer_temp = new ol.layer.Tile({
        source: new ol.source.XYZ({
        url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${key}`,
        })
       });
    
    map.addLayer(layer_temp);

    cardOn = 1;
    // <div class="container mt-4">
    // <ul class="nav nav-tabs">
    //     <li class="nav-item">
    //         <a class="nav-link active" data-bs-toggle="tab" href="#right-now">Right Now</a>
    //     </li>
    //     <li class="nav-item">
    //         <a class="nav-link" data-bs-toggle="tab" href="#next-24-hours">Next 24 Hours</a>
    //     </li>
    // </ul>

    // <div class="tab-content bg-light">
    //     <div id="right-now" class="tab-pane fade show active">
    //         <div class="row">
    //             <div class="col-md-6">
    //                 <div class="px-2 pt-2 row">
    //                     <div class="text-end"><h6 id="weather-desc">Scattered Clouds in Athalassa</h6></div>
    //                     <div class="text-end"><h2 id="temp">13.84 °C</h2></div>

    //                     <div class="text-end" id="low-high">
    //                         <span>L:13.84 °C</span>
    //                         <span> | </span>
    //                         <span>H:18.84 °C</span>
    //                     </div>
                        
    //                     <div class="px-4">
    //                     <table class="table text-center">
    //                         <tr>
    //                             <td>Pressure:</td>
    //                             <td>1024 hPa</td>
    //                         </tr>
    //                          <tr>
    //                             <td>Pressure:</td>
    //                             <td>1024 hPa</td>
    //                         </tr>

    //                         <tr>
    //                             <td>Pressure:</td>
    //                             <td>1024 hPa</td>
    //                         </tr>
    //                          <tr>
    //                             <td>Pressure:</td>
    //                             <td>1024 hPa</td>
    //                         </tr>

    //                         <tr>
    //                             <td>Pressure:</td>
    //                             <td>1024 hPa</td>
    //                         </tr>
    //                          <tr>
    //                             <td>Pressure:</td>
    //                             <td>1024 hPa</td>
    //                         </tr>
    //                     </table>
    //                     </div>
    //                 </div>
    //             </div>
    //             <div class="col-md-6">
    //                 <img src="sky.jpg" class="weather-map" alt="Weather Map">
    //             </div>
    //         </div>
    //     </div>

    //     <div id="next-24-hours" class="tab-pane fade">
    //         <p>Next 24 hours forecast coming soon...</p> -->
    //     </div>
}

function capitalizeWords(str) {
    return str.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }