import React, { useState } from 'react'
import { SandboxLayout } from '../index'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Icon, IconProps, Navbar, NavbarProjectChooser, NavbarUser } from '@harnessio/canary'
import { MoreSubmenu } from '../components/more-submenu'
import { navbarSubmenuData } from '../data/mockNavbarSubmenuData'
import { TypesUser } from './types'

interface NavbarItem {
  id: number
  title: string
  iconName: IconProps['name']
  description: string
  to?: string
}

interface SandboxRootProps {
  currentUser: TypesUser | undefined
  currentSpaceId: string | undefined
}

export const SandboxRoot: React.FC<SandboxRootProps> = ({ currentUser, currentSpaceId }) => {
  const [showMore, setShowMore] = useState<boolean>(false)

  const primaryMenuItems = [
    {
      text: 'Repositories',
      icon: <Icon name="repositories" size={12} />,
      to: `/spaces/${currentSpaceId}/repos`
    },
    {
      text: 'Pipelines',
      icon: <Icon name="pipelines" size={12} />,
      to: `/spaces/${currentSpaceId}/pipelines`
    },
    {
      text: 'Executions',
      icon: <Icon name="cog-6" size={12} />,
      to: `/spaces/${currentSpaceId}/executions`
    }
  ]

  const initialPinnedMenuItems: NavbarItem[] = [
    {
      id: 3,
      title: 'Featured Flags',
      iconName: 'featured-flags',
      description: 'Toggle Featured Flags',
      to: '/feature-flags'
    },
    {
      id: 4,
      title: 'Chaos Engineering',
      iconName: 'chaos-engineering',
      description: 'Manage chaos experiments',
      to: '/chaos-engineering'
    },
    {
      id: 12,
      title: 'Environment',
      iconName: 'environment',
      description: 'Manage your environments',
      to: '/environment'
    },
    {
      id: 13,
      title: 'Secrets',
      iconName: 'secrets',
      description: 'Store your secrets securely',
      to: '/secrets'
    },
    {
      id: 14,
      title: 'Connectors',
      iconName: 'connectors',
      description: 'Manage your connectors',
      to: '/connectors'
    }
  ]

  const [pinnedItems, setPinnedItems] = useState<NavbarItem[]>(initialPinnedMenuItems)

  function handleMore() {
    setShowMore(!showMore)
  }

  function handlePinItem(item: NavbarItem) {
    setPinnedItems(prevPinnedItems => {
      const isPinned = prevPinnedItems.some(pinned => pinned.id === item.id)
      if (isPinned) {
        return prevPinnedItems.filter(pinned => pinned.id !== item.id)
      } else {
        const itemToPin = navbarSubmenuData.flatMap(group => group.items).find(i => i.id === item.id)
        if (itemToPin) {
          return [
            {
              id: itemToPin.id,
              title: itemToPin.title,
              iconName: itemToPin.iconName,
              description: itemToPin.description,
              to: itemToPin.to || ''
            },
            ...prevPinnedItems
          ]
        }
        return prevPinnedItems
      }
    })
  }

  return (
    <SandboxLayout.Root>
      <SandboxLayout.LeftPanel>
        <Navbar.Root>
          <Navbar.Header>
            <NavbarProjectChooser.Root
              avatarLink={
                <Link to="/">
                  <Icon name="harness" size={18} className="text-primary" />
                </Link>
              }
              productLink={
                <Link to="/">
                  <Icon name="harness-logo-text" width={65} height={15} className="text-primary" />
                </Link>
              }
            />
          </Navbar.Header>
          <Navbar.Content>
            <Navbar.Group>
              {primaryMenuItems.map((item, idx) => (
                <NavLink key={idx} to={item.to || ''}>
                  {({ isActive }) => <Navbar.Item key={idx} text={item.text} icon={item.icon} active={isActive} />}
                </NavLink>
              ))}
              <div onClick={() => (!showMore ? handleMore() : null)}>
                <Navbar.Item text="More" icon={<Icon name="ellipsis" size={12} />} />
              </div>
            </Navbar.Group>
            <Navbar.AccordionGroup title="Pinned">
              {pinnedItems.map(item => (
                <NavLink key={item.id} to={item.to || ''}>
                  {({ isActive }) => (
                    <Navbar.Item
                      key={item.id}
                      text={item.title}
                      icon={<Icon name={item.iconName} size={12} />}
                      active={isActive}
                    />
                  )}
                </NavLink>
              ))}
            </Navbar.AccordionGroup>
            {/* Sandboxed new layout examples */}
            <Navbar.AccordionGroup title="Layout Sandbox">
              <NavLink to="/sandbox/landing">
                <Navbar.Item text="Landing" icon={<Icon name="harness" size={12} />} />
              </NavLink>
              <NavLink to="/sandbox/repos">
                <Navbar.Item text="Repo List" icon={<Icon name="repositories" size={12} />} />
              </NavLink>
              <NavLink to="/sandbox/repos/drone/summary">
                <Navbar.Item
                  text="Repo&nbsp;&nbsp;/&nbsp;&nbsp;Summary"
                  icon={<Icon name="repositories" size={12} />}
                />
              </NavLink>
              <NavLink to="/sandbox/repos/drone/code">
                <Navbar.Item text="Repo&nbsp;&nbsp;/&nbsp;&nbsp;Code" icon={<Icon name="repositories" size={12} />} />
              </NavLink>
              <NavLink to="/sandbox/executions">
                <Navbar.Item text="Executions" icon={<Icon name="cog-6" size={12} />} />
              </NavLink>
              <NavLink to="/sandbox/repos/create">
                <Navbar.Item text="Create repository" icon={<Icon name="repositories" size={12} />} />
              </NavLink>
              <NavLink to="/sandbox/settings/account">
                <Navbar.Item text="Account settings" icon={<Icon name="cog-6" size={12} />} />
              </NavLink>
              <NavLink to="/sandbox/settings/project">
                <Navbar.Item text="Project settings" icon={<Icon name="cog-6" size={12} />} />
              </NavLink>
              <NavLink to="/sandbox/settings/user-mamagement">
                <Navbar.Item text="User Management" icon={<Icon name="cog-6" size={12} />} />
              </NavLink>
            </Navbar.AccordionGroup>
          </Navbar.Content>
          <Navbar.Footer>
            <NavbarUser.Root
              username={currentUser?.display_name || currentUser?.uid}
              isAdmin={currentUser?.admin || false}
              url={currentUser?.url || ''}
              menuItems={[
                {
                  key: 0,
                  element: <Link to="/sandbox/settings/profile/general">Settings</Link>
                },
                {
                  key: 1,
                  element: <Link to="/logout">Log out</Link>
                }
              ]}
            />
          </Navbar.Footer>
        </Navbar.Root>
      </SandboxLayout.LeftPanel>
      <Outlet />
      <MoreSubmenu showMore={showMore} handleMore={handleMore} onPinItem={handlePinItem} pinnedItems={pinnedItems} />
    </SandboxLayout.Root>
  )
}
