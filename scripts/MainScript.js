let apiKey = "9b1a159f550343088a413516252305"
let language = "es"
let fahrenheit;
let celsius;

let fahrenheitFeeling;
let celsiusFeeling;

let avgTempetureF1 = [];

let avgTempeturC1 = [];

const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sabado"]

const searchButton = document.getElementById("searchbtn");
const swap = document.getElementById("swap");
const sign = document.getElementById("signTempeture");
const tempetureGroup = document.getElementsByClassName("tempeture1");
const GroupOfIcons = document.getElementsByClassName("dayState");
const GroupDays = document.getElementsByClassName("dayTitle");
const dataField = document.getElementById("container");

const favoriteBtn = document.getElementById("favoritebtn_");
const favoriteContainer = document.getElementById("favoriteSelect");

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

const getExactTempeture = (i)=>{
    if(sign.textContent === "°C"){
        return `${avgTempeturC1[i]} °C`;
    } else if(sign.textContent === "°F"){
        return `${avgTempetureF1[i]} °F`;
    }
}

searchButton.addEventListener("click", async () => {

    // declarations
    const countryCity = document.getElementsByClassName("nombreCiudad")[0];
    const tempeture = document.getElementById("tempetureNumber");
    const description = document.getElementsByClassName("description")[0];
    const humidity = document.getElementsByClassName("humidityInfo")[0];
    const windSpeed = document.getElementsByClassName("windSpeed")[0];
    const tempetureFeel = document.getElementsByClassName("tempetureFeel")[0];
    
    try{
    // async calls
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${dataField.value}&days=6&lang=${language}`)
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
    
    avgTempeturC1 = [];
    avgTempeturC1 = [];
    for(let i = 1; i < data.forecast.forecastday.length; i++){
        avgTempetureF1.push(data.forecast.forecastday[i].day.avgtemp_f);
        avgTempeturC1.push(data.forecast.forecastday[i].day.avgtemp_c);

        tempetureGroup[i - 1].textContent = getExactTempeture(i - 1);
        GroupOfIcons[i - 1].innerHTML = `<img src="${data.forecast.forecastday[i].day.condition.icon}" width="32" height="32" class="iconDescription"/>`
        GroupDays[i-1].textContent = days[new Date(data.forecast.forecastday[i].hour[10].time).getDay()]
        console.log(new Date(data.forecast.forecastday[i].hour[10].time).getDay());
}

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

    for(let i = 0; i < tempetureGroup.length; i++){
        tempetureGroup[i].textContent = getExactTempeture(i)
    }

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



// This section is favorite system

    favoriteBtn.addEventListener("click", ()=>{
        const optionsCreated = document.getElementsByClassName("newOption");
        let optionsValues = [];
        for(let i = 0; i < optionsCreated.length; i++){
            optionsValues.push(optionsCreated[i].value);
        }
        if(!(optionsValues.find(el => el === dataField.value))){
        const newOption = document.createElement("div");
        const span = document.createElement("span");
        const divDelete = document.createElement("div");
        const deleteBtn = document.createElement("button");

        deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24ffd" viewBox="0 0 40 40"><path fill="currentColor" d="M21.499 19.994L32.755 8.727a1.064 1.064 0 0 0-.001-1.502c-.398-.396-1.099-.398-1.501.002L20 18.494L8.743 7.224c-.4-.395-1.101-.393-1.499.002a1.05 1.05 0 0 0-.309.751c0 .284.11.55.309.747L18.5 19.993L7.245 31.263a1.064 1.064 0 0 0 .003 1.503c.193.191.466.301.748.301h.006c.283-.001.556-.112.745-.305L20 21.495l11.257 11.27c.199.198.465.308.747.308a1.06 1.06 0 0 0 1.061-1.061c0-.283-.11-.55-.31-.747z"/></svg>`

        span.textContent = dataField.value;

        newOption.setAttribute("value", dataField.value)
        newOption.setAttribute("class", "newOption");

        divDelete.appendChild(deleteBtn);
        newOption.append(span, divDelete);
        favoriteContainer.appendChild(newOption);
}
    });

    favoriteContainer.addEventListener("change", (e)=>{
        dataField.value = e.target.value;
        searchButton.click();
        favoriteContainer.value = "Seleccione una opción"
    });

// falta agregar colores dinámicos, cambio de idioma, algunos retos adicionales...
// hacerlo más responsive
// agregar un boton para mostrar la informacion de la ubicacion actual, tambien incluye si no hay nada en el localstorage que presente la informacion de la localizacion actual