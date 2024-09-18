import React, { createContext, useContext, useState, ReactNode } from 'react'
import {
  CodeServiceAPIClient,
  MembershipSpacesOkResponse,
  TypesMembershipSpace,
  membershipSpaces,
  TypesSpace
} from '@harnessio/code-service-client'

interface AppContextType {
  spaces: TypesMembershipSpace[]
  setSpaces: (spaces: TypesMembershipSpace[]) => void
  addSpace: (newSpaces: TypesSpace[]) => void
}
//refactor the code to use the context api because of the error message from vite:
//Could not Fast Refresh ("useAppContext" export is incompatible)
//Vite's fast refresh mechanism cannot handle the way useAppContext is exported

const BASE_URL_PREFIX = '/api/v1'

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [spaces, setSpaces] = useState<TypesMembershipSpace[]>([])

  React.useEffect(() => {
    new CodeServiceAPIClient({
      urlInterceptor: (url: string) => `${BASE_URL_PREFIX}${url}`,
      requestInterceptor: (request: Request): Request => {
        // Retrieve the token from storage and add to headers if available
        const token = localStorage.getItem('token')
        if (token) {
          const newRequest = request.clone()
          newRequest.headers.set('Authorization', `Bearer ${token}`)
          return newRequest
        }
        return request
      },
      responseInterceptor: (response: Response) => {
        switch (response.status) {
          case 401:
            localStorage.removeItem('token')
            window.location.href = '/signin'
        }
        return response
      }
    })
    membershipSpaces({
      queryParams: { page: 1, limit: 10, sort: 'identifier', order: 'asc' }
    }).then((response: MembershipSpacesOkResponse) => {
      // @ts-expect-error remove "@ts-expect-error" once type issue for "content" is resolved
      const spacesList: TypesMembershipSpace[] = response?.content
      setSpaces(spacesList)
    })
  }, [])

  const addSpace = (newSpaces: TypesSpace[]) => {
    setSpaces(prevSpaces => [
      ...prevSpaces, // Keep the previous spaces
      ...newSpaces // Add new spaces to the array
    ])
  }

  return <AppContext.Provider value={{ spaces, setSpaces, addSpace }}>{children}</AppContext.Provider>
}

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
