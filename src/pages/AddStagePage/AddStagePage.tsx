import { useEffect, useState, type SubmitEvent } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { Navigate, useNavigate } from 'react-router-dom'
import type { SerializerLifeCycleStage } from '../../api/Api'
import { ROUTES } from '../../Routes'
import { mediaUrl } from '../../modules/http'
import { DEFAULT_IMAGE, DEFAULT_VIDEO } from '../../modules/lifeCycleStagesApi'
import {
  createLifeCycleStage, loadDraftLifeCycleStage, publishLifeCycleStage,
} from '../../modules/lifeCycleStageThunks'
import { selectBusy, useAppDispatch, useAppSelector } from '../../store'

function AddStageForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const busy = useAppSelector(selectBusy)
  const [draft, setDraft] = useState<SerializerLifeCycleStage>()
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const request = dispatch(loadDraftLifeCycleStage())
    let active = true
    request.unwrap().then((data) => {
      if (!active) return
      setDraft(data)
      setReady(true)
    }).catch((error: unknown) => { if (active) setError(String(error)) })
    return () => { active = false; request.abort() }
  }, [dispatch])

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setError('')
    try {
      if (draft?.id !== undefined) {
        await dispatch(publishLifeCycleStage({
          id: draft.id,
          description: String(data.get('description')).trim(),
          price_per_unit: Number(data.get('price_per_unit')),
          stage_position: Number(data.get('stage_position')),
        })).unwrap()
        navigate(ROUTES.TILES)
      } else {
        const image = data.get('image')
        const video = data.get('video')
        const title = String(data.get('title')).trim()
        if (!title || !(image instanceof File) || !image.size || !(video instanceof File) || !video.size) {
          setError('Укажите название, фото и видео.')
          return
        }
        setDraft(await dispatch(createLifeCycleStage({ title, image, video })).unwrap())
      }
    } catch (error) {
      setError(String(error))
    }
  }

  return (
    <section className="content tco-form-page">
      <div className="draft-heading">
        <h2>Черновик</h2>
        <span className="draft-status">Не опубликовано</span>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {ready && <Form onSubmit={submit} key={draft?.id ?? 'new'}>
        <fieldset disabled={busy}>
          <h3 className="draft-section-title">Медиа</h3>
          {draft ? <>
            <img className="draft-media" src={mediaUrl(draft.image_url) || DEFAULT_IMAGE} alt={draft.title ?? 'Фото этапа'} />
            <video className="draft-media" src={mediaUrl(draft.video_url) || DEFAULT_VIDEO} controls playsInline />
            <h3 className="draft-section-title">Название</h3>
            <p className="draft-title">{draft.title}</p>
            <Form.Group className="mb-3" controlId="stage-description">
              <Form.Label>Краткое описание</Form.Label>
              <Form.Control as="textarea" name="description" rows={3} defaultValue={draft.description} required />
            </Form.Group>
            <h3 className="draft-section-title">Параметры этапа</h3>
            <div className="draft-params">
              <Form.Group className="mb-3" controlId="stage-price">
                <Form.Label>Цена за единицу, ₽</Form.Label>
                <Form.Control name="price_per_unit" defaultValue={draft.price_per_unit ?? undefined} type="number" min={0} step={1} required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="stage-position">
                <Form.Label>Порядковый номер</Form.Label>
                <Form.Control name="stage_position" defaultValue={draft.stage_position ?? undefined} type="number" min={1} step={1} required />
              </Form.Group>
            </div>
            <Button className="btn-block" type="submit">Опубликовать</Button>
          </> : <>
            <Form.Group className="mb-3" controlId="stage-image">
              <Form.Label>Фото</Form.Label>
              <Form.Control name="image" type="file" accept="image/*" required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="stage-video">
              <Form.Label>Видео</Form.Label>
              <Form.Control name="video" type="file" accept="video/*" required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="stage-title">
              <Form.Label>Название</Form.Label>
              <Form.Control name="title" placeholder="Введите название этапа" maxLength={150} required />
            </Form.Group>
            <Button className="btn-block" type="submit">Далее</Button>
          </>}
        </fieldset>
      </Form>}
    </section>
  )
}

export default function AddStagePage() {
  const token = useAppSelector((state) => state.session.token)
  return token ? <AddStageForm /> : <Navigate to={ROUTES.LOGIN} replace />
}
