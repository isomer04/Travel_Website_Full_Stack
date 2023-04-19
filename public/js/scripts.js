const locationInput = document
  .getElementById("location-input")
  .value.toLowerCase()
  .replace(/[^a-z]/g, "");

// document.getElementById("output").style.display = "block";
// document.getElementById("error-message").style.display = "block";

function getLocation() {
  const locationInput = document
    .getElementById("location-input")
    .value.toLowerCase()
    .replace(/[^a-z]/g, "");

  console.log(locationInput + " locationInput");

  const geocoder = new google.maps.Geocoder();
  const placesService = new google.maps.places.PlacesService(
    document.createElement("div")
  );

  geocoder.geocode({ address: locationInput }, (results, status) => {
    if (status === "OK") {
      const location = results[0].geometry.location;
      console.log(`Latitude: ${location.lat()}, Longitude: ${location.lng()}`);

      // Calling functions
      initMap(location.lat(), location.lng());
      showRestaurants(
        location.lat(),
        location.lng(),
        "restaurant",
        "restaurant-list"
      );
      const showHotels = showRestaurants(
        location.lat(),
        location.lng(),
        "hotels",
        "hotel-list"
      );
      const showAccommodations = showRestaurants(
        location.lat(),
        location.lng(),
        "accommodation",
        "accommodation-list"
      );
      const showActivities = showRestaurants(
        location.lat(),
        location.lng(),
        "activities",
        "activities-list"
      );
      const showAttractions = showRestaurants(
        location.lat(),
        location.lng(),
        "attractions",
        "attractions-list"
      );
      const showHealth = showRestaurants(
        location.lat(),
        location.lng(),
        "health",
        "health-list"
      );
      const showSafety = showRestaurants(
        location.lat(),
        location.lng(),
        "safety",
        "safety-list"
      );
      const showTransfortion = showRestaurants(
        location.lat(),
        location.lng(),
        "transportation",
        "transportation-list"
      );

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
            document.getElementById("error-message").style.display = "none";

            const place = results[0];

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
                document.getElementById("place-photo").style.display = "block";

                document.getElementById("place-photo").src = photoUrl;
              } else {
                console.error("Place details not found.");
                document.getElementById("output").style.display = "none";
                document.getElementById("error-message").style.display =
                  "block";
                document.getElementById("error-message").textContent =
                  "Sorry, we could not find details for this place.";
              }
            });
          } else if (status === "ZERO_RESULTS") {
            console.error("No places found.");
            document.getElementById("output").style.display = "none";
            document.getElementById("error-message").style.display = "block";
            document.getElementById("error-message").textContent =
              "Sorry, we could not find any places near this location.";
          } else if (status === "OVER_QUERY_LIMIT") {
            console.error("Query limit reached.");
            document.getElementById("output").style.display = "none";
            document.getElementById("error-message").style.display = "block";
            document.getElementById("error-message").textContent =
              "Sorry, we have exceeded our query limit. Please try again later.";
          }
        }
      );
    } else {
      console.log(
        `Geocode was not successful for the following reason: ${status}.`
      );
      // document.getElementById("output").style.display = "none";
      document.getElementById("error-message").style.display = "block";
      document.getElementById("error-message").textContent =
        "Sorry, we could not find this location. Please enter a valid location.";
      document.getElementById("place-name").textContent = "";
      document.getElementById("place-description").textContent = "";

      document.getElementById("place-photo").style.display = "none";
    }
  });
}

// Function to initialize the map with the given location
function initMap(latitude, longitude) {
  const mapDiv = document.getElementById("map");

  // Create a new map object centered at the given location
  const map = new google.maps.Map(mapDiv, {
    center: { lat: latitude, lng: longitude },
    zoom: 13,
  });

  // Add a marker at the given location
  const marker = new google.maps.Marker({
    position: { lat: latitude, lng: longitude },
    map: map,
  });
}

// Function for generating a list of places 
function showRestaurants(latitude, longitude, keywordName, classListName) {
  const location = new google.maps.LatLng(latitude, longitude);
  const radius = 500; // in meters
  const keyword = keywordName;
  const map = new google.maps.Map(document.getElementById("map"), {
    center: location,
    zoom: 15,
  });
  const request = {
    location,
    radius,
    keyword,
  };
  const service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      const restaurantList = document.getElementById(classListName);
      restaurantList.innerHTML = "";
      results.forEach((place) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        const row = document.createElement("div");
        row.classList.add("row");
        const col1 = document.createElement("div");
        col1.classList.add("col-4");
        const img = document.createElement("img");
        img.src = place.photos && place.photos[0].getUrl();
        img.alt = place.name;
        img.classList.add("img-fluid", "img-thumbnail", "rounded");
        col1.appendChild(img);
        row.appendChild(col1);
        const col2 = document.createElement("div");
        col2.classList.add("col-8");
        const name = document.createElement("h5");
        name.classList.add("mt-0");
        name.textContent = place.name;
        col2.appendChild(name);
        const address = document.createElement("p");
        address.textContent = place.vicinity;
        col2.appendChild(address);
        const link = document.createElement("a");
        link.href = `https://www.google.com/maps/dir/?api=1&destination=${place.geometry.location.lat()},${place.geometry.location.lng()}`;
        link.textContent = "Get Directions";
        link.target = "_blank"; 
        col2.appendChild(link);
        row.appendChild(col2);
        li.appendChild(row);
        restaurantList.appendChild(li);
      });
    }
  });
}



function weather1() {
  const form = document.getElementById("weather-form");
  const locationInput = document
    .getElementById("location-input")
    .value.toLowerCase()
    .replace(/[^a-z]/g, "");

  const temperature = document.getElementById("temperature");
  const description = document.getElementById("description");

  const url = `/api2?q=${locationInput}`;
  console.log("Location " + locationInput);

  // const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      temperature.textContent = `Temperature in ${locationInput}: ${(
        data.main.temp - 273.15
      ).toFixed(2)}°C`;
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
      // alert("An error occurred while fetching weather data");
    });
}

//This is for wiki search

function search() {
  const locationInput = document.getElementById("location-input").value;

  // const url = `/api3?q=${locationInput}`;

  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${locationInput}&exsentences=50&exintro=10&explaintext=0&callback=processResponse`;

  window.processResponse = (data) => {
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];
    const extract = page.extract;
    console.log(JSON.stringify(extract) + " this is a extract log"); // add this line to log the page object

    const paragraphs = extract; //.split("\n\n"); // split the content into paragraphs

    const resultsElement = document.getElementById("results");
    resultsElement.innerHTML = ""; // clear the old results

    if (Array.isArray(paragraphs)) {
      paragraphs.forEach((paragraph) => {
        const p = document.createElement("p"); // create a new <p> element
        p.innerText = paragraph; // set the content of the <p> element
        resultsElement.appendChild(p); // add the <p> element to the results element
      });
    } else {
      console.error("Paragraphs is not an array.");
      const p = document.createElement("p"); // create a new <p> element
      p.innerText = paragraphs; // set the content of the <p> element
      resultsElement.appendChild(p);
    }
  };

  const script = document.createElement("script");
  script.src = url;
  document.head.appendChild(script);
}

const weatherData = document.getElementById("weatherData");

function weatherInfo() {
  const locationInput = document
    .getElementById("location-input")
    .value.toLowerCase()
    .replace(/[^a-z]/g, "");

  const url = `/api5?location=${locationInput}`;

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
  const locationInput = document
    .getElementById("location-input")
    .value.toLowerCase()
    .replace(/[^a-z]/g, "");

  let apiContainer = document.getElementsByClassName("apiContainer")[0];
  apiContainer.style.display = "block";

  const url = `/api4?location=${locationInput}`;

  console.log("locationInput inside unsplash " + locationInput);

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
