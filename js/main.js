let navLink = document.querySelectorAll('ul li a');
let form = document.querySelector('form');
let word = document.querySelector('form input[type="text"]');
let submit = document.getElementById('submit');

for (let i = 0; i < navLink.length; i++) {
    navLink[i].addEventListener('click', function () {
        navLink.forEach(item => item.classList.remove('active'));
        this.classList.add('active');
    });
}

form.addEventListener('submit', function (e) {
    e.preventDefault();
});

word.addEventListener('keyup', search);

async function getData(word) {
    let req = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=ade36e0776a74d31b4994033250105&q=${word}&days=3`);
    let response = await req.json();
    return response;
}

function search() {
    let country = word.value;
    if (country.trim() !== "") {
        getData(country).then(weatherData => {
            displayData(weatherData);
        });
    }
}

async function displayData(weatherData) {
    let cartona = '';
    for (let i = 0; i < weatherData.forecast.forecastday.length; i++) {
        let day = weatherData.forecast.forecastday[i];
        let date = new Date(day.date);
        let dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

        cartona += `
        <div class="forcast-container m-auto col-4 pb-3" id="forcast">
            <div class="forcast">
                <div class="header p-2 d-flex justify-content-between" id="today">
                    <div class="day">${dayName}</div>
                    <div class="date">${date.toLocaleDateString()}</div>
                </div>
                <div class="content p-3" id="current">
                    <div class="location fs-1 p-1">${weatherData.location.name}, ${weatherData.location.country}</div>
                    <div class="degree p-1">
                        <span class="num text-white">${day.day.avgtemp_c}<sup>o</sup>C</span>
                        <div><img src="${day.day.condition.icon}" alt="${day.day.condition.text}"></div>
                    </div>
                    <div class="text-blue p-1 m-2">${day.day.condition.text}</div>
                    <div>
                        <span><img class="p-1" src="./images/icon-umberella.png">${day.day.avghumidity}%</span>
                        <span><img class="p-1" src="./images/icon-wind.png">${day.day.maxwind_kph}Km/h</span>
                        <span><img class="p-1" src="./images/icon-compass.png">${day.day.wind_dir}</span>
                    </div>
                </div>
            </div>
        </div>`;
    }

    document.getElementById("weather").innerHTML = cartona;
}

window.addEventListener('load', function() {
    getData('Cairo').then(weatherData => {
        displayData(weatherData);
    });
});