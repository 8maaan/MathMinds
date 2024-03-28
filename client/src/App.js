import './App.css';
import  {BrowserRouter, Route, Routes} from 'react-router-dom'
import { AuthContextProvider } from './Context-and-routes/AuthContext';
import RegisterPage from './Pages/RegisterPage';
import LoginPage from './Pages/LoginPage'
import HomePage from './Pages/HomePage';
import { GuestRoute, ProtectedRoute } from './Context-and-routes/Routes';

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>

            <Route path="/login" element={<GuestRoute> <LoginPage/> </GuestRoute>} />
            <Route path="/register" element={<GuestRoute> <RegisterPage/> </GuestRoute>}/>
            
            <Route path="/home" element={<ProtectedRoute> <HomePage/> </ProtectedRoute>}/>
            
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
