import { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import UserContext from '../contexts/UserContext'

function UserSignIn() {
  const { signIn } = useContext(UserContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      await signIn(formData.get('emailAddress'), formData.get('password'))
      navigate(location.state?.from?.pathname || '/')
    } catch (signInError) {
      setError(signInError.message || 'Unable to sign in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main>
      <div className="form--centered">
        <h2>Sign In</h2>

        {error && (
          <div className="validation--errors" role="alert">
            <h3>Unable to Sign In</h3>
            <ul>
              <li>{error}</li>
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="emailAddress">Email Address</label>
          <input
            id="emailAddress"
            name="emailAddress"
            type="email"
            autoComplete="username"
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
          <button className="button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
          <Link className="button button-secondary" to="/">
            Cancel
          </Link>
        </form>

        <p>
          Don&apos;t have a user account? Click here to{' '}
          <Link to="/sign-up">sign up</Link>!
        </p>
      </div>
    </main>
  )
}

export default UserSignIn
