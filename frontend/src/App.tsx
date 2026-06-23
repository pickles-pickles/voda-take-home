
import './App.css'
import Assets from './components/Assets'
import Filters from './components/Filters'
import Map from './components/Map'

function App() {


  return (
    <>
      <main className='container'>
        <div className='row'>
          <div>
            <Filters />
          </div>
        </div>
        <div className='row'>
          <div className='col-6'> <Assets /></div>
          <div className='col-6'><Map /></div>
        </div>
      </main>
    </>
  )
}

export default App
