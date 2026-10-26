import { useEffect, useState, type FC } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { DEFAULT_IMAGE, DEFAULT_VIDEO, getLifeCycleStageFeed, type LifeCycleStage } from '../../modules/lifeCycleStagesApi'
import { formatPrice } from '../../modules/format'
import { ROUTES } from '../../Routes'

interface Props {
  id?: string
}

const FeedStage: FC<Props> = ({ id }) => {
  const [stage, setStage] = useState<LifeCycleStage>()
  const navigate = useNavigate()

  useEffect(() => {
    getLifeCycleStageFeed(id === undefined ? undefined : Number(id)).then(setStage)
  }, [id])

  const goNext = () => {
    if (!stage) return
    getLifeCycleStageFeed(stage.id, true).then((next) => {
      if (next) navigate(`${ROUTES.FEED}/${next.id}`)
    })
  }

  if (!stage) {
    return <div className="feed"></div>
  }

  return (
    <div className="feed">
      <video
        className="feed-media"
        src={stage.video_url || DEFAULT_VIDEO}
        poster={stage.image_url || DEFAULT_IMAGE}
        autoPlay
        muted
        loop
        playsInline
        onError={(event) => {
          if (!event.currentTarget.src.endsWith(DEFAULT_VIDEO)) {
            event.currentTarget.src = DEFAULT_VIDEO
          }
        }}
      ></video>
      <div className="feed-overlay">
        <div className="feed-likes">
          <div className="feed-likes-static">
            <span className="feed-likes-icon">💚</span>
            <span className="feed-likes-count">{stage.likes_count}</span>
          </div>
          <Button className="btn-icon feed-next" onClick={goNext} aria-label="Следующий этап">
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

const FeedPage: FC = () => {
  const { id } = useParams()
  return <FeedStage key={id ?? 'first'} id={id} />
}

export default FeedPage
