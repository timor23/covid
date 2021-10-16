const regionButtons = document.querySelectorAll(`.reg-btn`),
    statsButtons = document.querySelectorAll(`.case-btn`),
    chartContainer = document.querySelector("#chartContainer");

const cors = `https://api.allorigins.win/raw?url=`,
    dataURL = `https://corona-api.com/countries`,
    countriesURL = 'https://restcountries.herokuapp.com/api/v1';

let currentRegion = `World`,
    currentStats = `Confirmed`;

const world = {
    asia: {},
    europe: {},
    africa: {},
    america: {}
}
// Run
getData();
filterData(currentRegion,currentStats);


async function getData() {
    const countries = await (await fetch(cors + countriesURL)).json();
    const covidData = await (await fetch(cors + dataURL)).json();
    // console.log(countries);
    // console.log(covidData);

    for (const c of countries) {
        let cca2 = c.cca2;
        let name = c.name.common;

        let cData = covidData.data.filter(e => {
            return e.code === cca2;
        });
        if (cData == '') continue;
        // Object.keys(world).forEach()
        let confirmed = cData[0].latest_data.confirmed;
        let deaths = cData[0].latest_data.deaths;
        let recovered = cData[0].latest_data.recovered;
        let critical = cData[0].latest_data.critical;
        let country = new Country(name, confirmed, deaths, critical, recovered);

        switch (c.region) {
            case "Asia":
                world.asia[cca2] = country;
                break;
            case "Europe":
                world.europe[cca2] = country;
                break;
            case "Africa":
                world.africa[cca2] = country;
                break;
            case "Americas":
                world.america[cca2] = country;
                break;
        }

    }
    localStorage.setItem("world", JSON.stringify(world));
}
function drawChart(labels, data, stats) {
    const canvas = document.createElement(`canvas`);
    chartContainer.appendChild(canvas);
    const ctx = canvas.getContext(`2d`);

    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: stats,
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        }
    });
}

function filterData(region , stats) {
    let cont = {};
    let allData = JSON.parse(localStorage.getItem("world"));
    switch (region) {
        case "World":
            cont = Object.assign({}, allData.asia, allData.europe, allData.africa, allData.america);
            break;
        case "Asia":
            cont = allData.asia;
            break;
        case "Europe":
            cont = allData.europe;
            break;
        case "Africa":
            cont = allData.africa;
            break;
        case "Americas":
            cont = allData.america;
            break;
    }
    let countriesArr = [], statsArr = [];

    for (let [key, value] of Object.entries(cont)) {
        countriesArr.push(value._name);
        switch (stats) {
            case "Confirmed":
                statsArr.push(value._confirmed);
                break;
            case "Deaths":
                statsArr.push(value._deaths);
                break;
            case "Recovered":
                statsArr.push(value._recovered);
                break;
            case "Critical":
                statsArr.push(value._critical);
                break;
        }
    }
    drawChart(countriesArr, statsArr, stats);
}



for (let i = 0; i < regionButtons.length; i++) {
    regionButtons[i].addEventListener(`click`, () => {
        chartContainer.innerHTML = ``;
        currentRegion = regionButtons[i].innerHTML;
        filterData(currentRegion, currentStats);
    });
}

for (let i = 0; i < statsButtons.length; i++) {
    statsButtons[i].addEventListener(`click`, () => {
        chartContainer.innerHTML = ``;
        currentStats = statsButtons[i].innerHTML;
        filterData(currentRegion, currentStats);
    });
}
