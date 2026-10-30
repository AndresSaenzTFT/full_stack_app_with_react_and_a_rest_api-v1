import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import UserContext from '../contexts/UserContext'
import ValidationErrors from './ValidationErrors'

function UpdateCourse() {
  const { id } = useParams()
  const { authUser, authorizationHeader } = useContext(UserContext)
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState([])

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

        const data = await response.json()
        if (!data) {
          setErrors(['Course not found.'])
        } else {
          setCourse(data)
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          setErrors([error.message || 'Unable to load course.'])
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

  async function handleSubmit(event) {
    event.preventDefault()
    setErrors([])
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const updatedCourse = {
      title: formData.get('title'),
      description: formData.get('description'),
      estimatedTime: formData.get('estimatedTime').trim(),
      materialsNeeded: formData.get('materialsNeeded').trim(),
    }

    try {
      const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorizationHeader,
        },
        body: JSON.stringify(updatedCourse),
      })

      if (response.status === 400) {
        const result = await response.json()
        setErrors(
          Array.isArray(result.errors)
            ? result.errors
            : [result.message || 'The course data is invalid.'],
        )
        return
      }

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
      }

      navigate(`/courses/${id}`)
    } catch (error) {
      setErrors([error.message || 'Unable to update the course.'])
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <main className="wrap"><p>Loading course...</p></main>
  }

  if (!course) {
    return (
      <main className="wrap">
        <p>{errors[0] || 'Course not found.'}</p>
        <Link to="/">Return to List</Link>
      </main>
    )
  }

  if (course.userId !== authUser.id) {
    return (
      <main className="wrap">
        <p>You are not authorized to update this course.</p>
        <Link to={`/courses/${id}`}>Return to Course</Link>
      </main>
    )
  }

  const author = course.User
    ? `${course.User.firstName} ${course.User.lastName}`
    : 'Unknown'

  return (
    <main>
      <div className="wrap">
        <h2>Update Course</h2>

        <ValidationErrors errors={errors} />

        <form onSubmit={handleSubmit} noValidate>
          <div className="main--flex">
            <div>
              <label htmlFor="courseTitle">Course Title</label>
              <input
                id="courseTitle"
                name="title"
                type="text"
                defaultValue={course.title}
                required
              />

              <p>By {author}</p>

              <label htmlFor="courseDescription">Course Description</label>
              <textarea
                id="courseDescription"
                name="description"
                defaultValue={course.description}
                required
              />
            </div>
            <div>
              <label htmlFor="estimatedTime">Estimated Time</label>
              <input
                id="estimatedTime"
                name="estimatedTime"
                type="text"
                defaultValue={course.estimatedTime}
                required
              />

              <label htmlFor="materialsNeeded">Materials Needed</label>
              <textarea
                id="materialsNeeded"
                name="materialsNeeded"
                defaultValue={course.materialsNeeded}
                required
              />
            </div>
          </div>

          <button className="button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating Course...' : 'Update Course'}
          </button>
          <Link className="button button-secondary" to={`/courses/${id}`}>
            Cancel
          </Link>
        </form>
      </div>
    </main>
  )
}

export default UpdateCourse
