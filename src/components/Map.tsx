import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from './ui/input';
import { Button } from './ui/button';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState('');
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  const initializeMap = () => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      zoom: 13,
      center: [-73.935242, 40.730610], // New York
      pitch: 45,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    setIsMapInitialized(true);
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (!isMapInitialized) {
    return (
      <div className="p-4 space-y-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-semibold mb-2">Enter Mapbox Token</h2>
          <div className="flex gap-2">
            <Input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your Mapbox public token"
              className="flex-1"
            />
            <Button onClick={initializeMap}>Initialize Map</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px]">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
    </div>
  );
};

export default Map;