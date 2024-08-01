import React, { useEffect } from 'react';

const GoogleMapsLoader = ({ apiKey, libraries = [] }) => {
  useEffect(() => {
    if (window.google) return; // Google Maps script already loaded

    // Create the script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=${libraries.join(',')}&key=${apiKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // Cleanup function to remove the script
    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, [apiKey, libraries]);

  return null;
};

export default GoogleMapsLoader;
