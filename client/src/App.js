import './App.css';
import  {BrowserRouter, Route, Routes} from 'react-router-dom'
import { AuthContextProvider } from './Context-and-routes/AuthContext';
import { GuestRoute, ProtectedRoute } from './Context-and-routes/Routes';
import RegisterPage from './Pages/RegisterPage';
import LoginPage from './Pages/LoginPage'
import ProfilePage from './Pages/ProfilePage';
import PageNotFound from './Pages/PageNotFound';
import HomePage from './Pages/HomePage';


function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>

            {/* COMMON ROUTES */}
            <Route path="/home" element={<HomePage/>}/>

            {/* GUEST ROUTES */}
            <Route path="/login" element={<GuestRoute> <LoginPage/> </GuestRoute>} />
            <Route path="/register" element={<GuestRoute> <RegisterPage/> </GuestRoute>}/>


            {/* PROTECTED ROUTES */}
            <Route path="/profile" element={<ProtectedRoute> <ProfilePage/> </ProtectedRoute>}/>

            <Route path="*" element={<PageNotFound/>} />
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
