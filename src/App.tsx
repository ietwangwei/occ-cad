import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Cad from './pages/cad/cad'

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Cad />}></Route>
        </Routes>
      </BrowserRouter>
    </div>      
  )
}

export default App
