
import './App.css'
import AssetDetailsModal from './components/AssetDetailsModal'
import Assets from './components/Assets'
import Filters from './components/Filters'
import Map from './components/Map'
import type { Asset } from './store/assetsSlice'
import { setIsModalOpen } from './store/AppSlice'
import { useDispatch } from 'react-redux'

function App() {
  const dispatch = useDispatch()
  const handleSubmitAsset = (updatedAsset: Asset) => {
    //dispatch(updateAsset(updatedAsset)); // or thunk / mutation
    console.log({ updatedAsset });

    dispatch(setIsModalOpen(false)); // optional: close after save
  };

  return (
    <>
      <main className='container-fluid pd-3'>
        <div className='row'>
          <div>
            <Filters />
          </div>
        </div>
        <div className='row'>
          <div className='col-6'> <Assets /></div>
          <div className='col-6'><Map /></div>
        </div>
        <AssetDetailsModal

          onClose={() => dispatch(setIsModalOpen(false))}
          onSubmitAsset={handleSubmitAsset}
        />
      </main>
    </>
  )
}

export default App
