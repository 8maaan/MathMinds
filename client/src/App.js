import './App.css';
import LoginPage from './Pages/LoginPage'
import  {BrowserRouter, Route, Routes} from 'react-router-dom'
import RegisterPage from './Pages/RegisterPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
