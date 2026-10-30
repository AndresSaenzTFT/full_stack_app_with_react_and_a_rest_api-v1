import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Courses() {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadCourses() {
      try {
        const response = await fetch('http://localhost:5000/api/courses')

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        const data = await response.json()
        setCourses(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadCourses()
  }, [])

  if (isLoading) {
    return <main className="wrap"><p>Loading courses...</p></main>
  }

  if (error) {
    return <main className="wrap"><p>Could not load courses: {error}</p></main>
  }

  return (
    <main>
      <div className="wrap main--grid">
        {courses.map((course) => (
          <Link
            className="course--module course--link"
            to={`/courses/${course.id}`}
            key={course.id}
          >
            <h2 className="course--label">Course</h2>
            <h3 className="course--title">{course.title}</h3>
          </Link>
        ))}

        <Link
          className="course--module course--add--module"
          to="/courses/create"
        >
          <span className="course--add--title">
            <svg
              viewBox="0 0 13 13"
              className="add"
              aria-hidden="true"
            >
              <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6" />
            </svg>
            New Course
          </span>
        </Link>
      </div>
    </main>
  )
}

export default Courses