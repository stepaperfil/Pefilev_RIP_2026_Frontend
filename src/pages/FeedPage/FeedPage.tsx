import { useEffect, useState } from 'react'
import { Alert, Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { DEFAULT_IMAGE, DEFAULT_VIDEO, type LifeCycleStage } from '../../modules/lifeCycleStagesApi'
import { likeLifeCycleStage, loadLifeCycleStageFeed } from '../../modules/lifeCycleStageThunks'
import { formatPrice } from '../../modules/format'
import { ROUTES } from '../../Routes'
import { selectBusy, useAppDispatch, useAppSelector } from '../../store'

function FeedStage({ id }: { id?: string }) {
  const [stage, setStage] = useState<LifeCycleStage>()
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const token = useAppSelector((state) => state.session.token)
  const busy = useAppSelector(selectBusy)

  useEffect(() => {
    const request = dispatch(loadLifeCycleStageFeed({ id: id === undefined ? undefined : Number(id) }))
    let active = true
    request.unwrap().then((data) => {
      if (!active) return
      setError('')
      setStage(data)
      setNotice(data ? '' : 'Этап не найден.')
    }).catch((error: unknown) => {
      if (!active) return
      setStage(undefined)
      setError(String(error))
    })
    return () => { active = false; request.abort() }
  }, [dispatch, id, token])

  const goNext = async () => {
    if (!stage) return
    setError('')
    try {
      const next = await dispatch(loadLifeCycleStageFeed({ id: stage.id, next: true })).unwrap()
      if (next) navigate(`${ROUTES.FEED}/${next.id}`)
      else setNotice('Это последний этап.')
    } catch (error) {
      setError(String(error))
    }
  }

  const toggleLike = async () => {
    if (!stage) return
    setError('')
    try {
      setStage(await dispatch(likeLifeCycleStage({ id: stage.id, like: stage.is_liked ? 0 : 1 })).unwrap())
    } catch (error) {
      setError(String(error))
    }
  }

  if (!stage) {
    return <div className="feed feed-notice">{error ? <Alert variant="danger">{error}</Alert> : notice}</div>
  }

  return (
    <div className="feed">
      <video
        key={stage.video_url}
        className="feed-media"
        src={stage.video_url || DEFAULT_VIDEO}
        poster={stage.image_url || DEFAULT_IMAGE}
        autoPlay
        muted
        loop
        playsInline
        onError={(event) => {
          if (!event.currentTarget.src.endsWith(DEFAULT_VIDEO)) event.currentTarget.src = DEFAULT_VIDEO
        }}
      />
      <div className="feed-overlay">
        {error && <Alert variant="danger">{error}</Alert>}
        {notice && <p role="status">{notice}</p>}
        <div className="feed-likes">
          <button type="button" className="feed-likes-button" disabled={!token || busy}
            aria-pressed={Boolean(token) && stage.is_liked === 1}
            aria-label="Лайк" onClick={toggleLike}>
            <span className="feed-likes-icon" aria-hidden="true">💚</span>
            <span className="feed-likes-count">{stage.likes_count}</span>
          </button>
          <Button className="btn-icon feed-next" disabled={busy} onClick={goNext} aria-label="Следующий этап">
            →
          </Button>
        </div>

        <h1 className="feed-title">{stage.title}</h1>

        <div className="feed-params">
          <div className="feed-param">
            <span className="feed-param-label">ЦЕНА ЗА ЕДИНИЦУ</span>
            <span className="feed-param-value">{formatPrice(stage.price_per_unit)}</span>
          </div>
          <div className="feed-param">
            <span className="feed-param-label">ПОРЯДКОВЫЙ НОМЕР</span>
            <span className="feed-param-value">{stage.stage_position}</span>
          </div>
        </div>

        <div className="feed-description">
          <input type="checkbox" id="desc-toggle" className="feed-description-toggle-input" />
          <p className="feed-description-text">{stage.description}</p>
          <label htmlFor="desc-toggle" className="feed-description-toggle">
            <span className="label-more">Подробнее</span>
            <span className="label-less">Скрыть</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default function FeedPage() {
  const { id } = useParams()
  return <FeedStage key={id ?? 'first'} id={id} />
}
