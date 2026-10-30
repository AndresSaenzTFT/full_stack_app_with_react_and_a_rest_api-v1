import { useState } from 'react'
import UserContext from './UserContext'

function UserProvider({ children }) {
  const [authUser, setAuthUser] = useState(null)
  const [authorizationHeader, setAuthorizationHeader] = useState(null)

  async function signIn(emailAddress, password) {
    const credentials = new TextEncoder().encode(`${emailAddress}:${password}`)
    const encodedCredentials = btoa(String.fromCharCode(...credentials))
    const authorization = `Basic ${encodedCredentials}`

    const response = await fetch('http://localhost:5000/api/users', {
      headers: { Authorization: authorization },
    })

    if (response.status === 401) {
      throw new Error('The email address or password is incorrect.')
    }

    if (!response.ok) {
      throw new Error(`Sign-in failed: ${response.status}`)
    }

    const user = await response.json()
    setAuthUser(user)
    setAuthorizationHeader(authorization)
  }

  function signOut() {
    setAuthUser(null)
    setAuthorizationHeader(null)
  }

  return (
    <UserContext.Provider
      value={{ authUser, authorizationHeader, signIn, signOut }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
