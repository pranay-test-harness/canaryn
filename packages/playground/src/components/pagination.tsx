import React from 'react'

import {
  ListPagination,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationEllipsis,
  PaginationPrevious
} from '@harnessio/canary'

interface PaginationComponentProps {
  totalPages: number
  currentPage: number
  goToPage: (pageNum: number) => void
}

export const PaginationComponent: React.FC<PaginationComponentProps> = ({ totalPages, currentPage, goToPage }) => {
  const generatePaginationItems = (): React.ReactElement[] => {
    const paginationItems: React.ReactElement[] = []
    const siblings = 2 // Number of adjacent pages before and after the current page

    // Always show first page
    paginationItems.push(
      <PaginationItem>
        <PaginationLink size="sm_icon" href="#" onClick={() => goToPage(1)} isActive={currentPage === 1}>
          1
        </PaginationLink>
      </PaginationItem>
    )

    if (currentPage > 2 + siblings) {
      paginationItems.push(
        <PaginationItem key="start-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      )
    }

    // Pages around the current page
    for (let i = Math.max(2, currentPage - siblings); i <= Math.min(totalPages - 1, currentPage + siblings); i++) {
      paginationItems.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={currentPage === i} size="sm_icon" href="#" onClick={() => goToPage(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    if (currentPage < totalPages - siblings - 1) {
      paginationItems.push(
        <PaginationItem key="end-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      )
    }
    // Always show last page
    paginationItems.push(
      <PaginationItem key={totalPages}>
        <PaginationLink
          size="sm_icon"
          href="#"
          onClick={() => goToPage(totalPages)}
          isActive={currentPage === totalPages}>
          {totalPages}
        </PaginationLink>
      </PaginationItem>
    )

    return paginationItems
  }

  return (
    <ListPagination.Root>
      <Pagination>
        <PaginationContent>
          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious
              size="sm"
              href="#"
              onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            />
          </PaginationItem>

          {/* Pagination Items */}
          {...generatePaginationItems()}

          {/* Next Button */}
          <PaginationItem>
            <PaginationNext
              size="sm"
              href="#"
              onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </ListPagination.Root>
  )
}
