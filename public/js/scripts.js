// const apiKey = process.env.API_KEY_MAP; // Replace with your API key
// const script = document.createElement('script');
// script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
// script.defer = true;
// script.async = true;
// document.head.appendChild(script);
const locationInput = document.getElementById("location-input").value.toLowerCase().replace(/[^a-z]/g, '');

// const locationInput1 = document.getElementById("location-input");

// const locationInput2 = locationInput1.value;

// console.log(locationInput + " locationInput")
// console.log(locationInput2 + " locationInput")

function getLocation() {
  const locationInput = document.getElementById("location-input").value.toLowerCase().replace(/[^a-z]/g, '');

  // const locationInput = document.getElementById("location-input").value;
  console.log(locationInput + " locationInput");

  const geocoder = new google.maps.Geocoder();
  const placesService = new google.maps.places.PlacesService(
    document.createElement("div")
  );
  const mapDiv = document.getElementById("map");

  geocoder.geocode({ address: locationInput }, (results, status) => {
    if (status === "OK") {
      const location = results[0].geometry.location;
      console.log(`Latitude: ${location.lat()}, Longitude: ${location.lng()}`);

      initMap(location.lat(), location.lng());

      // Use the Places API to search for places at the given location
      const request = {
        location: location,
        radius: "500",
        type: ["point_of_interest"],
        keyword: locationInput,
      };

      placesService.nearbySearch(
        { location: location, radius: 500 },
        (results, status) => {
          if (status === "OK" && results.length > 0) {
            const place = results[0];

            // //   Show a map of the location
            // const mapOptions = {
            //   center: location,
            //   zoom: 12,
            // };
            // const map = new google.maps.Map(mapDiv, mapOptions);
            // const marker = new google.maps.Marker({
            //   position: location,
            //   map: map,
            //   title: locationInput,
            // });

            // Get the first photo for the place, if available
            let photoUrl = "";
            if (place.photos && place.photos.length > 0) {
              photoUrl = place.photos[0].getUrl({
                maxWidth: 500,
                maxHeight: 500,
              });
            }

            // Get the details for the place
            const placeRequest = {
              placeId: place.place_id,
              fields: [
                "name",
                "formatted_address",
                "rating",
                "reviews",
                "photo",
                "website",
                "opening_hours",
              ],
            };
            placesService.getDetails(placeRequest, (placeResult, status) => {
              if (status === "OK" && placeResult) {
                // Display the place name, photo, and description
                const placeName = placeResult.name;
                const placeDescription = placeResult.formatted_address;

                document.getElementById("place-name").textContent = placeName;
                document.getElementById("place-description").textContent =
                  placeDescription;

                document.getElementById("place-photo").src = photoUrl;
              } else {
                console.error("Place details not found.");
              }
            });
          } else {
            console.error("No places found.");
          }
        }
      );
    } else {
      console.error("Place not found.");
    }
  });


}

// This is for showing map
function initMap(lat, lng) {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat, lng },
    zoom: 8,
  });
}


function weather1(){
  const form = document.getElementById("weather-form");
  const locationInput = document.getElementById("location-input").value.toLowerCase().replace(/[^a-z]/g, '');

  const temperature = document.getElementById("temperature");
  const description = document.getElementById("description");

  // const API_KEY = "d4e8263df058bdb6f8d3921d90e52b30";

  // const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

  // const location = locationInput.value.toLowerCase().replace(/[^a-z]/g, '');
  const url = `/api2?q=${locationInput}`;
  console.log("Location " + locationInput)

  // const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      temperature.textContent = `Temperature in ${locationInput}: ${(data.main.temp - 273.15).toFixed(2)}°C`;
      if (data.weather && data.weather[0] && data.weather[0].description) {
        description.innerHTML = `Description: ${data.weather[0].description} </br>`;
      }

      description.innerHTML += data.wind.speed
        ? `Speed: ${data.wind.speed} </br>`
        : "";
        description.innerHTML += data.main.feels_like
        ? `Feels like: ${(data.main.feels_like - 273.15).toFixed(2)}°C </br>`
        : "";
    
      description.innerHTML += data.main.grnd_level
        ? `Ground Level: ${data.main.grnd_level} </br>`
        : "";
      description.innerHTML += data.main.humidity
        ? `Humidity: ${data.main.humidity} </br>`
        : "";
        description.innerHTML += data.main.pressure
        ? `Pressure: ${data.main.pressure} hPa </br>`
        : "";
    
      description.innerHTML += data.main.sea_level
        ? `Sea Level: ${data.main.sea_level}`
        : "";
    })
    .catch((error) => {
      console.log(error);
      alert("An error occurred while fetching weather data");
    });
}

//This is for wiki search

function search() {
  // const searchTerm = document.getElementById("location-input").value;
  const locationInput = document.getElementById("location-input").value.toLowerCase().replace(/[^a-z]/g, '');


  // const url = `/api3?q=${locationInput}`;

  // const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${locationInput}&exsentences=30&exintro=2&explaintext=2&callback=processResponse`;


  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${locationInput}&exsentences=50&exintro=10&explaintext=0&callback=processResponse`;

  

  window.processResponse = (data) => {
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];
    const extract = page.extract;
  
    const paragraphs = extract.split("\n\n"); // split the content into paragraphs
  
    const resultsElement = document.getElementById("results");
    resultsElement.innerHTML = ""; // clear the old results

    paragraphs.forEach((paragraph) => {
      const p = document.createElement("p"); // create a new <p> element
      p.innerText = paragraph; // set the content of the <p> element
      resultsElement.appendChild(p); // add the <p> element to the results element
    });
  };
  
  const script = document.createElement("script");
  script.src = url;
  document.head.appendChild(script);
  
}

// 10 days weather info
// const locationInput = document.getElementById("location-input");

const weatherData = document.getElementById("weatherData");

function weatherInfo() {
  // const location = locationInput;

  // const apiKey = "Y7R7LTLPLTJ4ZLXJV9JC6PXC7";
  // const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${apiKey}&contentType=json`;
  const url = `/api5?q=${locationInput}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Clear existing table body
      weatherData.innerHTML = "";

      // Add rows for each day to table body
      data.days.forEach((day) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${day.datetime}</td>
          <td>${day.tempmin}°C</td>
          <td>${day.tempmax}°C</td>
          <td>${day.precip}mm</td>
          <td>${day.conditions}</td>
        `;
        weatherData.appendChild(row);
      });
    })
    .catch((error) => console.error(error));
}

//photo Gallery

const imageContainer = document.getElementById("image-container");

function photoGallery() {
  console.log(locationInput + " locationInput inside photp");

  let apiContainer = document.getElementsByClassName("apiContainer")[0];
  apiContainer.style.display = "block";

  // const location = locationInput.value;

  let accessKey = "0XGK6yAflMMxD_patFaDipFvrJyI8mi_aVrOQ6Y3Zu8";

  // Use the Unsplash API to get photos based on the location input
  // const url = `https://api.unsplash.com/search/photos?query=${location}&client_id=${accessKey}`;
  const url = `/api4?q=${locationInput}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Clear existing images
      imageContainer.innerHTML = "";

      // Add images to image container
      data.results.forEach((result) => {
        const img = document.createElement("img");
        img.src = result.urls.regular;
        img.alt = result.alt_description;
        imageContainer.appendChild(img);
      });
    })
    .catch((error) => console.error(error));
}
