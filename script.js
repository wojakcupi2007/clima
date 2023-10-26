const result = document.querySelector('.result');
const form = document.querySelector('.get-weather');
const nameCity = document.querySelector('#city');
const nameCountry = document.querySelector('#country');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (nameCity.value === '' || nameCountry.value === '') {
        showError('Ambos campos son obligatorios...');
        return;
    }

    callAPI(nameCity.value, nameCountry.value);
    
})

function callAPI(city, country){
    const apiId = '41d1d7f5c2475b3a16167b30bc4f265c';
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiId}`;
  
    fetch(url)
        .then(data => {
            return data.json();
        })
        .then(dataJSON => {
            if (dataJSON.cod === '404') {
                showError('Ciudad no encontrada...');
            } else {
                clearHTML();
                showWeather(dataJSON);
            }
            
        })
        .catch(error => {
            console.log(error);
        })
}



function createClouds(cloudPercentage) {
    const nubesContainer = document.querySelector('.nubes');
    nubesContainer.innerHTML = '';

    if (cloudPercentage >= 0 && cloudPercentage <= 33) {
        createNubeDiv(nubesContainer, 1);
    } else if (cloudPercentage > 33 && cloudPercentage <= 66) {
        createNubeDiv(nubesContainer, 3);
    } else if (cloudPercentage > 66 && cloudPercentage <= 100) {
        createNubeDiv(nubesContainer, 5);
    }
}

function createNubeDiv(container, count) {
    for (let i = 0; i < count; i++) {
        const nubeDiv = document.createElement('div');
        nubeDiv.classList.add('nube');
        container.appendChild(nubeDiv);
    }
}



function showWeather(data){
    const {name, main:{temp, temp_min, temp_max , pressure},  clouds,dt} = data;

    const degrees = kelvinToCentigrade(temp);
    const min = kelvinToCentigrade(temp_min);
    const max = kelvinToCentigrade(temp_max);
    const nubes = clouds.all;
    const content = document.createElement('div');
    createClouds(nubes);
    content.innerHTML = `
        <h5>Clima en ${name}</h5>
        
        <h2>${degrees}°C</h2>
        <p>Max: ${max}°C</p>
        <p>Min: ${min}°C</p>
        <p>Nubes: ${clouds.all}%</p>
        <p>Presión Atmosférica: ${pressure} hPa</p>
        <p>Hora: ${new Date(dt * 1000).toLocaleTimeString()}</p>
        
    `;
    content


    result.appendChild(content);

   
}

function showError(message){
    
    const alert = document.createElement('p');
    alert.classList.add('alert-message');
    alert.innerHTML = message;

    form.appendChild(alert);
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

function kelvinToCentigrade(temp){
    return parseInt(temp - 273.15);
}

function clearHTML(){
    result.innerHTML = '';
}