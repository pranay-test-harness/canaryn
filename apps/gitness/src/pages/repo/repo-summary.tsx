import { useMemo, useState } from 'react'
import { Button, ButtonGroup, Icon, ListActions, SearchBox, Spacer, StackedList, Text } from '@harnessio/canary'
import {
  Floating1ColumnLayout,
  FullWidth2ColumnLayout,
  RepoSummaryPanel,
  BranchSelector,
  SkeletonList,
  NoSearchResults,
  Summary,
  NoData,
  MarkdownViewer
} from '@harnessio/playground'
import {
  useListBranchesQuery,
  useSummaryQuery,
  TypesRepositorySummary,
  useGetContentQuery,
  useFindRepositoryQuery
} from '@harnessio/code-service-client'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { decodeGitContent, getTrimmedSha, normalizeGitRef } from '../../utils/git-utils'
import { timeAgo } from '../pipeline-edit/utils/time-utils'

export const RepoSummary: React.FC = () => {
  const [loadState] = useState('data-loaded')
  const repoRef = useGetRepoRef()

  const { data: repository } = useFindRepositoryQuery({ repo_ref: repoRef })
  // @ts-expect-error remove "@ts-expect-error" once type issue for "content" is resolved
  const defaultBranch = repository?.content?.default_branch

  const { data: branches } = useListBranchesQuery({
    repo_ref: repoRef,
    queryParams: { include_commit: false, sort: 'date', order: 'asc', limit: 20, page: 1, query: '' }
  })

  // @ts-expect-error remove "@ts-expect-error" once type issue for "content" is resolved
  const branchList = branches?.content?.map(item => ({
    name: item?.name
  }))

  const { data: repoSummary } = useSummaryQuery({
    repo_ref: repoRef,
    queryParams: { include_commit: false, sort: 'date', order: 'asc', limit: 20, page: 1, query: '' }
  })

  const { branch_count, default_branch_commit_count, pull_req_summary, tag_count } =
    // @ts-expect-error remove "@ts-expect-error" once type issue for "content" is resolved
    (repoSummary?.content || {}) as TypesRepositorySummary

  const { data: readmeContent } = useGetContentQuery({
    path: 'README.md',
    repo_ref: repoRef,
    queryParams: { include_commit: false, git_ref: normalizeGitRef(defaultBranch) }
  })

  // @ts-expect-error remove "@ts-expect-error" once type issue for "content" is resolved
  const readmeContentRaw = readmeContent?.content?.content?.data

  const decodedReadmeContent = useMemo(() => {
    return decodeGitContent(readmeContentRaw)
  }, [readmeContent])

  const { data: repoHeaderContent } = useGetContentQuery({
    path: '',
    repo_ref: repoRef,
    queryParams: { include_commit: true, git_ref: normalizeGitRef(defaultBranch) }
  })

  const renderListContent = () => {
    // @ts-expect-error remove "@ts-expect-error" once type issue for "content" is resolved
    const { author, message, sha } = repoHeaderContent?.content?.latest_commit || {}
    switch (loadState) {
      case 'data-loaded':
        return (
          <Summary
            latestFile={{
              user: {
                name: author?.identity?.name || ''
              },
              lastCommitMessage: message || '',
              timestamp: author?.when && timeAgo(author.when),
              sha: sha && getTrimmedSha(sha)
            }}
            files={[
              {
                id: '0',
                name: 'public',
                type: 0,
                user: {
                  name: 'Ted Richardson',
                  avatarUrl: '../images/user-avatar.svg'
                },
                lastCommitMessage: 'Updated public assets and added new favicon for branding',
                timestamp: '1 hour ago',
                sha: '12cbg67a'
              },
              {
                id: '1',
                name: 'files',
                type: 0,
                user: {
                  name: 'Alice Johnson',
                  avatarUrl: '../images/alice-avatar.svg'
                },
                lastCommitMessage: 'Organized static files and optimized images for faster load times',
                timestamp: '5 hours ago',
                sha: '98fgh23d'
              }
            ]}
          />
        )
      case 'loading':
        return <SkeletonList />
      case 'no-search-matches':
        return (
          <NoSearchResults
            iconName="no-search-magnifying-glass"
            title="No search results"
            description={['Check your spelling and filter options,', 'or search for a different keyword.']}
            primaryButton={{ label: 'Clear search' }}
            secondaryButton={{ label: 'Clear filters' }}
          />
        )
      default:
        return null
    }
  }

  if (loadState == 'no-data') {
    return (
      <>
        <NoData
          insideTabView
          iconName="no-data-folder"
          title="No files yet"
          description={['There are no files in this repository yet.', 'Create new or import an existing file.']}
          primaryButton={{ label: 'Create file' }}
          secondaryButton={{ label: 'Import file' }}
        />
      </>
    )
  }
  return (
    <Floating1ColumnLayout>
      <FullWidth2ColumnLayout
        leftColumn={
          <>
            <Spacer size={6} />
            <ListActions.Root>
              <ListActions.Left>
                <ButtonGroup.Root>
                  <BranchSelector name={defaultBranch} branchList={branchList} />
                  <SearchBox.Root placeholder="Search" />
                </ButtonGroup.Root>
              </ListActions.Left>
              <ListActions.Right>
                <ButtonGroup.Root>
                  <Button variant="outline">
                    Add file&nbsp;&nbsp;
                    <Icon name="chevron-down" size={11} className="chevron-down" />
                  </Button>
                  <Button variant="default">Clone repository</Button>
                </ButtonGroup.Root>
              </ListActions.Right>
            </ListActions.Root>
            <Spacer size={5} />
            {renderListContent()}
            <Spacer size={12} />
            <StackedList.Root>
              <StackedList.Item isHeader disableHover>
                <StackedList.Field title={<Text color="tertiaryBackground">README.md</Text>} />
              </StackedList.Item>
              <StackedList.Item disableHover>
                <MarkdownViewer source={decodedReadmeContent || ''} />
              </StackedList.Item>
            </StackedList.Root>
          </>
        }
        rightColumn={
          <RepoSummaryPanel
            title="Summary"
            details={[
              {
                id: '0',
                name: 'Commits',
                count: default_branch_commit_count || 0,
                iconName: 'tube-sign'
              },
              {
                id: '1',
                name: 'Branches',
                count: branch_count || 0,
                iconName: 'branch'
              },
              {
                id: '2',
                name: 'Tags',
                count: tag_count || 0,
                iconName: 'tag'
              },
              {
                id: '3',
                name: 'Open pull requests',
                count: pull_req_summary?.open_count || 0,
                iconName: 'open-pr'
              }
            ]}
          />
        }
      />
    </Floating1ColumnLayout>
  )
}
