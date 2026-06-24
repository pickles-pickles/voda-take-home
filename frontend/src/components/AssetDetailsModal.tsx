import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { selectedAssetSelector, type Asset } from '../store/assetsSlice';
import { useSelector } from 'react-redux';
import { isModalOpenSelector } from '../store/AppSlice';
// import { updateAsset } from '../store/assetsSlice'; // use your real action


type AssetDetailsModalProps = {
    onClose: () => void;
    onSubmitAsset: (updatedAsset: Asset) => void; // pass your dispatch wrapper from parent OR dispatch here directly
};

type AssetFormValues = {
    name: string;
    type: string;
    status: string;
    lat: number;
    lng: number;
    installed_at: string;
    last_inspected_at: string;
    notes: string;
};

function assetToFormValues(asset: Asset): AssetFormValues {
    return {
        name: asset.name,
        type: asset.type,
        status: asset.status,
        lat: asset.lat,
        lng: asset.lng,
        installed_at: asset.installed_at,
        last_inspected_at: asset.last_inspected_at ?? '',
        notes: asset.notes ?? '',
    };
}

function formValuesToAsset(asset: Asset, values: AssetFormValues): Asset {
    return {
        ...asset,
        name: values.name.trim(),
        type: values.type.trim(),
        status: values.status,
        lat: Number(values.lat),
        lng: Number(values.lng),
        installed_at: values.installed_at,
        last_inspected_at: values.last_inspected_at || null,
        notes: values.notes.trim() || null,
    };
}

const AssetDetailsModal = ({
    onClose,
    onSubmitAsset,
}: AssetDetailsModalProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const isOpen = useSelector(isModalOpenSelector)
    const asset = useSelector(selectedAssetSelector)
    const initialValues = useMemo<AssetFormValues>(
        () =>
            asset
                ? assetToFormValues(asset)
                : {
                    name: '',
                    type: '',
                    status: 'ok',
                    lat: 0,
                    lng: 0,
                    installed_at: '',
                    last_inspected_at: '',
                    notes: '',
                },
        [asset]
    );

    const {
        register,
        handleSubmit,
        reset,
        formState: { isDirty, isSubmitting, errors },
    } = useForm<AssetFormValues>({
        defaultValues: initialValues,
    });

    /**
     * Sync form when modal opens or selected asset changes.
     * Important: reset the form to the persisted asset values and leave edit mode.
     */
    useEffect(() => {
        if (!asset || !isOpen) return;

        reset(assetToFormValues(asset));
        setIsEditing(false);
    }, [asset, isOpen, reset]);

    if (!isOpen || !asset) return null;

    const handleStartEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        reset(assetToFormValues(asset));
        setIsEditing(false);
    };

    const handleReset = () => {
        reset(assetToFormValues(asset));
    };

    const onSubmit = (values: AssetFormValues) => {
        const updatedAsset = formValuesToAsset(asset, values);
        onSubmitAsset(updatedAsset);
        setIsEditing(false);
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: 560,
                    maxWidth: '92vw',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    background: 'white',
                    borderRadius: 12,
                    padding: 20,
                    boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        gap: 12,
                        marginBottom: 16,
                    }}
                >
                    <div>
                        <h2 style={{ margin: 0 }}>
                            {isEditing ? 'Edit asset' : 'Asset details'}
                        </h2>
                        <div style={{ color: '#6b7280', marginTop: 4 }}>
                            Asset ID: {asset.id}
                        </div>
                    </div>

                    <button type="button" onClick={onClose}>
                        Close
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 12,
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label htmlFor="name">Name</label>
                            <input
                                id="name"
                                disabled={!isEditing}
                                {...register('name', { required: 'Name is required' })}
                            />
                            {errors.name && (
                                <span style={{ color: 'crimson', fontSize: 12 }}>
                                    {errors.name.message}
                                </span>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label htmlFor="type">Type</label>
                            <select
                                id="type"
                                disabled={!isEditing}
                                {...register('type', { required: 'Type is required' })}
                            >
                                <option value="pipe">pipe</option>
                                <option value="hydrant">hydrant</option>
                                <option value="sensor">sensor</option>
                                <option value="valve">valve</option>
                            </select>
                            {errors.type && (
                                <span style={{ color: 'crimson', fontSize: 12 }}>
                                    {errors.type.message}
                                </span>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                disabled={!isEditing}
                                {...register('status', { required: 'Status is required' })}
                            >
                                <option value="ok">ok</option>
                                <option value="warning">warning</option>
                                <option value="critical">critical</option>
                            </select>
                            {errors.status && (
                                <span style={{ color: 'crimson', fontSize: 12 }}>
                                    {errors.status.message}
                                </span>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label htmlFor="installed_at">Installed at</label>
                            <input
                                id="installed_at"
                                type="text"
                                disabled={true}
                                {...register('installed_at', {
                                    required: 'Installed date is required',
                                })}
                            />
                            {
                                <span style={{ color: 'lightgreen', fontSize: 12 }}>
                                    READ-ONLY. Proving I can use a calendar is out of scope
                                </span>
                            }
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label htmlFor="lat">Latitude</label>
                            <input
                                id="lat"
                                type="number"
                                step="any"
                                disabled={!isEditing}
                                {...register('lat', {
                                    required: 'Latitude is required',
                                    valueAsNumber: true,
                                    min: { value: -90, message: 'Latitude must be >= -90' },
                                    max: { value: 90, message: 'Latitude must be <= 90' },
                                })}
                            />
                            {errors.lat && (
                                <span style={{ color: 'crimson', fontSize: 12 }}>
                                    {errors.lat.message}
                                </span>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label htmlFor="lng">Longitude</label>
                            <input
                                id="lng"
                                type="number"
                                step="any"
                                disabled={!isEditing}
                                {...register('lng', {
                                    required: 'Longitude is required',
                                    valueAsNumber: true,
                                    min: { value: -180, message: 'Longitude must be >= -180' },
                                    max: { value: 180, message: 'Longitude must be <= 180' },
                                })}
                            />
                            {errors.lng && (
                                <span style={{ color: 'crimson', fontSize: 12 }}>
                                    {errors.lng.message}
                                </span>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label htmlFor="last_inspected_at">Last inspected at</label>
                            <input
                                id="last_inspected_at"
                                type="text"
                                disabled={true}
                                {...register('last_inspected_at')}
                            />
                            {
                                <span style={{ color: 'lightgreen', fontSize: 12 }}>
                                    READ-ONLY. Proving I can use a calendar is out of scope
                                </span>
                            }
                        </div>

                        <div
                            style={{
                                gridColumn: '1 / -1',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 6,
                            }}
                        >
                            <label htmlFor="notes">Notes</label>
                            <textarea
                                id="notes"
                                rows={4}
                                disabled={!isEditing}
                                {...register('notes')}
                            />
                        </div>
                    </div>

                    <div
                        style={{
                            marginTop: 20,
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 10,
                        }}
                    >
                        {!isEditing ? (
                            <>
                                <button type="button" onClick={onClose}>
                                    Close
                                </button>
                                <button type="button" onClick={handleStartEdit}>
                                    Edit
                                </button>
                            </>
                        ) : (
                            <>
                                <button type="button" onClick={handleCancelEdit}>
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleReset}
                                    disabled={!isDirty || isSubmitting}
                                >
                                    Reset
                                </button>

                                <button type="submit" disabled={isSubmitting}>
                                    Save
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AssetDetailsModal