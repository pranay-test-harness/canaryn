import React from 'react'
import {
  Text,
  Icon,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@harnessio/canary'

interface BranchListProps {
  name: string
}

interface PageProps {
  name: string
  branchList: BranchListProps[]
}

export default function RepoSummaryPanel({ ...props }: PageProps) {
  const { name, branchList } = props

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="flex gap-1.5 items-center px-3">
          <Icon name="branch" size={14} className="text-tertiary-background" />
          <Text className="text-primary/90">{name}</Text>
          <Icon name="chevron-down" size={11} className="chevron-down ml-6 text-tertiary-background" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {branchList &&
          branchList.map(branch => {
            return <DropdownMenuItem>{branch.name}</DropdownMenuItem>
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
