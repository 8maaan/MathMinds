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
import PracticeChoice from './Pages/PracticeChoice';
import QuestionForm from './Pages/PracticeQuestionForm';
import ScoreTest from './Pages/ScoreTest';
import LandingPage from './Pages/LandingPage';
import CreateTopic from './Pages/CreateTopic';
import LessonsPage from './Pages/LessonsPage';
import PracticePage from './Pages/PracticePage';
import TopicsPage from './Pages/TopicsPage'
import EditTopic from './Pages/EditTopic';
import ProfileLesson from './Pages/ProfileLesson';
import CreatePractice from './Pages/CreatePractice';
function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>

            {/* COMMON ROUTES */}

            {/* GUEST ROUTES */}
            <Route path="/" element={<GuestRoute> <LandingPage/> </GuestRoute>} />
            <Route path="/login" element={<GuestRoute> <LoginPage/> </GuestRoute>} />
            <Route path="/register" element={<GuestRoute> <RegisterPage/> </GuestRoute>}/>
            <Route path="/questionForm/:topicId" element={<QuestionForm />} />

            <Route path="/create-topic" element={<CreateTopic/>} />
            <Route path="/lesson/:lessonId/:topicId" element={<TopicsPage/>} />
            <Route path="/edit-topic/:topicId" element={<EditTopic />} />
            <Route path="/profilelesson" element={<ProfileLesson />} />
            <Route path="/createPractice" element={<CreatePractice />} />
            


            {/* PROTECTED ROUTES */}
            <Route path="/profile" element={<ProtectedRoute> <ProfilePage/> </ProtectedRoute>}/>
            <Route path="/home" element={<ProtectedRoute> <HomePage/> </ProtectedRoute>}/>
            <Route path="/lessons" element={<ProtectedRoute> <LessonsPage/> </ProtectedRoute>}/>
            <Route path="/practice-event/:lessonId/:topicId" element={<PracticeEvent />} />
            <Route path="/practice" element={<ProtectedRoute> <PracticePage/> </ProtectedRoute>}/>
            <Route path="/topiccard" element={<ProtectedRoute> <TopicCard/> </ProtectedRoute>}/>
            <Route path="/choice" element={<ProtectedRoute> <PracticeChoice/> </ProtectedRoute>}/>
            <Route path="/scoreTest" element={<ProtectedRoute> <ScoreTest/> </ProtectedRoute>}/>


            {/* 404 */}

            <Route path="*" element={<PageNotFound/>} />
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
