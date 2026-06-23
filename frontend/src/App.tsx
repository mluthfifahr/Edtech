import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/admin/Login';
import ProtectedRoute from './components/ProtectedRoute';
import StudentLayout from './layouts/StudentLayout';
import Welcome from './pages/student/Welcome';
import Home from './pages/student/Home';
import SubjectDetail from './pages/student/SubjectDetail';
import Play from './pages/student/Play';
import Result from './pages/student/Result';
import Subjects from './pages/admin/Subjects';
import Questions from './pages/admin/Questions';
import Scores from './pages/admin/Scores';

function App() {
  return (
    <Router>
      <Routes>
        {/* Root redirect ke Student Welcome */}
        <Route path="/" element={<Navigate to="/student/welcome" replace />} />
        
        {/* Student Welcome Route (Tanpa Navbar) */}
        <Route path="/student/welcome" element={<Welcome />} />
        
        {/* Student Protected Routes */}
        <Route path="/student" element={<StudentLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="subject/:id" element={<SubjectDetail />} />
          <Route path="play/:subjectId" element={<Play />} />
          <Route path="result" element={<Result />} />
        </Route>

        {/* Admin Auth Route */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="questions" element={<Questions />} />
            <Route path="scores" element={<Scores />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
