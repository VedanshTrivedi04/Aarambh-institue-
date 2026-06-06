import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { HomePage } from "./pages/HomePage";
import { CoursesPage } from "./pages/CoursesPage";
import { FacultyPage } from "./pages/FacultyPage";
import { ResultsPage } from "./pages/ResultsPage";
import { AboutPage } from "./pages/AboutPage";
import { LoginPage } from "./pages/LoginPage";

// Admin imports
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminStudents } from "./pages/admin/AdminStudents";
import { AdminTeachers } from "./pages/admin/AdminTeachers";
import { AdminContent } from "./pages/admin/AdminContent";
import { AdminQueries } from "./pages/admin/AdminQueries";
import { AdminAnalytics } from "./pages/admin/AdminAnalytics";

// Teacher imports
import { TeacherLayout } from "./pages/teacher/TeacherLayout";
import { TeacherDashboard } from "./pages/teacher/TeacherDashboard";
import { TeacherNotes } from "./pages/teacher/TeacherNotes";
import { TeacherAnnouncements } from "./pages/teacher/TeacherAnnouncements";
import { TeacherStudents } from "./pages/teacher/TeacherStudents";
import { TeacherChat } from "./pages/teacher/TeacherChat";

// Student imports
import { StudentLayout } from "./pages/student/StudentLayout";
import { StudentDashboard } from "./pages/student/StudentDashboard";
import { StudentNotes } from "./pages/student/StudentNotes";
import { StudentSubjects } from "./pages/student/StudentSubjects";
import { StudentChat } from "./pages/student/StudentChat";
import { StudentPerformance } from "./pages/student/StudentPerformance";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "about", Component: AboutPage },
      { path: "courses", Component: CoursesPage },
      { path: "faculty", Component: FacultyPage },
      { path: "results", Component: ResultsPage },
    ],
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "students", Component: AdminStudents },
      { path: "teachers", Component: AdminTeachers },
      { path: "content", Component: AdminContent },
      { path: "queries", Component: AdminQueries },
      { path: "analytics", Component: AdminAnalytics },
    ],
  },
  {
    path: "/teacher",
    Component: TeacherLayout,
    children: [
      { index: true, Component: TeacherDashboard },
      { path: "notes", Component: TeacherNotes },
      { path: "announcements", Component: TeacherAnnouncements },
      { path: "students", Component: TeacherStudents },
      { path: "chat", Component: TeacherChat },
    ],
  },
  {
    path: "/student",
    Component: StudentLayout,
    children: [
      { index: true, Component: StudentDashboard },
      { path: "notes", Component: StudentNotes },
      { path: "subjects", Component: StudentSubjects },
      { path: "chat", Component: StudentChat },
      { path: "performance", Component: StudentPerformance },
    ],
  },
]);
