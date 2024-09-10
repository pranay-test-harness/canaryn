import { Badge, cn, Icon, StackedList } from '@harnessio/canary'
import React from 'react'

interface Repo {
  id: string
  name: string
  description?: string
  private: boolean
  stars: number
  forks: number
  pulls: number
  timestamp: string
}

interface PageProps {
  repos?: Repo[]
  LinkComponent: React.ComponentType<{ to: string; children: React.ReactNode }>
}

const Stats = ({ stars, forks, pulls }: { stars: number; forks: number; pulls: number }) => (
  <div className="flex gap-3 justify-end items-center select-none font-medium">
    <span className="flex gap-1.5 items-center">
      <Icon width={16} name="star" className="text-tertiary-background" />
      <span className="text-primary text-xs font-normal">{stars || 0}</span>
    </span>
    <span className="flex gap-1.5 items-center">
      <Icon size={16} name="pull" className="text-tertiary-background" />
      <span className="text-primary text-xs font-normal">{forks || 0}</span>
    </span>
    <span className="flex gap-1.5 items-center">
      <Icon size={16} name="pull" className="text-tertiary-background" />
      <span className="text-primary text-xs font-normal">{pulls || 0}</span>
    </span>
  </div>
)

const Title = ({ title, isPrivate }: { title: string; isPrivate: boolean }) => (
  <>
    {title}
    <Badge
      size="sm"
      disableHover
      className={cn('ml-3 rounded-full border border-[hsla(var(--success),0.4)] text-success bg-transparent', {
        'border border-muted bg-background text-tertiary-background': isPrivate
      })}>
      {isPrivate ? 'Private' : 'Public'}
    </Badge>
  </>
)

export default function RepoList({ repos, LinkComponent }: PageProps) {
  return (
    <>
      {repos && repos.length > 0 && (
        <StackedList.Root>
          {repos.map((repo, repo_idx) => (
            <LinkComponent to={repo.name}>
              <StackedList.Item key={repo.name} isLast={repos.length - 1 === repo_idx}>
                <StackedList.Field
                  description={repo.description}
                  title={<Title title={repo.name} isPrivate={repo.private} />}
                />
                <StackedList.Field
                  title={
                    <>
                      Updated <em>{repo.timestamp}</em>
                    </>
                  }
                  description={<Stats stars={repo.stars} forks={repo.forks} pulls={repo.pulls} />}
                  right
                  label
                  secondary
                />
              </StackedList.Item>
            </LinkComponent>
          ))}
        </StackedList.Root>
      )}
    </>
  )
}
