// MapComponent.js
import React, { useEffect } from 'react';

const MapComponent = () => {
  useEffect(() => {
    const loadAzureMaps = () => {
      const script = document.createElement('script');
      script.src = 'https://atlas.microsoft.com/sdk/js/atlas.min.js?api-version=2.0';
      script.onload = () => initializeMap();
      document.body.appendChild(script);
    };

    const initializeMap = () => {
      const subscriptionKey = "8Jux9Ej5haMKG3J3vAcirUxKfDsXzxC4NVdjc9MZqnbFZ4Tqi31fJQQJ99AHACYeBjFPSPD9AAAgAZMP6avG";

      const map = new atlas.Map('myMap', {
        center: [34.7818, 32.0853], // Centered on Tel Aviv
        zoom: 12,
        view: 'Auto',
        authOptions: {
          authType: 'subscriptionKey',
          subscriptionKey: subscriptionKey,
        },
      });

      map.events.add('ready', () => {
        // Add any map customizations here if needed
      });
    };

    if (!window.atlas) {
      loadAzureMaps();
    } else {
      initializeMap();
    }
  }, []);

  return <div id="myMap" style={{ width: '100%', height: '300px' }}></div>;
};

export default MapComponent
