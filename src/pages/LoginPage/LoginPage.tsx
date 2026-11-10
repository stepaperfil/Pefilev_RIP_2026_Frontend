import { useState, type SubmitEvent } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { Navigate, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../Routes'
import { describeError, http, tokenKey } from '../../modules/http'
import { selectBusy, setAuthBusy, setToken, useAppDispatch, useAppSelector } from '../../store'

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const token = useAppSelector((state) => state.session.token)
  const busy = useAppSelector(selectBusy)
  const [error, setError] = useState('')

  if (token) return <Navigate to={ROUTES.TILES} replace />

  const login = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    dispatch(setAuthBusy(true))
    setError('')
    try {
      const { data } = await http.post<{ access_token: string }>('/api/engineers/login', {
        login: String(form.get('login')).trim(),
        password: String(form.get('password')),
      })
      localStorage.setItem(tokenKey, data.access_token)
      dispatch(setToken(data.access_token))
      navigate(ROUTES.TILES, { replace: true })
    } catch (error) {
      setError(describeError(error))
    } finally {
      dispatch(setAuthBusy(false))
    }
  }

  return (
    <section className="content tco-form-page">
      <h2>Вход</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={login}>
        <fieldset disabled={busy}>
          <Form.Group className="mb-3" controlId="engineer-login">
            <Form.Label>Логин</Form.Label>
            <Form.Control name="login" autoComplete="username" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="engineer-password">
            <Form.Label>Пароль</Form.Label>
            <Form.Control name="password" type="password" autoComplete="current-password" required />
          </Form.Group>
          <Button className="btn-block" type="submit">Войти</Button>
        </fieldset>
      </Form>
    </section>
  )
}
