const regionButtons = document.querySelectorAll(`.reg-btn`),
    stats = document.querySelectorAll(`.case-btn`);

const cors = `https://cors-anywhere.herokuapp.com/`,
    dataURL = `https://corona-api.com/countries`,
    countriesURL = 'https://restcountries.herokuapp.com/api/v1';

let currentRegion = `world`,
    currentStats = `confirmed`;

const world = {
    asia: {},
    europe: {},
    africa: {},
    america: {}
}
// Run
getData();
console.log(world.europe);
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
}
function drawChart(labels, data, stats) {
    const ctx = document.querySelector('#myChart').getContext('2d');
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
    let cont ;

    // console.log(world.all); //// temp
    switch (region) {
        case "world":
            // cont = world.all;
            cont = Object.assign({}, world.asia, world.europe, world.africa, world.america);
            console.log(world.asia); // temp
            break;
        case "asia":
            cont = world.asia;
            break;
        case "europe":
            cont = world.europe;
            break;
        case "africa":
            cont = world.africa;
            console.log(cont);
            break;
        case "america":
            cont = world.america;
            break;
    }
    let countriesArr = [], statsArr = [];
    for (let i = 0; i < cont.length; i++) {
        countriesArr.push(cont[i].name);
        console.log(cont[i].name); ///// temp
        switch (stats) {
            case "confirmed":
                statsArr.push(cont[i].confirmed);
                break;
            case "deaths":
                statsArr.push(cont[i].deaths);
                break;
            case "recovered":
                statsArr.push(cont[i].recovered);
                break;
            case "critical":
                statsArr.push(cont[i].critical);
                break;
        }
    }
    drawChart(countriesArr, statsArr, stats);
}



for (let i = 0; i < regionButtons.length; i++) {
    regionButtons[i].addEventListener(`click`, () => {
        currentRegion = regionButtons[i].innerHTML;
        filterData(currentRegion, currentStats);
    });
}

for (let i = 0; i < stats.length; i++) {
    regionButtons[i].addEventListener(`click`, () => {
        currentStats = regionButtons[i].innerHTML;
        filterData(currentRegion, currentStats);
    });
}
