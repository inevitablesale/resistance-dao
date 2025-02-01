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
      style: 'mapbox://styles/mapbox/dark-v11',
      projection: 'globe',
      zoom: 2,
      center: [-100, 40], // Center on North America
      pitch: 45,
      bearing: 0
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add atmosphere and fog effects
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(186, 210, 235)', // Light blue fog
        'high-color': 'rgb(36, 92, 223)', // Darker blue sky
        'horizon-blend': 0.02, // Lower blend for sharper horizon
        'space-color': 'rgb(11, 11, 50)', // Dark space color
        'star-intensity': 0.6 // Add stars visibility
      });

      // Add custom atmosphere styling
      map.current?.setLight({
        color: 'white',
        intensity: 0.35,
        anchor: 'map'
      });
    });

    // Rotation animation
    const secondsPerRevolution = 240;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    let userInteracting = false;
    let spinEnabled = true;

    function spinGlobe() {
      if (!map.current) return;
      
      const zoom = map.current.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.current.getCenter();
        center.lng -= distancePerSecond;
        map.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }

    // Event listeners for interaction
    map.current.on('mousedown', () => {
      userInteracting = true;
    });
    
    map.current.on('dragstart', () => {
      userInteracting = true;
    });
    
    map.current.on('mouseup', () => {
      userInteracting = false;
      spinGlobe();
    });
    
    map.current.on('touchend', () => {
      userInteracting = false;
      spinGlobe();
    });

    map.current.on('moveend', () => {
      spinGlobe();
    });

    // Start the globe spinning
    spinGlobe();

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
    <div className="relative w-full h-[600px] bg-[#0b0b32]">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-[#0b0b32]/10 rounded-lg" />
    </div>
  );
};

export default Map;