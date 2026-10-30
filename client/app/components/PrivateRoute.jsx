import { useContext } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import UserContext from '../contexts/UserContext'

function PrivateRoute() {
  const { authUser } = useContext(UserContext)
  const location = useLocation()

  return authUser
    ? <Outlet />
    : <Navigate to="/sign-in" state={{ from: location }} replace />
}

export default PrivateRoute
