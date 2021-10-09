const charts = document.querySelector(`#charts`);





const dataURL = `https://corona-api.com/countries/`,
    countriesURL = 'https://restcountries.herokuapp.com/api/v1';

async function getData() {
    const countries = await (await fetch(countriesURL)).json();
    const covidData = await (await fetch(dataURL)).json();
    console.log(countries);
    console.log(covidData);

}



getData();
// showChart()