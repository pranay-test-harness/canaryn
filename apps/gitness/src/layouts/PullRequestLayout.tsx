import React, { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Badge, Icon, Spacer, Tabs, TabsList, TabsTrigger } from '@harnessio/canary'
import { Floating1ColumnLayout, PullRequestHeader } from '@harnessio/playground'
import { TypesPullReq, useGetPullReqQuery } from '@harnessio/code-service-client'

const PullRequestLayout: React.FC = () => {
  const [pullRequest, setPullRequest] = useState<TypesPullReq>()

  const { data: pullRequestData, isFetching } = useGetPullReqQuery({
    repo_ref: 'workspace/repo/+',
    pullreq_number: 1
  })

  useEffect(() => {
    if (!isFetching && pullRequestData) {
      // @ts-expect-error remove "@ts-expect-error" once type issue for "content" is resolved
      setPullRequest(pullRequestData.content)
    }
  }, [pullRequestData, isFetching])

  return (
    <>
      <Floating1ColumnLayout>
        <Spacer size={8} />
        {
          // @ts-expect-error, remove "@ts-expect-error" once code api's dont pass all fields as optional
          pullRequest && <PullRequestHeader data={pullRequest} />
        }
        <Tabs variant="tabnav" defaultValue="conversation">
          <TabsList>
            <NavLink to={`conversation`}>
              <TabsTrigger value="conversation">
                <Icon size={16} name="comments" />
                Conversation
                <Badge variant="outline" size="xs">
                  1
                </Badge>
              </TabsTrigger>
            </NavLink>
            <NavLink to={`commits`}>
              <TabsTrigger value="commits">
                <Icon size={16} name="tube-sign" />
                Commits
                <Badge variant="outline" size="xs">
                  2
                </Badge>
              </TabsTrigger>
            </NavLink>
            <NavLink to={`changes`}>
              <TabsTrigger value="pull-requests">
                <Icon size={14} name="changes" />
                Changes
                <Badge variant="outline" size="xs">
                  2
                </Badge>
              </TabsTrigger>
            </NavLink>
            <NavLink to={`checks`}>
              <TabsTrigger value="checks">
                <Icon size={14} name="checks" />
                Checks
                <Badge variant="outline" size="xs">
                  9
                </Badge>
              </TabsTrigger>
            </NavLink>
          </TabsList>
        </Tabs>
        <Spacer size={8} />
        <Outlet />
      </Floating1ColumnLayout>
    </>
  )
}

export default PullRequestLayout