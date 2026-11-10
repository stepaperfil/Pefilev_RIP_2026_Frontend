import { Nav, Navbar } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES, ROUTE_LABELS, type RouteKey } from '../../Routes'
import { authorization, describeError, hasStatus, http, tokenKey } from '../../modules/http'
import { selectBusy, setAuthBusy, setToken, useAppDispatch, useAppSelector } from '../../store'

const items: RouteKey[] = ['FEED', 'ADD', 'TILES', 'LOGIN']

export function TabBar({ onError }: { onError: (message: string) => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.session.token)
  const busy = useAppSelector(selectBusy)

  const logout = async () => {
    onError('')
    dispatch(setAuthBusy(true))
    try {
      try {
        await http.post('/api/engineers/logout', undefined, { headers: authorization(token) })
      } catch (error) {
        if (!hasStatus(error, 401)) throw error
      }
      localStorage.removeItem(tokenKey)
      dispatch(setToken(''))
      navigate(ROUTES.TILES, { replace: true })
    } catch (error) {
      onError(describeError(error))
    } finally {
      dispatch(setAuthBusy(false))
    }
  }

  return (
    <Navbar as="nav" className="tabbar">
      <Nav className="tabbar-nav">
        {items.map((key) => {
          if (key === 'LOGIN' && token) {
            return <Nav.Link key={key} as="button" type="button" disabled={busy} onClick={logout}>Выход</Nav.Link>
          }
          const active = location.pathname === ROUTES[key] ||
            (key === 'FEED' && location.pathname.startsWith(ROUTES.FEED + '/'))
          return (
            <Nav.Link key={key} as={Link} to={ROUTES[key]}
              disabled={busy || (key === 'ADD' && !token)} className={active ? 'tabbar-active' : ''}>
              {ROUTE_LABELS[key]}
              {active && <span className="tabbar-dot" />}
            </Nav.Link>
          )
        })}
      </Nav>
    </Navbar>
  )
}
