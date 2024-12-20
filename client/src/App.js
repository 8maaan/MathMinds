import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import './PagesCSS/Global.css'
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
import TopicsPage from './Pages/TopicsPage'
import EditTopicPage from './Pages/EditTopic';
import CreateLessonQuizPage from './Pages/CreateLessonQuiz';
import EditLessonQuizPage from './Pages/EditLessonQuiz'; 
import QuizQuestionForm from './Pages/QuizQuestionForm';
import EditPracticePage from './Pages/EditPractice';
import CreateQuizPracticePage from './Pages/CreatePractice';
import ProfileLessonPage from './Pages/ProfileLesson';
// import CreatePracticePage from './Pages/CreatePractice';
import TopicCardPage from './Pages/TopicCard';
import PracticeChoicePage from './Pages/PracticeChoice';
import QuestionFormPage from './Pages/PracticeQuestionForm';
import ScoreTestPage from './Pages/ScoreTest';
import PracticeEventPage from './Pages/practiceEvent';
import BadgesPage from './Pages/BadgesPage';
import LessonProgressPage from './Pages/LessonProgressPage';
import PracticeTempLobby from './Pages/PracticeTempLobby';
import PracticeQuestionFormMultiplayer from './Pages/PracticeQuestionFormMultiplayer';

import UserManagementPage from './Pages/UserManagementPage';
import AttributionPage from './Pages/AttributionPage';
import DashboardAnalytics from './Pages/DashboardAnalytics';
import StudentDashboardAnalytics from './Pages/StudentDashboardAnalytics';

function App() {

  return (
    <div className="App">
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>

            {/* COMMON ROUTES */}
            <Route path="*" element={<PageNotFound/>} />
            <Route path="attributions" element={<AttributionPage/>} />
            {/* GUEST ROUTES */}
            <Route path="/" element={<GuestRoute> <LandingPage/> </GuestRoute>} />
            <Route path="/login" element={<GuestRoute> <LoginPage/> </GuestRoute>} />
            <Route path="/register" element={<GuestRoute> <RegisterPage/> </GuestRoute>}/>

            {/* PROTECTED ROUTES */}
       
            <Route path="/profile" element={<ProtectedRoute> <ProfilePage/> </ProtectedRoute>}/>
            <Route path="/home" element={<ProtectedRoute> <HomePage/> </ProtectedRoute>}/>
            <Route path="/lessons" element={<ProtectedRoute> <LessonsPage/> </ProtectedRoute>}/>
            <Route path="/lesson/:lessonId/:topicId" element={<ProtectedRoute><TopicsPage/></ProtectedRoute>} />
            <Route path="/practice" element={<ProtectedRoute> <PracticePage/> </ProtectedRoute>}/>
            <Route path="/questionForm/:topicId" element={<QuestionFormPage />} />
            <Route path="/profilelesson" element={<ProfileLessonPage />} />
            {/* <Route path="/createPractice" element={<CreatePracticePage />} /> */}

            <Route path="/practice-event/:lessonId/:topicId" element={<ProtectedRoute><PracticeEventPage /></ProtectedRoute>} />
            <Route path="/topiccard" element={<ProtectedRoute> <TopicCardPage/> </ProtectedRoute>}/>
            <Route path="/choice" element={<ProtectedRoute> <PracticeChoicePage/> </ProtectedRoute>}/>
            <Route path="/scoreTest" element={<ProtectedRoute> <ScoreTestPage/> </ProtectedRoute>}/>

            <Route path="/lesson/:lessonId/quiz/:quizId" element={<ProtectedRoute><QuizQuestionForm/></ProtectedRoute>} />
            
            <Route path="/badges" element={<ProtectedRoute> <BadgesPage/> </ProtectedRoute>}/>
            <Route path="/lesson-progress" element={<ProtectedRoute> <LessonProgressPage/> </ProtectedRoute>}/>
            <Route path="/studentDashboard" element={<ProtectedRoute> <StudentDashboardAnalytics/> </ProtectedRoute>}/>
            
            <Route path="/lobby/:roomCode" element={<ProtectedRoute><PracticeTempLobby/></ProtectedRoute>}/>
            <Route path="/game/:roomCode" element={<PracticeQuestionFormMultiplayer/>} />

            {/* FOR TEACHERS & ADMIN*/}
            <Route path="/create-topic" element={<ProtectedRoute requireTeacher ><CreateTopic/></ProtectedRoute>} />
            <Route path="/lessons-teacher" element={ <ProtectedRoute requireTeacher ><TeacherLessonsPage/></ProtectedRoute> }/>
            <Route path="/edit-topic/:topicId/:currentTopicTitle" element={<ProtectedRoute requireTeacher ><EditTopicPage /></ProtectedRoute>} />
            <Route path="/create-lesson-quiz" element={<ProtectedRoute requireTeacher ><CreateLessonQuizPage /></ProtectedRoute>} />
            <Route path="/create-practice-quiz" element={<ProtectedRoute requireTeacher><CreateQuizPracticePage /></ProtectedRoute>} />
            <Route path="/edit-lesson-quiz/:lessonQuizId/:currentLessonTitle" element={<ProtectedRoute requireTeacher ><EditLessonQuizPage /></ProtectedRoute>} />
            <Route path="/edit-practice/:topicId/:currentTopicTitle" element={<ProtectedRoute requireTeacher> <EditPracticePage/> </ProtectedRoute>} />
            <Route path="/dashboard-analytics" element={<ProtectedRoute requireTeacher> <DashboardAnalytics/> </ProtectedRoute>} />

            {/*FOR ADMIN ONLY*/}
            <Route path="/manage-accounts" element={<ProtectedRoute requireAdmin><UserManagementPage/></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;