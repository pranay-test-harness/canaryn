import React from 'react'
import { Button, Icon, Text } from '@harnessio/canary'
import { CommentItem, CommentType, MergeStrategy, TypesPullReq, TypesPullReqActivity } from './interfaces'
import PullRequestTimelineItem from './pull-request-timeline-item'

interface SystemCommentProps extends TypesPullReq {
  commentItems: CommentItem<TypesPullReqActivity>[]
  repoMetadataPath?: string
  isLast: boolean
  pullReqMetadata: TypesPullReq
}
const PullRequestSystemComments: React.FC<SystemCommentProps> = ({ commentItems, isLast, pullReqMetadata }) => {
  const payload = commentItems[0].payload
  const type = payload?.type
  const openFromDraft = payload?.payload?.old_draft === true && payload?.payload?.new_draft === false
  const changedToDraft = payload?.payload?.old_draft === false && payload?.payload?.new_draft === true

  switch (type) {
    case CommentType.MERGE:
      return (
        <PullRequestTimelineItem
          key={payload?.id} // Consider using a unique ID if available
          header={[
            {
              avatar: (
                <>
                  <div className='h-6 w-6 rounded-full bg-tertiary-background bg-[url("../images/user-avatar.svg")] bg-cover'></div>
                </>
              ),
              name: payload?.author?.display_name,
              description: (
                <>
                  {payload?.payload?.merge_method === MergeStrategy.REBASE ? (
                    <Text color="tertiaryBackground">
                      rebased changes from branch
                      <Button className="ml-1 mr-1" variant="secondary" size="xs">
                        {pullReqMetadata.source_branch}
                      </Button>
                      onto
                      <Button className="ml-1 mr-1" variant="secondary" size="xs">
                        {pullReqMetadata.target_branch}
                      </Button>
                      , now at {payload?.payload?.merge_sha as string}
                    </Text>
                  ) : (
                    <Text color="tertiaryBackground">
                      merged changes from
                      <Button className="ml-1 mr-1" variant="secondary" size="xs">
                        {pullReqMetadata.source_branch}
                      </Button>
                      into
                      <Button className="ml-1 mr-1" variant="secondary" size="xs">
                        {pullReqMetadata.target_branch}
                      </Button>
                      by commit
                      <Button className="ml-1 mr-1" variant="secondary" size="xs">
                        {(payload?.payload?.merge_sha as string).substring(0, 6)}
                      </Button>
                    </Text>
                  )}
                </>
              )
            }
          ]}
          //Fix icon for this state
          icon={<Icon name="merged" size={14} className="p-0.5 text-tertiary-background" />}
          isLast={isLast}
        />
      )
    case CommentType.REVIEW_SUBMIT:
      return (
        <PullRequestTimelineItem
          hideIconBorder
          key={payload?.id} // Consider using a unique ID if available
          header={[
            {
              avatar: (
                <>
                  <div className='h-6 w-6 rounded-full bg-tertiary-background bg-[url("../images/user-avatar.svg")] bg-cover'></div>
                </>
              ),
              name: payload?.author?.display_name,
              // TODO: fix timeline item to handle commit update as rn it doesnt work
              description:
                payload?.payload?.decision === 'approved'
                  ? 'approved these changes'
                  : 'requested changes to this pull request'
            }
          ]}
          icon={
            payload?.payload?.decision === 'approved' ? (
              <Icon name="success" size={18} />
            ) : (
              <Icon name="triangle-warning" size={18} className="text-destructive" />
            )
          }
          isLast={isLast}
        />
      )
    case CommentType.BRANCH_UPDATE:
      return (
        <PullRequestTimelineItem
          key={payload?.id} // Consider using a unique ID if available
          header={[
            {
              avatar: (
                <>
                  <div className='h-6 w-6 rounded-full bg-tertiary-background bg-[url("../images/user-avatar.svg")] bg-cover'></div>
                </>
              ),
              // TODO: fix timeline item to handle commit update as rn it doesnt work
              name: 'chore: add new text framework',
              // TODO: add modals or popovers to substring stuff
              description: `${(payload?.payload?.new as string)?.substring(0, 6)}`
            }
          ]}
          icon={<Icon name="tube-sign" size={14} />}
          isLast={isLast}
        />
      )
    case CommentType.BRANCH_DELETE:
      return (
        <PullRequestTimelineItem
          key={payload?.id} // Consider using a unique ID if available
          header={[
            {
              avatar: (
                <>
                  <div className='h-6 w-6 rounded-full bg-tertiary-background bg-[url("../images/user-avatar.svg")] bg-cover'></div>
                </>
              ),
              name: payload?.author?.display_name,
              description: (
                <Text color="tertiaryBackground">
                  deleted the
                  <Button className="ml-1 mr-1" variant="secondary" size="xs">
                    {pullReqMetadata?.source_branch}
                  </Button>
                  branch
                </Text>
              )
            }
          ]}
          icon={<Icon name="edit-pen" size={14} className="p-0.5" />}
          isLast={isLast}
        />
      )
    case CommentType.STATE_CHANGE:
      return (
        <PullRequestTimelineItem
          key={payload?.id} // Consider using a unique ID if available
          header={[
            {
              avatar: (
                <>
                  <div className='h-6 w-6 rounded-full bg-tertiary-background bg-[url("../images/user-avatar.svg")] bg-cover'></div>
                </>
              ),
              name: payload?.author?.display_name,
              description: (
                <>
                  {openFromDraft || changedToDraft ? (
                    <Text color="tertiaryBackground">
                      {changedToDraft ? 'marked pull request as draft' : 'opened pull request for review'}
                    </Text>
                  ) : (
                    <Text color="tertiaryBackground">{`changed pull request state from ${payload?.payload?.old} to ${payload?.payload?.new}`}</Text>
                  )}
                </>
              )
            }
          ]}
          icon={<Icon name="unmerged" className="p-0.5" />}
          isLast={isLast}
        />
      )
    case CommentType.TITLE_CHANGE:
      return (
        <PullRequestTimelineItem
          key={payload?.id} // Consider using a unique ID if available
          header={[
            {
              avatar: (
                <>
                  <div className='h-6 w-6 rounded-full bg-tertiary-background bg-[url("../images/user-avatar.svg")] bg-cover'></div>
                </>
              ),
              name: payload?.author?.display_name,
              description: (
                <Text color="tertiaryBackground">
                  changed title from <span className="line-through">{payload?.payload?.old as string}</span> to{' '}
                  {payload?.payload?.new as string}
                </Text>
              )
            }
          ]}
          icon={<Icon name="edit-pen" size={14} className="p-0.5" />}
          isLast={isLast}
        />
      )
    default:
      console.warn('Unable to render system type activity', commentItems)
      return <Text color="tertiaryBackground">{type}</Text>
  }
}

export default PullRequestSystemComments