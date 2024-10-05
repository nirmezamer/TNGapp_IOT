import React, { useEffect } from 'react';

const MapComponent = ({ latitude, longitude }) => {
  useEffect(() => {
    const loadAzureMaps = () => {
      // Add Mapbox CSS
      const link = document.createElement('link');
      link.href = 'https://atlas.microsoft.com/sdk/js/atlas.min.css?api-version=2.0';
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      // Load the Azure Maps JavaScript
      const script = document.createElement('script');
      script.src = 'https://atlas.microsoft.com/sdk/js/atlas.min.js?api-version=2.0';
      script.onload = () => initializeMap();
      document.body.appendChild(script);
    };

    const initializeMap = () => {
      const subscriptionKey = "8Jux9Ej5haMKG3J3vAcirUxKfDsXzxC4NVdjc9MZqnbFZ4Tqi31fJQQJ99AHACYeBjFPSPD9AAAgAZMP6avG";

      const map = new atlas.Map('myMap', {
        center: [longitude || 34.7818, latitude || 32.0853], // Use provided coordinates or default to Tel Aviv
        zoom: 12,
        view: 'Auto',
        authOptions: {
          authType: 'subscriptionKey',
          subscriptionKey: subscriptionKey,
        },
      });

      map.events.add('ready', () => {
        // Add a point marker at the specified location
        const marker = new atlas.HtmlMarker({
          htmlContent: '<div style="background-color:red; width:10px; height:10px; border-radius:50%;"></div>',
          position: [longitude || 34.7818, latitude || 32.0853], // Marker coordinates
        });

        // Add the marker to the map
        map.markers.add(marker);
      });
    };

    if (!window.atlas) {
      loadAzureMaps();
    } else {
      initializeMap();
    }
  }, [latitude, longitude]);

  return <div id="myMap" style={{ width: '100%', height: '300px' }}></div>;
};

export default MapComponent;
