import { Route, Routes } from 'react-router-dom'
import Header from '../components/Header'
import Courses from '../components/Courses'
import CourseDetail from '../components/CourseDetail'
import CreateCourse from '../components/CreateCourse'
import UserSignIn from '../components/UserSignIn'
import UserSignUp from '../components/UserSignUp'
import UpdateCourse from '../components/UpdateCourse'
import PrivateRoute from '../components/PrivateRoute'

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Courses />} />
        <Route element={<PrivateRoute />}>
          <Route path="/courses/create" element={<CreateCourse />} />
          <Route path="/courses/:id/update" element={<UpdateCourse />} />
        </Route>
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/sign-in" element={<UserSignIn />} />
        <Route path="/sign-up" element={<UserSignUp />} />
      </Routes>
    </div>
  )
}

export default App
