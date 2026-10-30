import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import UserContext from '../contexts/UserContext'
import ValidationErrors from './ValidationErrors'

function CreateCourse() {
  const { authorizationHeader } = useContext(UserContext)
  const navigate = useNavigate()
  const [errors, setErrors] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErrors([])
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const course = {
      title: formData.get('title'),
      description: formData.get('description'),
      estimatedTime: formData.get('estimatedTime').trim(),
      materialsNeeded: formData.get('materialsNeeded').trim(),
    }

    try {
      const response = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorizationHeader,
        },
        body: JSON.stringify(course),
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

      navigate('/')
    } catch (error) {
      setErrors([error.message || 'Unable to create the course.'])
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main>
      <div className="wrap">
        <h2>Create Course</h2>

        <ValidationErrors errors={errors} />

        <form onSubmit={handleSubmit} noValidate>
          <div className="main--flex">
            <div>
              <label htmlFor="courseTitle">Course Title</label>
              <input id="courseTitle" name="title" type="text" required />

              <label htmlFor="courseDescription">Course Description</label>
              <textarea id="courseDescription" name="description" required />
            </div>

            <div>
              <label htmlFor="estimatedTime">Estimated Time</label>
              <input id="estimatedTime" name="estimatedTime" type="text" required />

              <label htmlFor="materialsNeeded">Materials Needed</label>
              <textarea id="materialsNeeded" name="materialsNeeded" required />
            </div>
          </div>

          <button className="button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Course...' : 'Create Course'}
          </button>
          <Link className="button button-secondary" to="/">Cancel</Link>
        </form>
      </div>
    </main>
  )
}

export default CreateCourse