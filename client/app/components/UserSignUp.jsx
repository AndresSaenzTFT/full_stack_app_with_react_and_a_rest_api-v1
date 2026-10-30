import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import UserContext from '../contexts/UserContext'
import ValidationErrors from './ValidationErrors'

function UserSignUp() {
  const { signIn } = useContext(UserContext)
  const navigate = useNavigate()
  const [errors, setErrors] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErrors([])
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const password = formData.get('password')
    const user = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      emailAddress: formData.get('emailAddress'),
      password,
      confirmedPassword: formData.get('confirmedPassword'),
    }

    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })

      if (response.status === 400) {
        const result = await response.json()
        setErrors(
          Array.isArray(result.errors)
            ? result.errors
            : [result.message || 'The account details are invalid.'],
        )
        return
      }

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
      }

      await signIn(user.emailAddress, password)
      navigate('/')
    } catch (error) {
      setErrors([error.message || 'Unable to create the account.'])
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main>
      <div className="form--centered">
        <h2>Sign Up</h2>

        <ValidationErrors errors={errors} />

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="firstName">First Name</label>
          <input id="firstName" name="firstName" type="text" required />

          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" name="lastName" type="text" required />

          <label htmlFor="emailAddress">Email Address</label>
          <input
            id="emailAddress"
            name="emailAddress"
            type="email"
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={20}
            required
          />

          <label htmlFor="confirmedPassword">Confirm Password</label>
          <input
            id="confirmedPassword"
            name="confirmedPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={20}
            required
          />

          <button className="button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </button>
          <Link className="button button-secondary" to="/">
            Cancel
          </Link>
        </form>

        <p>
          Already have a user account? Click here to{' '}
          <Link to="/sign-in">sign in</Link>!
        </p>
      </div>
    </main>
  )
}

export default UserSignUp
