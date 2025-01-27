import { useAuth0 } from '@auth0/auth0-react'

export const AuthButtons = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0()

  return (
    <div>
      {!isAuthenticated ? (
        <button className = "auth-button" onClick={() => loginWithRedirect()}>Log In</button>
      ) : (
        <button
          onClick={() =>
            logout({ logoutParams: { returnTo: import.meta.env.VITE_AUTH0_REDIRECT_URI } })
          }
        >
          Log Out
        </button>
      )}
    </div>
  )
}