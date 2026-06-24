import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap, useMapEvents, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export type BaseLayerId = 'satellite' | 'streets' | 'topo'

export interface ClickInfo {
  lat: number
  lng: number
}

interface TileDef {
  url: string
  attribution: string
  maxZoom: number
  subdomains?: string
}

// Free, no-token global tile providers — full worldwide coverage.
export const BASE_LAYERS: Record<BaseLayerId, { label: string; tile: TileDef }> = {
  satellite: {
    label: 'Satellite imagery',
    tile: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Imagery © Esri, Maxar, Earthstar Geographics',
      maxZoom: 19,
    },
  },
  streets: {
    label: 'Street map',
    tile: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      subdomains: 'abc',
    },
  },
  topo: {
    label: 'Topographic',
    tile: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '© OpenTopoMap (CC-BY-SA), © OpenStreetMap',
      maxZoom: 17,
      subdomains: 'abc',
    },
  },
}

// Place-name labels overlay (rendered above satellite imagery).
const LABELS_TILE: TileDef = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
  attribution: '',
  maxZoom: 19,
}

function FlyTo({ target }: { target: { lat: number; lng: number; zoom?: number } | null }) {
  const map = useMap()
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], target.zoom ?? 13, { duration: 1.2 })
  }, [target, map])
  return null
}

function ClickProbe({ onPick }: { onPick: (info: ClickInfo) => void }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

interface Props {
  base: BaseLayerId
  showLabels: boolean
  showContours: boolean
  contourOpacity: number
  flyTarget: { lat: number; lng: number; zoom?: number } | null
  marker: ClickInfo | null
  onPick: (info: ClickInfo) => void
}

export default function WorldMap({
  base,
  showLabels,
  showContours,
  contourOpacity,
  flyTarget,
  marker,
  onPick,
}: Props) {
  const layer = BASE_LAYERS[base]

  return (
    <MapContainer
      center={[20, 0]}
      zoom={3}
      minZoom={2}
      worldCopyJump
      className="w-full h-full"
      style={{ background: '#080C10' }}
      zoomControl={false}
      attributionControl
    >
      <TileLayer
        key={base}
        url={layer.tile.url}
        attribution={layer.tile.attribution}
        maxZoom={layer.tile.maxZoom}
        {...(layer.tile.subdomains ? { subdomains: layer.tile.subdomains } : {})}
      />

      {/* Place labels above imagery */}
      {showLabels && base === 'satellite' && (
        <TileLayer url={LABELS_TILE.url} maxZoom={LABELS_TILE.maxZoom} />
      )}

      {/* Demo analysis overlay (contours) as a tinted tile layer */}
      {showContours && (
        <TileLayer
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          subdomains="abc"
          maxZoom={17}
          opacity={contourOpacity}
        />
      )}

      {marker && (
        <Circle
          center={[marker.lat, marker.lng]}
          radius={40}
          pathOptions={{ color: '#2AFFA0', fillColor: '#2AFFA0', fillOpacity: 0.3, weight: 2 }}
        />
      )}

      <FlyTo target={flyTarget} />
      <ClickProbe onPick={onPick} />
    </MapContainer>
  )
}
