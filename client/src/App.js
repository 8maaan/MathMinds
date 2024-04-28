import './App.css';
import  {BrowserRouter, Route, Routes} from 'react-router-dom'
import { AuthContextProvider } from './Context-and-routes/AuthContext';
import { GuestRoute, ProtectedRoute } from './Context-and-routes/Routes';
import RegisterPage from './Pages/RegisterPage';
import LoginPage from './Pages/LoginPage'
import ProfilePage from './Pages/ProfilePage';
import PageNotFound from './Pages/PageNotFound';
import HomePage from './Pages/HomePage';
import PracticeEvent from './Pages/practiceEvent';
import TopicCard from './Pages/TopicCard';
import ScoreDisplay from './Pages/ScoreDisplay';

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>

            {/* COMMON ROUTES */}

            {/* GUEST ROUTES */}
            <Route path="/login" element={<GuestRoute> <LoginPage/> </GuestRoute>} />
            <Route path="/register" element={<GuestRoute> <RegisterPage/> </GuestRoute>}/>
            


            {/* PROTECTED ROUTES */}
            <Route path="/profile" element={<ProtectedRoute> <ProfilePage/> </ProtectedRoute>}/>
            <Route path="/home" element={<ProtectedRoute> <HomePage/> </ProtectedRoute>}/>
            <Route path="/practiceEvent" element={<ProtectedRoute> <PracticeEvent/> </ProtectedRoute>}/>
            <Route path="/topiccard" element={<ProtectedRoute> <TopicCard/> </ProtectedRoute>}/>
            <Route path="/scoreDisplay" element={<ProtectedRoute> <ScoreDisplay/> </ProtectedRoute>}/>


            {/* 404 */}

            <Route path="*" element={<PageNotFound/>} />
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
