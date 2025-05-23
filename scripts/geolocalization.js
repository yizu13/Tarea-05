const btnGeolocalization = document.getElementById("geolocalizationbtn");

const paramsGeo ={
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
}

async function geolocalization_(pos){

    const datafield = document.getElementsByClassName("inputField")[0];
    const buttonSearch = document.getElementById("searchbtn");
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${pos.coords.latitude},${pos.coords.longitude}`);
    const data = await response.json();

    datafield.value = data.location.name
    buttonSearch.click();
}

function err(error){
    console.log(`something happened: ${error}`);
}

const localData = localStorage.getItem("city");

    if(!localData){
        navigator.geolocation.getCurrentPosition(geolocalization_, err, paramsGeo);
    }

btnGeolocalization.addEventListener("click",()=>{ 
    navigator.geolocation.getCurrentPosition(geolocalization_, err, paramsGeo)
});