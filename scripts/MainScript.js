let apiKey = "9b1a159f550343088a413516252305"
const language ="es"
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
const themeColor = document.getElementById("theme")
const geolocalizationbtn = document.getElementById("geolocalizationbtn")

const favoriteBtn = document.getElementById("favoritebtn_");
const favoriteContainer = document.getElementById("options");

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
    fahrenheit = Math.round(data.current.temp_f);
    celsius = Math.round(data.current.temp_c);
    fahrenheitFeeling = Math.round(data.current.feelslike_f);
    celsiusFeeling = Math.round(data.current.feelslike_c);
    tempeture.textContent = getTempeture();

    description.innerHTML= `<img src="${data.current.condition.icon}" width="56" height="56" class="iconDescription"/> <span class="tooltip">${data.current.condition.text}</span>`
    humidity.textContent = data.current.humidity;
    windSpeed.textContent = `${data.current.wind_kph} kph`;
    tempetureFeel.textContent = getTempetureFeeling();
    
    avgTempeturC1 = [];
    avgTempeturC1 = [];
    for(let i = 1; i < data.forecast.forecastday.length; i++){
        avgTempetureF1.push(Math.round(data.forecast.forecastday[i].day.avgtemp_f));
        avgTempeturC1.push(Math.round(data.forecast.forecastday[i].day.avgtemp_c));

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
            optionsValues.push(optionsCreated[i].title);
        }
        if(!(optionsValues.find(el => el === dataField.value)) && dataField.value){
        const newOption = document.createElement("div");
        const label = document.createElement("label");
        const input_ = document.createElement("input");
        const divDelete = document.createElement("span");
        const deleteBtn = document.createElement("button");
        
        input_.setAttribute("name", "option"); input_.setAttribute("type", "radio"); input_.setAttribute("id", dataField.value);
        label.setAttribute("class", "option"); label.setAttribute("for", dataField.value); label.setAttribute("data-txt", dataField.value);

        deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 40 40"><path fill="currentColor" d="M21.499 19.994L32.755 8.727a1.064 1.064 0 0 0-.001-1.502c-.398-.396-1.099-.398-1.501.002L20 18.494L8.743 7.224c-.4-.395-1.101-.393-1.499.002a1.05 1.05 0 0 0-.309.751c0 .284.11.55.309.747L18.5 19.993L7.245 31.263a1.064 1.064 0 0 0 .003 1.503c.193.191.466.301.748.301h.006c.283-.001.556-.112.745-.305L20 21.495l11.257 11.27c.199.198.465.308.747.308a1.06 1.06 0 0 0 1.061-1.061c0-.283-.11-.55-.31-.747z"/></svg>`;
        deleteBtn.setAttribute("class", "deletebtnfavorite");

        newOption.setAttribute("title", dataField.value);

        label.addEventListener("click", (e)=>{
            dataField.value = newOption.title
            searchButton.click();
        });

        deleteBtn.addEventListener("click", ()=>{
            newOption.remove();
        });

        divDelete.appendChild(deleteBtn);
        newOption.append(label, input_, divDelete);
        favoriteContainer.appendChild(newOption);
        dataField.value= ""
}   
    });



    themeColor.addEventListener("click", ()=>{
        themeColor.classList.toggle("light");
        const currentClass = themeColor.getAttribute("class");
        const body = document.getElementsByTagName("body");
        const section = document.getElementsByClassName("forecastContent");
        const selected = document.getElementById("selected");
        const arrow = document.getElementById("arrow");
        const options = document.getElementById("options");
        const mainContainer = document.getElementById("mainContainer");

        if(currentClass){
            themeColor.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#f9f9f9" d="M12 19a1 1 0 0 1 .993.883L13 20v1a1 1 0 0 1-1.993.117L11 21v-1a1 1 0 0 1 1-1m6.313-2.09l.094.083l.7.7a1 1 0 0 1-1.32 1.497l-.094-.083l-.7-.7a1 1 0 0 1 1.218-1.567zm-11.306.083a1 1 0 0 1 .083 1.32l-.083.094l-.7.7a1 1 0 0 1-1.497-1.32l.083-.094l.7-.7a1 1 0 0 1 1.414 0M4 11a1 1 0 0 1 .117 1.993L4 13H3a1 1 0 0 1-.117-1.993L3 11zm17 0a1 1 0 0 1 .117 1.993L21 13h-1a1 1 0 0 1-.117-1.993L20 11zM6.213 4.81l.094.083l.7.7a1 1 0 0 1-1.32 1.497l-.094-.083l-.7-.7A1 1 0 0 1 6.11 4.74zm12.894.083a1 1 0 0 1 .083 1.32l-.083.094l-.7.7a1 1 0 0 1-1.497-1.32l.083-.094l.7-.7a1 1 0 0 1 1.414 0M12 2a1 1 0 0 1 .993.883L13 3v1a1 1 0 0 1-1.993.117L11 4V3a1 1 0 0 1 1-1m0 5a5 5 0 1 1-4.995 5.217L7 12l.005-.217A5 5 0 0 1 12 7"/></svg>`

            geolocalizationbtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#f9f9f9" d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7"/></svg></button>`

            searchButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="icon"><path fill="#f9f9f9" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0s.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/></svg>`

            swap.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="#f9f9f9" d="M224 48v104a16 16 0 0 1-16 16H99.31l10.35 10.34a8 8 0 0 1-11.32 11.32l-24-24a8 8 0 0 1 0-11.32l24-24a8 8 0 0 1 11.32 11.32L99.31 152H208V48H96v8a8 8 0 0 1-16 0v-8a16 16 0 0 1 16-16h112a16 16 0 0 1 16 16m-56 144a8 8 0 0 0-8 8v8H48V104h108.69l-10.35 10.34a8 8 0 0 0 11.32 11.32l24-24a8 8 0 0 0 0-11.32l-24-24a8 8 0 0 0-11.32 11.32L156.69 88H48a16 16 0 0 0-16 16v104a16 16 0 0 0 16 16h112a16 16 0 0 0 16-16v-8a8 8 0 0 0-8-8"/></svg>`

            body[0].classList.add("bodyWhite"); body[0].classList.remove("bodyBlack")
            section[0].classList.remove("backgroundBlack"); section[0].classList.add("backgroundwhite");
            selected.classList.add("backgroundWhite_"); selected.classList.remove("backgroundBlack_"); 
            options.classList.add("backgroundWhite_"); options.classList.remove("backgroundBlack_");
            arrow.classList.add("blackArrow"); arrow.classList.remove("whiteArrow");
            mainContainer.classList.add("backgroundColorWhite"); mainContainer.classList.remove("backgroundColorblack");
        } else if (!currentClass){

            themeColor.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#202225" d="M12 1.992a10 10 0 1 0 9.236 13.838c.341-.82-.476-1.644-1.298-1.31a6.5 6.5 0 0 1-6.864-10.787l.077-.08c.551-.63.113-1.653-.758-1.653h-.266l-.068-.006z"/></svg>`

            geolocalizationbtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#202225" d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7"/></svg></button>`

            searchButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="icon"><path fill="#202225" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0s.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/></svg>`

            swap.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="#202225" d="M224 48v104a16 16 0 0 1-16 16H99.31l10.35 10.34a8 8 0 0 1-11.32 11.32l-24-24a8 8 0 0 1 0-11.32l24-24a8 8 0 0 1 11.32 11.32L99.31 152H208V48H96v8a8 8 0 0 1-16 0v-8a16 16 0 0 1 16-16h112a16 16 0 0 1 16 16m-56 144a8 8 0 0 0-8 8v8H48V104h108.69l-10.35 10.34a8 8 0 0 0 11.32 11.32l24-24a8 8 0 0 0 0-11.32l-24-24a8 8 0 0 0-11.32 11.32L156.69 88H48a16 16 0 0 0-16 16v104a16 16 0 0 0 16 16h112a16 16 0 0 0 16-16v-8a8 8 0 0 0-8-8"/></svg>`

            body[0].classList.remove("bodyWhite"); body[0].classList.add("bodyBlack")
            section[0].classList.add("backgroundBlack"); section[0].classList.remove("backgroundwhite");
             selected.classList.remove("backgroundWhite_"); selected.classList.add("backgroundBlack_");
             options.classList.remove("backgroundWhite_"); options.classList.add("backgroundBlack_");
             arrow.classList.remove("blackArrow"); arrow.classList.add("whiteArrow");
             mainContainer.classList.remove("backgroundColorWhite"); mainContainer.classList.add("backgroundColorblack")
        }
    })

themeColor.click()

// falta agregar colores dinámicos, cambio de idioma, algunos retos adicionales...
// hacerlo más responsive
// agregar un boton para mostrar la informacion de la ubicacion actual, tambien incluye si no hay nada en el localstorage que presente la informacion de la localizacion actual