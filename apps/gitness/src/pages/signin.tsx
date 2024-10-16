import React from 'react'
import { SignInPage, DataProps } from '@harnessio/playground'
import { useOnLoginMutation } from '@harnessio/code-service-client'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../framework/context/AppContext'

export const SignIn: React.FC = () => {
  const { setIsUserAuthorized } = useAppContext()
  const navigate = useNavigate()
  const { mutate: login, isLoading } = useOnLoginMutation(
    { queryParams: { include_cookie: true } },
    {
      onSuccess: () => {
        setIsUserAuthorized(true)
        navigate('/') // Redirect to Home page
      }
    }
  )

  return (
    <SignInPage
      isLoading={isLoading}
      handleSignIn={(data: DataProps) => {
        login({
          body: {
            login_identifier: data.email,
            password: data.password
          }
        })
      }}
    />
  )
}
