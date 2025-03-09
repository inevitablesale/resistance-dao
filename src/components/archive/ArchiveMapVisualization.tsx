
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Radiation, Network, Database, Users, Building, Lock, Unlock } from 'lucide-react';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { ToxicProgress } from '@/components/ui/toxic-progress';
import { FeatureUnlock } from '@/hooks/useRadiationSystem';

interface ArchiveMapVisualizationProps {
  currentRadiation: number;
  totalHolders: number;
  featureUnlocks: FeatureUnlock[];
  narrativeContext: string;
}

// Map marker data - will be improved with real data later
const initialArchiveNodes = [
  { id: 1, lng: -74.5, lat: 40.7, label: "East Coast Archive Node", status: "active" },
  { id: 2, lng: -122.4, lat: 37.8, label: "West Coast Archive Node", status: "active" },
  { id: 3, lng: -0.1, lat: 51.5, label: "European Archive Node", status: "pending" },
  { id: 4, lng: 139.7, lat: 35.7, label: "Asian Archive Node", status: "inactive" },
  { id: 5, lng: 151.2, lat: -33.9, label: "Southern Archive Node", status: "inactive" },
];

// Temporary Mapbox token - in production this should be stored securely
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGVtby1yZXNpc3RhbmNlIiwiYSI6ImNscXp4Nml0ZzAwMG0yanA1aWZ2Z2UwY24ifQ.1JKfMlNr9dCLcOdxo9mEjw';

export const ArchiveMapVisualization = ({ 
  currentRadiation, 
  totalHolders, 
  featureUnlocks,
  narrativeContext
}: ArchiveMapVisualizationProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const connections = useRef<any[]>([]);

  // Get color based on radiation level
  const getRadiationColor = (level: number): string => {
    if (level > 75) return 'rgba(255, 59, 48, 0.6)';
    if (level > 50) return 'rgba(255, 149, 0, 0.5)';
    if (level > 25) return 'rgba(255, 204, 0, 0.4)';
    return 'rgba(52, 199, 89, 0.3)';
  };

  // Calculate which nodes are active based on radiation
  const getActiveNodes = (radiation: number) => {
    if (radiation <= 25) return 5;
    if (radiation <= 50) return 4;
    if (radiation <= 75) return 3;
    if (radiation <= 90) return 2;
    return 1;
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [0, 20],
      zoom: 1.4,
      projection: 'globe',
      pitch: 40,
      antialias: true
    });

    map.current.on('load', () => {
      if (!map.current) return;
      
      // Add atmospheric effect
      map.current.setFog({
        color: getRadiationColor(currentRadiation),
        'high-color': 'rgba(36, 92, 223, 0.4)',
        'space-color': '#000',
        'star-intensity': 0.15,
        'horizon-blend': 0.4
      });

      // Add radiation layer
      map.current.addSource('radiation-cover', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-180, -90],
                [180, -90],
                [180, 90],
                [-180, 90],
                [-180, -90]
              ]
            ]
          }
        }
      });

      map.current.addLayer({
        id: 'radiation-layer',
        type: 'fill',
        source: 'radiation-cover',
        paint: {
          'fill-color': getRadiationColor(currentRadiation),
          'fill-opacity': currentRadiation / 150
        }
      });

      setMapLoaded(true);
    });

    // Auto-rotate the globe
    const secondsPerRevolution = 240;
    let lastTime = 0;
    let autoRotate = true;

    function frame(time: number) {
      if (!autoRotate || !map.current) {
        requestAnimationFrame(frame);
        return;
      }
      
      const rotateRate = 360 / secondsPerRevolution;
      if (lastTime !== 0) {
        const angleDelta = (time - lastTime) * rotateRate / 1000;
        const center = map.current.getCenter();
        center.lng -= angleDelta;
        map.current.easeTo({ center, duration: 0 });
      }
      
      lastTime = time;
      requestAnimationFrame(frame);
    }

    map.current.on('mousedown', () => {
      autoRotate = false;
    });

    map.current.on('touchstart', () => {
      autoRotate = false;
    });

    requestAnimationFrame(frame);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update map based on radiation level
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Update radiation fog color
    map.current.setFog({
      color: getRadiationColor(currentRadiation),
      'high-color': 'rgba(36, 92, 223, 0.4)',
      'space-color': '#000',
      'star-intensity': 0.15,
      'horizon-blend': 0.4
    });

    // Update radiation layer
    if (map.current.getSource('radiation-cover')) {
      map.current.setPaintProperty(
        'radiation-layer',
        'fill-color',
        getRadiationColor(currentRadiation)
      );
      
      map.current.setPaintProperty(
        'radiation-layer',
        'fill-opacity',
        currentRadiation / 150
      );
    }

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add archive nodes
    const activeNodeCount = getActiveNodes(currentRadiation);
    
    initialArchiveNodes.forEach((node, index) => {
      if (index >= activeNodeCount) return;
      
      const nodeStatus = index < activeNodeCount - 1 ? "active" : "pending";
      
      // Create custom marker element
      const el = document.createElement('div');
      el.className = `archive-node-marker ${nodeStatus}`;
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = nodeStatus === "active" ? 'rgba(57, 255, 20, 0.8)' : 'rgba(255, 204, 0, 0.7)';
      el.style.boxShadow = nodeStatus === "active" ? '0 0 15px rgba(57, 255, 20, 0.5)' : '0 0 10px rgba(255, 204, 0, 0.4)';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.cursor = 'pointer';
      el.style.transition = 'all 0.3s ease';
      
      // Add icon inside marker
      const iconElement = document.createElement('span');
      iconElement.innerHTML = '📡';
      iconElement.style.fontSize = '14px';
      el.appendChild(iconElement);
      
      // Add pulse animation for active nodes
      if (nodeStatus === "active") {
        const pulse = document.createElement('div');
        pulse.className = 'pulse-animation';
        pulse.style.position = 'absolute';
        pulse.style.width = '100%';
        pulse.style.height = '100%';
        pulse.style.borderRadius = '50%';
        pulse.style.backgroundColor = 'rgba(57, 255, 20, 0.4)';
        pulse.style.animation = 'pulse 2s infinite';
        el.appendChild(pulse);
        
        // Add keyframe animation
        if (!document.getElementById('pulse-style')) {
          const style = document.createElement('style');
          style.id = 'pulse-style';
          style.innerHTML = `
            @keyframes pulse {
              0% { transform: scale(1); opacity: 0.8; }
              70% { transform: scale(2); opacity: 0; }
              100% { transform: scale(1); opacity: 0; }
            }
          `;
          document.head.appendChild(style);
        }
      }
      
      // Add hover effect
      el.onmouseover = () => {
        el.style.transform = 'scale(1.2)';
      };
      
      el.onmouseout = () => {
        el.style.transform = 'scale(1)';
      };
      
      el.onclick = () => {
        setSelectedNode(node.id);
      };
      
      // Create and add marker to map
      const marker = new mapboxgl.Marker(el)
        .setLngLat([node.lng, node.lat])
        .addTo(map.current!);
        
      markers.current.push(marker);
    });

    // Create connections between nodes
    if (activeNodeCount > 1) {
      // Remove old connections
      connections.current.forEach(conn => {
        if (map.current?.getLayer(conn.id)) {
          map.current.removeLayer(conn.id);
        }
        if (map.current?.getSource(conn.id)) {
          map.current.removeSource(conn.id);
        }
      });
      connections.current = [];
      
      // Add new connections
      for (let i = 0; i < activeNodeCount - 1; i++) {
        for (let j = i + 1; j < activeNodeCount; j++) {
          const sourceId = `connection-${i}-${j}`;
          
          map.current.addSource(sourceId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [
                  [initialArchiveNodes[i].lng, initialArchiveNodes[i].lat],
                  [initialArchiveNodes[j].lng, initialArchiveNodes[j].lat]
                ]
              }
            }
          });
          
          map.current.addLayer({
            id: sourceId,
            type: 'line',
            source: sourceId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': 'rgba(57, 255, 20, 0.6)',
              'line-width': 2,
              'line-opacity': 0.7,
              'line-dasharray': [2, 1]
            }
          });
          
          connections.current.push({ id: sourceId });
        }
      }
    }

  }, [mapLoaded, currentRadiation]);

  // Find a node by ID
  const findNode = (id: number) => {
    return initialArchiveNodes.find(node => node.id === id);
  };

  // Function to get active feature name based on radiation
  const getActiveFeatureName = () => {
    const activeFeature = featureUnlocks.find(f => f.unlocked);
    return activeFeature ? activeFeature.name : "Offline";
  };

  return (
    <div className="mb-8 relative">
      <div className="absolute top-4 left-4 z-10 bg-black/70 p-3 rounded-lg border border-toxic-neon/20 max-w-[300px]">
        <div className="flex items-center gap-2 mb-2">
          <Radiation className="h-5 w-5 text-toxic-neon" />
          <h3 className="text-toxic-neon text-sm font-mono">Radiation Level: {currentRadiation}%</h3>
        </div>
        <ToxicProgress value={100 - currentRadiation} variant="radiation" className="mb-2" />
        <div className="flex items-center gap-2 mb-1">
          <Network className="h-4 w-4 text-toxic-neon" />
          <span className="text-white/80 text-xs">Network Status: {getActiveFeatureName()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-toxic-neon" />
          <span className="text-white/80 text-xs">Active Nodes: {getActiveNodes(currentRadiation)}/5</span>
        </div>
      </div>
      
      <div ref={mapContainer} className="w-full h-[400px] rounded-lg overflow-hidden" />
      
      {selectedNode && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-4 right-4 z-10 bg-black/80 p-4 rounded-lg border border-toxic-neon/30 max-w-[350px]"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-toxic-neon font-mono">{findNode(selectedNode)?.label}</h3>
            <button 
              className="text-white/60 hover:text-white"
              onClick={() => setSelectedNode(null)}
            >
              ✕
            </button>
          </div>
          
          <div className="mb-3">
            <ToxicBadge variant="outline" className="mb-2">
              {findNode(selectedNode)?.status === "active" ? (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-toxic-neon rounded-full"></span> Online
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span> Connecting
                </span>
              )}
            </ToxicBadge>
            
            <p className="text-white/70 text-sm">
              This Archive node is {findNode(selectedNode)?.status === "active" ? "actively" : "beginning to"} transmitting recovered data to the network. 
              {findNode(selectedNode)?.status === "active" 
                ? " Knowledge flows are stable and resource coordination is operational."
                : " Connection strength is increasing as radiation levels decrease."}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-black/50 p-2 rounded border border-toxic-neon/20">
              <div className="text-xs text-white/60">Data Recovery</div>
              <div className="text-sm text-toxic-neon font-mono">76%</div>
            </div>
            <div className="bg-black/50 p-2 rounded border border-toxic-neon/20">
              <div className="text-xs text-white/60">Resource Flow</div>
              <div className="text-sm text-toxic-neon font-mono">124 units/h</div>
            </div>
          </div>
          
          <button 
            className="w-full bg-toxic-neon/20 hover:bg-toxic-neon/30 text-toxic-neon border border-toxic-neon/30 rounded py-1 text-sm transition-colors"
            onClick={() => setSelectedNode(null)}
          >
            View Node Details
          </button>
        </motion.div>
      )}
      
      <div className="mt-4 text-sm text-white/70 italic p-3 bg-black/50 border border-toxic-neon/10 rounded">
        {narrativeContext}
      </div>
    </div>
  );
};
