import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet';
import type { Marker as LeafletMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { createAssetIcon } from '../helpers/mapHelper';
import { assetsSelector, selectedAssetSelector, setSelectedAsset, type Asset } from '../store/assetsSlice';
import type { AssetStatus } from '../services/assets';
import { useDispatch, useSelector } from 'react-redux';
import { FitAssetsBounds } from './FitAssetsBounds';
import { setIsModalOpen } from '../store/AppSlice';


const DEFAULT_CENTER: [number, number] = [37.9838, 23.7275]; // replace if needed
const DEFAULT_ZOOM = 7;
const FOCUS_ZOOM = 15;

function MapController({
    assets,
    markerRefs,
}: {
    assets: Asset[];
    selectedAssetId: string | null;
    markerRefs: React.MutableRefObject<Record<string, LeafletMarker | null>>;
}) {
    const map = useMap();
    const selectedAsset = useSelector(selectedAssetSelector);

    useEffect(() => {
        if (!selectedAsset) return;

        const asset = assets.find((a) => a.id === selectedAsset?.id);
        if (!asset) return;

        map.flyTo([asset.lat, asset.lng], FOCUS_ZOOM, {
            duration: 0.6,
        });

        const marker = markerRefs.current[selectedAsset?.id];
        marker?.openPopup();
    }, [selectedAsset, assets, map, markerRefs]);

    return null;
}

const Map = () => {
    const dispatch = useDispatch();
    const assets = useSelector(assetsSelector);
    const selectedAsset = useSelector(selectedAssetSelector);

    const handleAssetClick = (asset: Asset) => {
        dispatch(setSelectedAsset(asset))
        dispatch(setIsModalOpen(true))
        console.log({ selectedAsset: asset });
    }

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
                    selectedAssetId={selectedAsset?.id || null}
                    markerRefs={markerRefs}
                />
                <FitAssetsBounds />
                {assets.map((asset: Asset) => (
                    <Marker
                        key={asset.id}
                        position={[asset.lat, asset.lng]}
                        icon={createAssetIcon(asset.status as AssetStatus)}
                        ref={(ref) => {
                            markerRefs.current[asset.id] = ref;
                        }}
                        eventHandlers={{
                            click: () => {
                                console.log(asset.id);
                                handleAssetClick(asset)
                            },
                        }}
                    >
                        <Tooltip
                            direction="top"
                            offset={[0, -10]}
                            opacity={1}
                            permanent={false}
                        >
                            {asset.name}
                        </Tooltip>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}

export default Map