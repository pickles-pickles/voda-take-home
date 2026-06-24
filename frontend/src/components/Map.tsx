import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import type { Marker as LeafletMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { createAssetIcon } from '../helpers/mapHelper';
import { assetsSelector, type Asset } from '../store/assetsSlice';
import type { AssetStatus } from '../services/assets';
import { useSelector } from 'react-redux';

type AssetsMapProps = {
    selectedAssetId: string | null;
    onSelectAsset: (assetId: string) => void;
};

const DEFAULT_CENTER: [number, number] = [37.9838, 23.7275]; // replace if needed
const DEFAULT_ZOOM = 7;
const FOCUS_ZOOM = 15;

function MapController({
    assets,
    selectedAssetId,
    markerRefs,
}: {
    assets: Asset[];
    selectedAssetId: string | null;
    markerRefs: React.MutableRefObject<Record<string, LeafletMarker | null>>;
}) {
    const map = useMap();

    useEffect(() => {
        if (!selectedAssetId) return;

        const asset = assets.find((a) => a.id === selectedAssetId);
        if (!asset) return;

        map.flyTo([asset.lat, asset.lng], FOCUS_ZOOM, {
            duration: 0.6,
        });

        const marker = markerRefs.current[selectedAssetId];
        marker?.openPopup();
    }, [selectedAssetId, assets, map, markerRefs]);

    return null;
}

const Map = ({
    selectedAssetId,
    onSelectAsset,
}: AssetsMapProps) => {
    const assets = useSelector(assetsSelector);

    const markerRefs = useRef<Record<string, LeafletMarker | null>>({});

    const center = useMemo<[number, number]>(() => {
        if (!assets.length) return DEFAULT_CENTER;
        return [assets[0].lat, assets[0].lng];
    }, [assets]);

    return (
        <div style={{ height: '100%', minHeight: 500, borderRadius: 12, overflow: 'hidden' }}>
            <MapContainer
                center={center}
                zoom={DEFAULT_ZOOM}
                scrollWheelZoom
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController
                    assets={assets}
                    selectedAssetId={selectedAssetId}
                    markerRefs={markerRefs}
                />

                {assets.map((asset: Asset) => (
                    <Marker
                        key={asset.id}
                        position={[asset.lat, asset.lng]}
                        icon={createAssetIcon(asset.status as AssetStatus)}
                        ref={(ref) => {
                            markerRefs.current[asset.id] = ref;
                        }}
                        eventHandlers={{
                            click: () => onSelectAsset(asset.id),
                        }}
                    />
                ))}
            </MapContainer>
        </div>
    );
}

export default Map