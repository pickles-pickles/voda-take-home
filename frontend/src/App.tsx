
import './App.css'
import AssetDetailsModal from './components/AssetDetailsModal'
import Assets from './components/Assets'
import Filters from './components/Filters'
import Map from './components/Map'
import { createAssetThunk, selectedAssetSelector, updateAssetThunk, type Asset, type CreateAssetPayload } from './store/assetsSlice'
import { setIsCreationModalOpen, setIsModalOpen } from './store/AppSlice'
import { useDispatch, useSelector } from 'react-redux'
import CreateAssetButton from './components/CreateAssetButton'
import CreateAssetModal from './components/CreateAssetModal'
import type { AppDispatch, } from './store/store'
import { useSearchParams } from 'react-router-dom'

function App() {
  const dispatch = useDispatch<AppDispatch>()

  const [searchParams] = useSearchParams();
  const oldAsset = useSelector(selectedAssetSelector
  );

  //better to move it in the modal component, but I 'd rather spend my energy in other priorities
  const handleSubmitAsset = async (updatedAsset: Asset) => {
    const { id, ...payloadWithoutId } = updatedAsset;

    // old item from store (unfiltered or filtered—either way it must include this item)


    if (!oldAsset) {
      // If you can't find it, just proceed.
      await dispatch(updateAssetThunk({ id, payload: payloadWithoutId as CreateAssetPayload })).unwrap();
      dispatch(setIsModalOpen(false));
      return;
    }

    const keysToCheck = Object.keys(payloadWithoutId) as (keyof typeof payloadWithoutId)[];

    const warnings: string[] = [];
    for (const key of keysToCheck) {
      const urlValue = searchParams.get(String(key));
      if (!urlValue) continue;

      const oldValue = (oldAsset as Asset)[key];
      const newValue = (updatedAsset as Asset)[key];

      // If the item currently matches the URL filter value on this key,
      // but will no longer match after update => it will disappear.
      if (String(oldValue) === urlValue && String(newValue) !== urlValue) {
        warnings.push(`Updating ${String(key)} from "${urlValue}" will contradict with the url filters.`);
      }
    }

    if (warnings.length) {
      const ok = window.confirm(warnings.join("\n"));
      if (!ok) return;
    }

    await dispatch(updateAssetThunk({ id, payload: payloadWithoutId as CreateAssetPayload })).unwrap();
    dispatch(setIsModalOpen(false));
  };


  const handleCreateAsset = async (payload: CreateAssetPayload) => {
    try {
      await dispatch(createAssetThunk(payload)).unwrap();
      dispatch(setIsCreationModalOpen(false));
    } catch {
      // leave open
    }
  };
  return (
    <>
      <main className='container-fluid pd-3'>
        <div className='row'>
          <div>
            <Filters />
          </div>
        </div>
        <div className="row py-5 px-3">
          <CreateAssetButton />
        </div>
        <div className='row'>
          <div className='col-5'> <Assets /></div>
          <div className='col-7'><Map /></div>
        </div>
        <AssetDetailsModal

          onClose={() => dispatch(setIsModalOpen(false))}
          onSubmitAsset={handleSubmitAsset}
        />
        <CreateAssetModal
          onClose={() => dispatch(setIsCreationModalOpen(false))}
          onCreateAsset={handleCreateAsset}
        />
      </main>
    </>
  )
}

export default App
