import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Asset } from '../store/assetsSlice';
import { useSelector } from 'react-redux';
import { isCreationModalOpenSelector } from '../store/AppSlice';


type CreateAssetModalProps = {
  onClose: () => void;
  onCreateAsset: (asset: Asset) => void;
};

type CreateAssetFormValues = {
  name: string;
  type: string;
  status: string;
  lat: number;
  lng: number;
  installed_at: string;
  last_inspected_at: string;
  notes: string;
};

const DEFAULT_INSTALLED_AT = '2023-01-15';
const DEFAULT_LAST_INSPECTED_AT = '2024-05-20';

const DEFAULT_VALUES: CreateAssetFormValues = {
  name: '',
  type: '',
  status: 'ok',
  lat: 0,
  lng: 0,
  installed_at: DEFAULT_INSTALLED_AT,
  last_inspected_at: DEFAULT_LAST_INSPECTED_AT,
  notes: '',
};

function generateAssetId() {
  return crypto.randomUUID();
}

const CreateAssetModal = ({
  onClose,
  onCreateAsset,
}: CreateAssetModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<CreateAssetFormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  const isOpen = useSelector(isCreationModalOpenSelector)

  useEffect(() => {
    if (!isOpen) return;
    reset(DEFAULT_VALUES);
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isDirty) {
      const shouldClose = window.confirm(
        'Discard the new asset draft?'
      );
      if (!shouldClose) return;
    }

    reset(DEFAULT_VALUES);
    onClose();
  };

  const onSubmit = (values: CreateAssetFormValues) => {
    const newAsset: Asset = {
      id: generateAssetId(),
      name: values.name.trim(),
      type: values.type.trim(),
      status: values.status,
      lat: Number(values.lat),
      lng: Number(values.lng),
      installed_at: values.installed_at,
      last_inspected_at: values.last_inspected_at || null,
      notes: values.notes.trim() || null,
    };

    onCreateAsset(newAsset);
    reset(DEFAULT_VALUES);
    onClose();
  };

  return (
    <div
      onClick={handleClose}
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
            <h2 style={{ margin: 0 }}>Create asset</h2>
            <div style={{ color: '#6b7280', marginTop: 4 }}>
              Dates are preset for this exercise
            </div>
          </div>

          <button type="button" onClick={handleClose}>
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
                {...register('name', {
                  required: 'Name is required',
                  validate: (value) =>
                    value.trim().length > 0 || 'Name is required',
                })}
              />
              {errors.name && (
                <span style={{ color: 'crimson', fontSize: 12 }}>
                  {errors.name.message}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label htmlFor="type">Type</label>
              <input
                id="type"
                {...register('type', {
                  required: 'Type is required',
                  validate: (value) =>
                    value.trim().length > 0 || 'Type is required',
                })}
              />
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
                {...register('status', {
                  required: 'Status is required',
                })}
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
                type="date"
                disabled
                {...register('installed_at')}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label htmlFor="lat">Latitude</label>
              <input
                id="lat"
                type="number"
                step="any"
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
                type="date"
                disabled
                {...register('last_inspected_at')}
              />
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
              <textarea id="notes" rows={4} {...register('notes')} />
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
            <button type="button" onClick={handleClose}>
              Cancel
            </button>

            <button
              type="button"
              onClick={() => reset(DEFAULT_VALUES)}
              disabled={!isDirty || isSubmitting}
            >
              Reset
            </button>

            <button type="submit" disabled={isSubmitting}>
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAssetModal