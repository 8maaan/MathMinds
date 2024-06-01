import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { AuthContextProvider } from './Context-and-routes/AuthContext';
import { GuestRoute, ProtectedRoute } from './Context-and-routes/Routes';
import HomePage from './Pages/HomePage';
import LandingPage from './Pages/LandingPage';
import LoginPage from './Pages/LoginPage';
import PageNotFound from './Pages/PageNotFound';
import ProfilePage from './Pages/ProfilePage';
import RegisterPage from './Pages/RegisterPage';
import CreateTopic from './Pages/CreateTopic';
import LessonsPage from './Pages/LessonsPage';
import TeacherLessonsPage from './Pages/TeacherLessonsPage';
import PracticePage from './Pages/PracticePage';
import TopicsPage from './Pages/TopicsPage';
import EditTopic from './Pages/EditTopic';
import CreateLessonQuiz from './Pages/CreateLessonQuiz';
import EditLessonQuiz from './Pages/EditLessonQuiz'; // Import EditLessonQuiz component
import QuizQuestionForm from './Pages/QuizQuestionForm';

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

            {/* PROTECTED ROUTES */}
            <Route path="/profile" element={<ProtectedRoute> <ProfilePage/> </ProtectedRoute>}/>
            <Route path="/home" element={<ProtectedRoute> <HomePage/> </ProtectedRoute>}/>
            <Route path="/lessons" element={<ProtectedRoute> <LessonsPage/> </ProtectedRoute>}/>
            <Route path="/lesson/:lessonId/:topicId" element={<ProtectedRoute><TopicsPage/></ProtectedRoute>} />
            <Route path="/lesson/:lessonId/quiz/:quizId" element={<ProtectedRoute><QuizQuestionForm/></ProtectedRoute>} />
            <Route path="/practice" element={<ProtectedRoute> <PracticePage/> </ProtectedRoute>}/>

            {/* FOR TEACHERS */}
            <Route path="/create-topic" element={<ProtectedRoute requireTeacher><CreateTopic/></ProtectedRoute>} />
            <Route path="/lessons-teacher" element={ <ProtectedRoute requireTeacher><TeacherLessonsPage/></ProtectedRoute> }/>
            <Route path="/edit-topic/:topicId" element={<ProtectedRoute requireTeacher><EditTopic /></ProtectedRoute>} />
            <Route path="/create-lesson-quiz" element={<ProtectedRoute requireTeacher><CreateLessonQuiz /></ProtectedRoute>} />
            <Route path="/edit-lesson-quiz/:lessonQuizId" element={<ProtectedRoute requireTeacher><EditLessonQuiz /></ProtectedRoute>} /> {/* Add this line */}
            
            <Route path="*" element={<PageNotFound/>} />
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
