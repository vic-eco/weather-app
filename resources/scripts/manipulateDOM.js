function createWeatherCard(dataNow, dataNextHours, deg){

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

    if(cardOn == 1){
    mainElement.removeChild(mainElement.lastChild);
    mainElement.removeChild(mainElement.lastChild);
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

    const generalInfoRow = document.createElement("div");
    generalInfoRow.classList.add("row", "text-center");

    const generalInfo = document.createElement("div");
    generalInfo.classList.add("col-6");

    const generalInfo2 = generalInfo.cloneNode();

    generalInfo2.innerHTML = `<p id="weather-desc">${desc} in ${location}</p>
                              <h2 id="temp">${temp} °${deg}</h2>
                              <p><span class="lowtemp">L:${tempMin} °${deg}</span> | <span class="hightemp">H:${tempMax} °${deg}</span></p>`;
    generalInfo.innerHTML = `<img src=https://openweathermap.org/img/wn/${icon}@2x.png class="icon">`

    generalInfoRow.appendChild(generalInfo);
    generalInfoRow.appendChild(generalInfo2);

    rowInner.appendChild(generalInfoRow);

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
        summaryImage.classList.add("icon");
        summaryImage.style.width = "25%";
        summaryImage.src = `https://openweathermap.org/img/wn/${dataNextHours.list[i].weather[0].icon}@2x.png`
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
            showModal(detailsButton, dataNextHours, summaryImage, pressureUnit, windUnit);
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

    const hLine2 = document.createElement("hr");
    mainElement.appendChild(hLine2);
}

function createCharts(data, deg, reg, city){

    let pressureUnit;
    if (deg === 'C'){
        pressureUnit = "hPa";
    }else{
        pressureUnit = "Mb";
    }

    const chartContainer = document.createElement("div");
    chartContainer.classList.add("container", "mt-3");

    const chartCard = document.createElement("div");
    chartCard.classList.add("card");

    const chartHeader = document.createElement("div");
    chartHeader.classList.add("card-header");
    chartHeader.textContent = `Weather Forecast for ${reg}, ${city}`;

    const chartBody = document.createElement("div");
    chartBody.classList.add("card-body", "row");

    const chartIDs = ["tempChart", "humChart", "pressChart"];
    for (let i=0; i<3; i++){
        const chart = document.createElement("div");
        chart.classList.add("col-md-12", "col-sm-12", "col-lg-4", "mb-3");
        chart.id = chartIDs[i];
        chartBody.appendChild(chart);
    }

    chartCard.appendChild(chartHeader);
    chartCard.appendChild(chartBody);
    chartContainer.appendChild(chartCard);

    mainElement.appendChild(chartContainer);

    let tempValues = [];
    let humValues = [];
    let pressValues= [];
    let timestamps = [];

    for (let i=0; i<40; i++){
        tempValues.push(parseFloat(data.list[i].main.temp))
        humValues.push(parseInt(data.list[i].main.humidity))
        pressValues.push(parseInt(data.list[i].main.pressure))
    }

    for(let i=0; i<40; i++){
        timestamps.push(formatTimestamp(data.list[i].dt));
    }

    const layout = {
        margin: { l: 40, r: 20, t: 40, b: 40 },
    };

    const tempTrace = {
        x: timestamps, // 40 data points
        y: tempValues, // array of values that will be plotted
        mode: 'lines+markers' // linechart with markers (dots)
     };


    const humTrace = {
            x: timestamps, // values in x axis
            y: humValues, // array of values that will be plotted
            mode: 'lines+markers' // linechart with markers (dots)
    };

    const pressTrace = {
        x: timestamps, // values in x axis
        y: pressValues, // array of values that will be plotted
        mode: 'lines+markers' // linechart with markers (dots)
    };

    layout.title = {text: `Temperature (${deg})`};
    Plotly.newPlot("tempChart", [tempTrace], layout, {responsive: true});
    layout.title = {text: 'Humidity (%)'};
    Plotly.newPlot("humChart", [humTrace], layout, {responsive: true});
    layout.title = {text: `Pressure (${pressureUnit})`};
    Plotly.newPlot("pressChart", [pressTrace], layout, {responsive: true});

}

function showModal(element, data, summaryImg, pUnit, wUnit){
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