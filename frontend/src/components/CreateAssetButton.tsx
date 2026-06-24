

import { useDispatch, } from 'react-redux';
import { setIsCreationModalOpen } from '../store/AppSlice';

const CreateAssetButton = () => {
    const dispatch = useDispatch();


    /*   const handleCreateAsset = (newAsset: Asset) => {
        dispatch(addAsset(newAsset));
      }; */




    return (
        <>
            <button onClick={() => dispatch(setIsCreationModalOpen(true))} className='btn btn-primary'>
                Create asset
            </button>

        </>
    );
}

export default CreateAssetButton