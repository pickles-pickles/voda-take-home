import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useSelector } from 'react-redux';
import { assetsSelector, selectedAssetSelector } from '../store/assetsSlice';

export function FitAssetsBounds() {
    const map = useMap();
    const hasFitRef = useRef(false);

    const assets = useSelector(assetsSelector);
    const selectedAsset = useSelector(selectedAssetSelector);

    useEffect(() => {
        if (selectedAsset?.id) return;
        if (!assets.length) return;

        const bounds = L.latLngBounds(assets.map((a) => [a.lat, a.lng] as [number, number]));
        map.fitBounds(bounds, { padding: [40, 40] });
        hasFitRef.current = true;
    }, [assets, selectedAsset?.id, map]);

    return null;
}