import React, { useState } from 'react'
import { Icon, Navbar } from '@harnessio/canary'
import { SandboxLayout } from '..'
import { PlaygroundSandboxLayoutSettings } from '../settings/sandbox-settings'
import { NavLink, Outlet } from 'react-router-dom'

function Sidebar() {
  return (
    <Navbar.Root className="w-full border-none bg-transparent px-3">
      <Navbar.Content>
        <Navbar.Group>
          <NavLink to="general">
            <Navbar.Item text="General" icon={<Icon name="harness" size={12} />} />
          </NavLink>
          <NavLink to="members">
            <Navbar.Item text="Members" icon={<Icon name="harness" size={12} />} />
          </NavLink>
        </Navbar.Group>
      </Navbar.Content>
    </Navbar.Root>
  )
}

function SandboxSettingsProjectPage() {
  const [loadState, setLoadState] = useState('sub-float')

  return (
    <>
      {loadState.includes('sub') && (
        <SandboxLayout.LeftSubPanel hasHeader>
          <Sidebar />
        </SandboxLayout.LeftSubPanel>
      )}
      <Outlet />
      <PlaygroundSandboxLayoutSettings loadState={loadState} setLoadState={setLoadState} />
    </>
  )
}

export { SandboxSettingsProjectPage }