import L from 'leaflet';
import type { AssetStatus } from '../services/assets';

export const getStatusColor = (status: AssetStatus) => {
    switch (status) {
        case 'ok':
            return '#22c55e';
        case 'warning':
            return '#f59e0b';
        case 'critical':
            return '#ef4444';
        default:
            return '#3b82f6';
    }
};

export const createAssetIcon = (status: AssetStatus) =>
    L.divIcon({
        className: '',
        html: `
      <div
        style="
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: ${getStatusColor(status)};
          border: 2px solid white;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.15);
        "
      ></div>
    `,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
    });