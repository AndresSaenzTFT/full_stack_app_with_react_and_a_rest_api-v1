import { useContext, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link, useNavigate, useParams } from 'react-router-dom'
import UserContext from '../contexts/UserContext'

function CourseDetail() {
  const { id } = useParams()//from the path we retrieve the id 
  const { authUser, authorizationHeader } = useContext(UserContext)
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function loadCourse() {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        setCourse(await response.json())
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadCourse()

    return () => controller.abort()
  }, [id])

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to permanently delete this course?')) {
      return
    }

    setError('')
    setIsDeleting(true)

    try {
      const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: authorizationHeader,
        },
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.message || `Request failed: ${response.status}`)
      }

      navigate('/')
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete the course.')
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return <main className="wrap"><p>Loading course...</p></main>
  }

  if (error) {
    return <main className="wrap"><p>Could not load course: {error}</p></main>
  }

  if (!course) {
    return <main className="wrap"><p>Course not found.</p><Link to="/">Return to List</Link></main>
  }

  const author = course.User
    ? `${course.User.firstName} ${course.User.lastName}`
    : 'Unknown'

  return (
    <main>
      <div className="actions--bar">
        <div className="wrap">
          {authUser?.id === course.userId && (
            <>
              <Link className="button" to={`/courses/${id}/update`}>
                Update Course
              </Link>
              <button
                className="button"
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting Course...' : 'Delete Course'}
              </button>
            </>
          )}
          <Link className="button button-secondary" to="/">Return to List</Link>
        </div>
      </div>

      <div className="wrap">
        {error && (
          <div className="validation--errors" role="alert">
            <h3>Unable to Delete Course</h3>
            <ul><li>{error}</li></ul>
          </div>
        )}
        <h2>Course Detail</h2>
        <div className="main--flex">
          <div>
            <h3 className="course--detail--title">Course</h3>
            <h4 className="course--name">{course.title}</h4>
            <p>By {author}</p>
            <ReactMarkdown>{course.description || ''}</ReactMarkdown>
          </div>
          <div>
            <h3 className="course--detail--title">Estimated Time</h3>
            <p>{course.estimatedTime || 'Not specified'}</p>

            <h3 className="course--detail--title">Materials Needed</h3>
            <ReactMarkdown
              components={{
                ul: ({ children }) => (
                  <ul className="course--detail--list">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="course--detail--list">{children}</ol>
                ),
              }}
            >
              {course.materialsNeeded || 'Not specified'}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </main>
  )
}

export default CourseDetail
