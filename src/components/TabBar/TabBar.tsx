import type { FC } from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { ROUTES, ROUTE_LABELS, type RouteKey } from '../../Routes'

const ITEMS: { key: RouteKey; enabled: boolean }[] = [
  { key: 'FEED', enabled: true },
  { key: 'ADD', enabled: false },
  { key: 'TILES', enabled: true },
  { key: 'LOGIN', enabled: false },
]

export const TabBar: FC = () => {
  const location = useLocation()

  return (
    <Navbar as="nav" className="tabbar">
      <Nav className="tabbar-nav">
        {ITEMS.map(({ key, enabled }) => {
          if (!enabled) {
            return (
              <Nav.Link key={key} disabled>
                {ROUTE_LABELS[key]}
              </Nav.Link>
            )
          }
          const active = location.pathname.startsWith(ROUTES[key])
          return (
            <Nav.Link key={key} as={Link} to={ROUTES[key]} className={active ? 'tabbar-active' : ''}>
              {ROUTE_LABELS[key]}
              {active && <span className="tabbar-dot"></span>}
            </Nav.Link>
          )
        })}
      </Nav>
    </Navbar>
  )
}
