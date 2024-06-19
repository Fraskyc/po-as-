document.addEventListener('DOMContentLoaded', () => {
    getCzechWeather();

    const leftScrollButton = document.getElementById('left-scroll');
    const rightScrollButton = document.getElementById('right-scroll');
    const weeklyForecastDiv = document.getElementById('weekly-forecast');

    leftScrollButton.addEventListener('click', () => {
        weeklyForecastDiv.scrollBy({
            left: -300,
            behavior: 'smooth'
        });
    });

    rightScrollButton.addEventListener('click', () => {
        weeklyForecastDiv.scrollBy({
            left: 300,
            behavior: 'smooth'
        });
    });
});

function getCzechWeather() {
    const apiKey = '8e4ae8ad2d614854a99e1ff85e61ce2b';
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=Czechia&appid=${apiKey}&units=metric`;

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            const dailyData = processDailyForecast(data.list);
            displayWeeklyForecast(dailyData);
        })
        .catch(error => {
            console.error('Error fetching weekly forecast data:', error);
            alert('Error fetching weekly forecast data. Please try again.');
        });
}

function processDailyForecast(hourlyData) {
    const dailyData = {};
    
    hourlyData.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'numeric' });
        
        if (!dailyData[day]) {
            dailyData[day] = {
                temp: [],
                minTemp: item.main.temp_min,
                maxTemp: item.main.temp_max,
                humidity: item.main.humidity,
                windSpeed: item.wind.speed,
                description: item.weather[0].description,
                icon: item.weather[0].icon
            };
        }
        
        dailyData[day].temp.push(item.main.temp);
        dailyData[day].minTemp = Math.min(dailyData[day].minTemp, item.main.temp_min);
        dailyData[day].maxTemp = Math.max(dailyData[day].maxTemp, item.main.temp_max);
    });

    return Object.keys(dailyData).map(day => {
        const temps = dailyData[day].temp;
        const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
        return {
            day,
            avgTemp: avgTemp.toFixed(1),
            minTemp: dailyData[day].minTemp.toFixed(1),
            maxTemp: dailyData[day].maxTemp.toFixed(1),
            humidity: dailyData[day].humidity,
            windSpeed: dailyData[day].windSpeed,
            description: dailyData[day].description,
            icon: dailyData[day].icon
        };
    });
}

function displayWeeklyForecast(dailyData) {
    const weeklyForecastDiv = document.getElementById('weekly-forecast');
    weeklyForecastDiv.innerHTML = '';

    dailyData.forEach(day => {
        const iconUrl = `https://openweathermap.org/img/wn/${day.icon}.png`;

        const weeklyItemHtml = `
            <div class="weekly-item">
                <span>${day.day}</span>
                <img src="${iconUrl}" alt="Weather Icon">
                <span>Avg: ${day.avgTemp}°C</span>
                <span>Min: ${day.minTemp}°C</span>
                <span>Max: ${day.maxTemp}°C</span>
                <span>Humidity: ${day.humidity}%</span>
                <span>Wind: ${day.windSpeed} m/s</span>
                <span>${day.description}</span>
            </div>
        `;

        weeklyForecastDiv.innerHTML += weeklyItemHtml;
    });
}

function getWeather() {
    const apiKey = '8e4ae8ad2d614854a99e1ff85e61ce2b';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp); // Temperature is already in Celsius
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;

        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind: ${windSpeed} m/s</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML = '';

    hourlyData.forEach(item => {
        const date = new Date(item.dt * 1000);
        const time = date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
        const temp = item.main.temp;
        const humidity = item.main.humidity;
        const windSpeed = item.wind.speed;
        const icon = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${time}</span>
                <img src="${iconUrl}" alt="Weather Icon">
                <span>${temp.toFixed(1)}°C</span>
                <span>Humidity: ${humidity}%</span>
                <span>Wind: ${windSpeed} m/s</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
}
