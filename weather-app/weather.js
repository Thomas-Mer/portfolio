const API_KEY = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');

async function getWeatherData(city) {
    try {
        // Get current weather
        const currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );
        const currentData = await currentResponse.json();

        // Get 5-day forecast
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
        );
        const forecastData = await forecastResponse.json();

        displayWeather(currentData);
        displayForecast(forecastData);
    } catch (error) {
        alert('City not found. Please try again.');
    }
}

function displayWeather(data) {
    const {
        name: city,
        main: { temp, humidity },
        weather: [{ description, icon }],
        wind: { speed }
    } = data;

    document.querySelector('.city').textContent = `Weather in ${city}`;
    document.querySelector('.temp').textContent = `${Math.round(temp)}°C`;
    document.querySelector('.description').textContent = description;
    document.querySelector('.humidity').textContent = `Humidity: ${humidity}%`;
    document.querySelector('.wind').textContent = `Wind Speed: ${speed} km/h`;
    document.querySelector('.weather-icon img').src = 
        `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

function displayForecast(data) {
    const forecastContainer = document.querySelector('.forecast-container');
    forecastContainer.innerHTML = '';

    // Get one forecast per day (excluding current day)
    const dailyForecasts = data.list.filter(forecast => 
        forecast.dt_txt.includes('12:00:00')
    ).slice(0, 5);

    dailyForecasts.forEach(forecast => {
        const {
            main: { temp },
            weather: [{ icon, description }],
            dt_txt
        } = forecast;

        const date = new Date(dt_txt).toLocaleDateString('en-US', { weekday: 'short' });

        const forecastDay = document.createElement('div');
        forecastDay.className = 'forecast-day';
        forecastDay.innerHTML = `
            <div class="forecast-date">${date}</div>
            <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}">
            <div class="forecast-temp">${Math.round(temp)}°C</div>
        `;

        forecastContainer.appendChild(forecastDay);
    });
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) getWeatherData(city);
});

cityInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) getWeatherData(city);
    }
});

// Load default city
getWeatherData('London'); 