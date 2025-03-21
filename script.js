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

    let windUnit;
    let pressureUnit;
    if (deg === 'C'){
        windUnit = "meters/sec";
        pressureUnit = "hPa";
    }else{
        windUnit = "miles/hour";
        pressureUnit = "Mb";
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
    const values = [`${pressure} ${pressureUnit}`, `${humidity} %`, `${windSpeed} ${windUnit}`, `${cloudCover} %`, sunrise, sunset];
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
    next24Hours.classList.add("tab-pane", "fade", "pt-3");


    const next24HoursModal = document.createElement('div');
    next24HoursModal.classList.add("modal");
    next24HoursModal.tabIndex = -1;
    next24HoursModal.id = 'next-24-hours-modal';

    const next24HoursModalDialog = document.createElement('div');
    next24HoursModalDialog.className = 'modal-dialog';

    const next24HoursModalContent = document.createElement('div');
    next24HoursModalContent.className = 'modal-content';

    const next24HoursModalHeader = document.createElement('div');
    next24HoursModalHeader.className = 'modal-header';

    const next24HoursModalTitle = document.createElement('h5');
    next24HoursModalTitle.className = 'modal-title';
    next24HoursModalTitle.id = 'next-24-hours-modal-title';

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close';
    closeButton.setAttribute('data-bs-dismiss', 'modal');
    closeButton.setAttribute('aria-label', 'Close');

    const next24HoursModalBody = document.createElement('div');
    next24HoursModalBody.className = 'modal-body';
    next24HoursModalBody.id = "next-24-hours-modal-body";

    const next24HoursModalFooter = document.createElement('div');
    next24HoursModalFooter.className = 'modal-footer';

    const closeFooterButton = document.createElement('button');
    closeFooterButton.type = 'button';
    closeFooterButton.className = 'btn btn-danger';
    closeFooterButton.setAttribute('data-bs-dismiss', 'modal');
    closeFooterButton.textContent = 'Close';

    next24HoursModalHeader.appendChild(next24HoursModalTitle);
    next24HoursModalHeader.appendChild(closeButton);
    next24HoursModalFooter.appendChild(closeFooterButton);
    next24HoursModalContent.appendChild(next24HoursModalHeader);
    next24HoursModalContent.appendChild(next24HoursModalBody);
    next24HoursModalContent.appendChild(next24HoursModalFooter);
    next24HoursModalDialog.appendChild(next24HoursModalContent);
    next24HoursModal.appendChild(next24HoursModalDialog);

    new bootstrap.Modal(next24HoursModal);

    next24HoursModal.addEventListener('hidden.bs.modal', function () {
        next24HoursModal.querySelector('#next-24-hours-modal-title').textContent = ''; 
        next24HoursModal.querySelector('#next-24-hours-modal-body').innerHTML = '';
    });

    next24Hours.appendChild(next24HoursModal);

    const next24Table = document.createElement("table");
    next24Table.id = "next-24-table";
    next24Table.classList.add("table", "table-striped", "text-center");
    const next24TableHead = document.createElement("thead");
    
    const timeLabel = document.createElement("th");
    timeLabel.textContent = "Time";
    const summaryLabel = document.createElement("th");
    summaryLabel.textContent = "Summary";
    const tempLabel = document.createElement("th");
    tempLabel.textContent = "Temp";
    const cloudLabel = document.createElement("th");
    cloudLabel.textContent = "Cloud Cover";
    const detailsLabel = document.createElement("th");
    detailsLabel.textContent = "Details";

    next24TableHead.appendChild(timeLabel);
    next24TableHead.appendChild(summaryLabel);
    next24TableHead.appendChild(tempLabel);
    next24TableHead.appendChild(cloudLabel);
    next24TableHead.appendChild(detailsLabel);

    next24Table.appendChild(next24TableHead);

    const next24TableBody = document.createElement("tbody");

    for (let i=0; i<8; i++){
        const tableRow = document.createElement("tr");
        const tableTimeData = document.createElement("td");
        const tableSummaryData = document.createElement("td");
        const tableTempData = document.createElement("td");
        const tableCloudCoverData = document.createElement("td");
        const tableDetailsData = document.createElement("td");

        tableTimeData.textContent = formatTimestamp(new Date(dataNextHours.list[i].dt));
        
        const summaryImage = document.createElement("img");
        summaryImage.src = `https://openweathermap.org/img/wn/${dataNextHours.list[i].weather[0].icon}@2x.png`
        summaryImage.style.width = "25%";
        summaryImage.style.height = "auto";
        summaryImage.style.filter = "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.7))";
        tableSummaryData.appendChild(summaryImage);

        tableTempData.textContent = `${dataNextHours.list[i].main.temp} °${deg}`;
        tableCloudCoverData.textContent = `${dataNextHours.list[i].clouds.all}%`;

        const detailsButton = document.createElement("button");
        detailsButton.type = "button";
        detailsButton.classList.add("btn", "btn-success");
        detailsButton.textContent = "Details"
        detailsButton.setAttribute("data-bs-toggle", "modal");
        detailsButton.setAttribute("href", "#next-24-hours-modal");
        detailsButton.setAttribute("data-bs-target", "#next-24-hours-modal");
        detailsButton.id = `${i}`;
        detailsButton.addEventListener('click', ()=>{
            changeModal(detailsButton, dataNextHours, summaryImage, pressureUnit, windUnit);
        });
        tableDetailsData.appendChild(detailsButton);

        tableRow.appendChild(tableTimeData);
        tableRow.appendChild(tableSummaryData);
        tableRow.appendChild(tableTempData);
        tableRow.appendChild(tableCloudCoverData);
        tableRow.appendChild(tableDetailsData);

        next24TableBody.appendChild(tableRow);
    }

    next24Table.appendChild(next24TableBody);

    next24Hours.appendChild(next24Table);

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

function formatTimestampForModal(timestamp) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const date = new Date(timestamp * 1000);
  
    const year = date.getFullYear();
    const month = date.getMonth() + 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${day} ${months[month]} ${year} ${hours}:${minutes}`;
}

function changeModal(element, data, summaryImg, pUnit, wUnit){
    modalID = parseInt(element.id);
    const date = formatTimestampForModal(data.list[modalID].dt)

    const title = document.getElementById("next-24-hours-modal-title")
    title.textContent = `Weather in ${data.city.name} on ${date}`;

    const contentTopContainer = document.createElement("div");
    contentTopContainer.style.textAlign = "center";

    const content = document.getElementById("next-24-hours-modal-body");
    let contentIcon = summaryImg.cloneNode(false);
    contentIcon.style.width = "20%"
    
    const contentDesc = document.createElement("span");
    contentDesc.textContent = `${data.list[modalID].weather[0].main} (${data.list[modalID].weather[0].description})`;
    contentDesc.style.marginLeft = "3rem";

    contentTopContainer.appendChild(contentIcon);
    contentTopContainer.appendChild(contentDesc);

    const contentTable = document.createElement("table");
    contentTable.classList.add("table", "text-center");

    const tableHead = document.createElement("thead");
    const humidityHead = document.createElement("th")
    humidityHead.textContent = "Humidity";
    const pressureHead = document.createElement("th")
    pressureHead.textContent = "Pressure";
    const windSpeedHead = document.createElement("th")
    windSpeedHead.textContent = "Wind Speed";

    tableHead.appendChild(humidityHead);
    tableHead.appendChild(pressureHead);
    tableHead.appendChild(windSpeedHead);

    contentTable.appendChild(tableHead);

    const humidityValue = document.createElement("td");
    humidityValue.textContent = `${data.list[modalID].main.humidity}%`;
    const pressureValue = document.createElement("td");
    pressureValue.textContent = `${data.list[modalID].main.pressure} ${pUnit}`;
    const windSpeedValue = document.createElement("td");
    windSpeedValue.textContent = `${data.list[modalID].wind.speed} ${wUnit}`;

    const tableRow = document.createElement("tr");
    tableRow.appendChild(humidityValue);
    tableRow.appendChild(pressureValue);
    tableRow.appendChild(windSpeedValue);

    contentTable.appendChild(tableRow);

    content.appendChild(contentTopContainer);
    content.appendChild(contentTable);
}