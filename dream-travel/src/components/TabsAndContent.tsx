import React, { useState, useEffect, useRef } from 'react';

const MyComponent: React.FC = () => {
  const [locationInput, setLocationInput] = useState('');
  const temperatureRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const apiContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getLocation = () => {
      const formattedInput = locationInput.toLowerCase().replace(/[^a-z]/g, "");
      console.log(formattedInput + " locationInput");
      // Rest of your getLocation function...
    };

    const weather1 = () => {
      const formattedInput = locationInput.toLowerCase().replace(/[^a-z]/g, "");
      const temperature = temperatureRef.current;
      const description = descriptionRef.current;
      const url = `/api2?q=${formattedInput}`;
      // Rest of your weather1 function...
    };

    const search = () => {
      const formattedInput = locationInput;
      const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${formattedInput}&exsentences=50&exintro=10&explaintext=0&callback=processResponse`;
      // Rest of your search function...
    };

    const weatherInfo = () => {
      const formattedInput = locationInput.toLowerCase().replace(/[^a-z]/g, "");
      const url = `/api5?location=${formattedInput}`;
      // Rest of your weatherInfo function...
    };

    const photoGallery = () => {
      const formattedInput = locationInput.toLowerCase().replace(/[^a-z]/g, "");
      const apiContainer = apiContainerRef.current;
      if (apiContainer) {
        apiContainer.style.display = "block";
      }
      const url = `/api4?location=${formattedInput}`;
      // Rest of your photoGallery function...
    };

    getLocation();
    weather1();
    search();
    weatherInfo();
    photoGallery();
  }, [locationInput]);

  return (
    <>
      <div className="my-custom-container">
        <div className="my-4 mx-auto" style={{ maxWidth: '600px' }}>
          <div className="input-group input-group-lg">
            <input
              type="text"
              id="location-input"
              className="form-control"
              placeholder="Search..."
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
            />
            <button
              className="btn btn-primary btn-lg"
              type="button"
              onClick={() => {
                getLocation();
                weather1();
                search();
                weatherInfo();
                photoGallery();
              }}
            >
              Go
            </button>
          </div>
        </div>
      </div>

      <div className="container my-4 mx-auto apiContainer" style={{ display: 'none' }} ref={apiContainerRef}>
        
      </div>
    </>
  );
};

export default MyComponent;