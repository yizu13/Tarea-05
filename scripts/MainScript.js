let apiKey = "9b1a159f550343088a413516252305"
let language = "es"
let fahrenheit;
let celsius;

let fahrenheitFeeling;
let celsiusFeeling;

const searchButton = document.getElementById("searchbtn");
const swap = document.getElementById("swap");
const sign = document.getElementById("signTempeture");


async function getInfo (){
    const response = await (await fetch("http://api.weatherapi.com/v1/forecast.json?key=9b1a159f550343088a413516252305&q=48.8567,2.3508&days=5")).json();
    console.log(response)
}

document.addEventListener("keydown",(event)=>{
    if(event.key === "Enter") searchButton.click();
})

const getTempeture = ()=> {
    if(sign.textContent === "°C"){
        return celsius;
    } else if (sign.textContent === "°F"){
        return fahrenheit;
    }
}

const getTempetureFeeling = ()=>{
    if(sign.textContent === "°C"){
        return `${celsiusFeeling} °C`;
    } else if (sign.textContent === "°F"){
        return `${fahrenheitFeeling} °F`;
    }
}

searchButton.addEventListener("click", async () => {

    // declarations
    const dataField = document.getElementById("container");
    const countryCity = document.getElementsByClassName("nombreCiudad")[0];
    const tempeture = document.getElementById("tempetureNumber");
    const description = document.getElementsByClassName("description")[0];
    const humidity = document.getElementsByClassName("humidityInfo")[0];
    const windSpeed = document.getElementsByClassName("windSpeed")[0];
    const tempetureFeel = document.getElementsByClassName("tempetureFeel")[0];
    
    try{
    // async calls
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${dataField.value}&days=5&lang=${language}`)
    const data = await response.json();

    // Logic
    countryCity.textContent = `${data.location.name}, ${data.location.country}` 
    save(data.location.name)
    fahrenheit = data.current.temp_f;
    celsius = data.current.temp_c;
    fahrenheitFeeling = data.current.feelslike_f;
    celsiusFeeling = data.current.feelslike_c;
    tempeture.textContent = getTempeture();

    description.innerHTML= `<img src="${data.current.condition.icon}" width="32" height="32" class="iconDescription"/> ${data.current.condition.text}`
    humidity.textContent = data.current.humidity;
    windSpeed.textContent = `${data.current.wind_kph} kph`;
    tempetureFeel.textContent = getTempetureFeeling();

    dataField.value = ""

    console.log(data);

    } catch(err){
        console.error("error inesperado:", err);
        console.log("Intente más tarde ó otra localización");
    }
});


swap.addEventListener("click", ()=>{

    const tempeture = document.getElementById("tempetureNumber");
    const tempetureFeel = document.getElementsByClassName("tempetureFeel")[0];

    if(sign.textContent === "°C"){
        sign.textContent = "°F"
    } else if(sign.textContent === "°F"){
        sign.textContent = "°C"
    }

    tempeture.textContent = getTempeture();
    tempetureFeel.textContent = getTempetureFeeling();

})



// localStorage

function save(city){
    localStorage.clear()
    localStorage.setItem("city", city);
}

function load(){
    const dataField = document.getElementById("container");
    const value = localStorage.getItem("city");
    if(value){
    dataField.value = value;
    searchButton.click()
    }else{
        console.log("ninguna ciudad encontrada en el localstorage")
    } 
}

load()

// falta agregar colores dinámicos, cambio de idioma, algunos retos adicionales...
// hacerlo más responsive
// agregar un boton para mostrar la informacion de la ubicacion actual, tambien incluye si no hay nada en el localstorage que presente la informacion de la localizacion actual