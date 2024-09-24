import { Badge, cn, Icon, StackedList, Text } from '@harnessio/canary'
import React, { useMemo, useState } from 'react'
import cx from 'classnames'

interface PullRequestProps {
  merged: number | null | undefined // TODO: Should merged really be all these??
  name: string | undefined
  number?: number
  sha?: string
  author?: string
  reviewRequired: boolean
  tasks?: number
  source_branch?: string
  timestamp: string
  comments?: number
  state?: string
  labels?: {
    text: string
    color: string
  }[]
}

interface PageProps {
  pullRequests?: PullRequestProps[]
  LinkComponent: React.ComponentType<{ to: string; children: React.ReactNode }>
}

const HeaderTitle = ({
  setHeaderFilter,
  headerFilter
}: {
  setHeaderFilter: (state: string) => void
  headerFilter: string
}) => {
  return (
    <div className="flex gap-4 items-center">
      <div
        onClick={() => setHeaderFilter('open')}
        className={cx('flex gap-2 items-center', {
          'text-white': headerFilter === 'open',
          'text-tertiary-background': headerFilter === 'closed'
        })}>
        <Icon size={16} name="pr-open" />
        <Text
          color={headerFilter === 'open' ? 'primary' : headerFilter === 'closed' ? 'tertiaryBackground' : undefined}
          className={cx({
            'text-white': headerFilter === 'open',
            '!text-tertiary-background': headerFilter === 'closed'
          })}
          size={2}
          truncate>
          122 Open
        </Text>
      </div>
      <div
        onClick={() => setHeaderFilter('closed')}
        className={cx('flex gap-2 items-center', {
          'text-white': headerFilter === 'closed',
          'text-tertiary-background': headerFilter === 'open'
        })}>
        <Icon size={12} name="tick" />
        <Text
          className={cx('flex gap-2 items-center', {
            'text-white': headerFilter === 'closed',
            'text-tertiary-background': headerFilter === 'open'
          })}
          size={2}
          truncate>
          8,128 Closed
        </Text>
      </div>
    </div>
  )
}

const colorMapping: { [key: string]: { border: string; text: string; bg: string } } = {
  mint: { border: 'border-emerald-400/20', text: 'text-emerald-300', bg: 'bg-emerald-400/10' },
  yellow: { border: 'border-orange-400/20', text: 'text-orange-400', bg: 'bg-orange-400/10' },
  red: { border: 'border-red-400/20', text: 'text-red-400', bg: 'bg-red-400/10' },
  blue: { border: 'border-blue-400/20', text: 'text-blue-300', bg: 'bg-blue-400/10' },
  purple: { border: 'border-purple-400/20', text: 'text-purple-300', bg: 'bg-purple-400/10' }
}

const Title = ({
  success,
  title,
  labels,
  state
}: {
  state?: string
  success: boolean
  title: string
  labels: { text: string; color: string }[]
}) => {
  return (
    <div className="flex gap-2 items-center">
      <Icon
        size={16}
        className={cx({ 'text-success': state === 'open' })}
        name={state === 'open' ? 'pr-open' : success ? 'pr-merge' : state === 'closed' ? 'pr-closed' : 'pr-draft'}
      />

      <Text size={2} truncate>
        {title}
      </Text>
      {labels &&
        labels.map((l, l_idx) => {
          const { border, text, bg } = colorMapping[l.color] || { border: '', text: '' }
          return (
            <Badge key={l_idx} variant="outline" size={'sm'} borderRadius="full" className={cn(border, text, bg)}>
              <p className="truncate">{l.text}</p>
            </Badge>
          )
        })}
    </div>
  )
}

const Description = ({
  reviewRequired,
  number,
  // tasks,
  author,
  source_branch,
  timestamp
}: {
  number: number
  reviewRequired: boolean
  tasks?: number
  author: string
  source_branch: string
  timestamp: string
}) => {
  return (
    <div className="pl-[24px] inline-flex gap-2 items-center max-w-full overflow-hidden">
      {number && <div className="flex gap-1 items-center ">#{number}</div>}
      {author && timestamp && (
        <Text size={1} color="tertiaryBackground">
          opened {timestamp} by {author}
        </Text>
      )}
      {typeof reviewRequired === 'boolean' && (
        <Text size={1} color="tertiaryBackground">
          {reviewRequired ? 'Review required' : 'Draft'}
        </Text>
      )}
      {/* TODO: where did tasks go?}
      {/* {typeof tasks !== 'undefined' && tasks > 0 && (
        <div className="flex gap-1 items-center">
          <Icon size={11} name={'tasks'} />
          <Text size={1} color="tertiaryBackground">
            {tasks} task{tasks === 1 ? '' : 's'}
          </Text>
        </div>
      )} */}
      {source_branch && (
        <div className="flex gap-1 items-center">
          <Icon size={11} name={'signpost'} />
          <Text size={1} color="tertiaryBackground">
            {source_branch}
          </Text>
        </div>
      )}
    </div>
  )
}

const Comments = ({ comments }: { comments: number }) => {
  return (
    <div className="flex gap-1.5 items-center">
      <Icon size={16} name={'comments'} />
      <Text size={1} className="text-primary">
        {comments}
      </Text>
    </div>
  )
}

export function PullRequestList({ pullRequests, LinkComponent }: PageProps) {
  const [headerFilter, setHeaderFilter] = useState('open')
  const filteredData = useMemo(
    () =>
      pullRequests?.filter(pr => {
        if (headerFilter === 'open') return pr.state === 'open'
        if (headerFilter === 'closed') return pr.state !== 'open' || pr.merged !== null
        return true
      }),
    [headerFilter]
  )
  return (
    <>
      {filteredData && filteredData.length > 0 && (
        <StackedList.Root>
          <StackedList.Item isHeader disableHover>
            <StackedList.Field
              title={<HeaderTitle headerFilter={headerFilter} setHeaderFilter={setHeaderFilter} />}></StackedList.Field>
          </StackedList.Item>
          {filteredData?.map((pullRequest, pullRequest_idx) => (
            <LinkComponent to={pullRequest.number?.toString() || ''}>
              <StackedList.Item
                key={`${pullRequest.name}-${pullRequest_idx}`}
                isLast={filteredData.length - 1 === pullRequest_idx}>
                {pullRequest.number && (
                  <>
                    <StackedList.Field
                      title={
                        pullRequest.name && (
                          <Title
                            state={pullRequest.state}
                            success={pullRequest.merged ? true : false}
                            title={pullRequest.name}
                            labels={pullRequest.labels || []}
                          />
                        )
                      }
                      description={
                        pullRequest.author && (
                          <Description
                            number={pullRequest.number || 123}
                            author={pullRequest.author}
                            reviewRequired={pullRequest.reviewRequired}
                            tasks={pullRequest.tasks}
                            source_branch={pullRequest.source_branch || ''}
                            timestamp={pullRequest.timestamp || '1 hour ago'}
                          />
                        )
                      }
                    />
                    {pullRequest.comments && (
                      <StackedList.Field title={<Comments comments={pullRequest.comments} />} right label secondary />
                    )}
                  </>
                )}
              </StackedList.Item>
            </LinkComponent>
          ))}
        </StackedList.Root>
      )}
    </>
  )
}
