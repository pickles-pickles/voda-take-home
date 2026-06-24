
import './App.css'
import AssetDetailsModal from './components/AssetDetailsModal'
import Assets from './components/Assets'
import Filters from './components/Filters'
import Map from './components/Map'
import { createAssetThunk, type Asset, type CreateAssetPayload } from './store/assetsSlice'
import { setIsCreationModalOpen, setIsModalOpen } from './store/AppSlice'
import { useDispatch } from 'react-redux'
import CreateAssetButton from './components/CreateAssetButton'
import CreateAssetModal from './components/CreateAssetModal'
import type { AppDispatch } from './store/store'

function App() {
  const dispatch = useDispatch<AppDispatch>()

  const handleSubmitAsset = (updatedAsset: Asset) => {
    //dispatch(updateAsset(updatedAsset)); // or thunk / mutation
    console.log({ updatedAsset });

    dispatch(setIsModalOpen(false)); // optional: close after save
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
