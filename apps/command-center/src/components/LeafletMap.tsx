'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Lead, formatCurrency } from '@/lib/leads';
import 'leaflet/dist/leaflet.css';

interface LeafletMapProps {
  leads: Lead[];
}

const customIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCA5LjVjLTEuMzggMC0yLjUtMS4xMi0yLjUtMi41czEuMTItMi41IDIuNS0yLjUgMi41IDEuMTIgMi41IDIuNS0xLjEyIDIuNS0yLjUgMi41eiIgZmlsbD0iIzM5RkYxNCIvPgo8L3N2Zz4=',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function LeafletMap({ leads }: LeafletMapProps) {
  const center: [number, number] = [28.5383, -81.3792]; // Orlando center

  return (
    <MapContainer
      center={center}
      zoom={10}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {leads.map((lead, index) => (
        <Marker
          key={index}
          position={[lead.lat, lead.lng]}
          icon={customIcon}
        >
          <Popup className="custom-popup">
            <div className="p-2 min-w-[250px]">
              <h4 className="font-bold text-neon-green text-sm mb-2">
                {lead.project_name}
              </h4>
              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-gray-400">Developer:</span>{' '}
                  <span className="text-white">{lead.developer}</span>
                </div>
                <div>
                  <span className="text-gray-400">Value:</span>{' '}
                  <span className="text-neon-green font-bold">
                    {formatCurrency(lead.project_value)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Type:</span>{' '}
                  <span className="text-white">{lead.project_type}</span>
                </div>
                <div>
                  <span className="text-gray-400">Location:</span>{' '}
                  <span className="text-white text-xs">{lead.location}</span>
                </div>
                <div>
                  <span className="text-gray-400">Contact:</span>{' '}
                  <span className="text-white text-xs">{lead.contact}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-gray-700">
                  <span className={lead.qualified ? 'text-neon-green' : 'text-yellow-500'}>
                    {lead.qualified ? '✓ QUALIFIED' : '⚠ PENDING'}
                  </span>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
