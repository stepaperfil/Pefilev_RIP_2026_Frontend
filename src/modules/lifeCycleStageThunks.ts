import { createAsyncThunk } from '@reduxjs/toolkit'
import { Api } from '../api/Api'
import type { RootState } from '../store'
import { authorization, describeError, hasStatus, mediaUrl, serviceUnavailable } from './http'
import { getLifeCycleStageFeed, getLifeCycleStages } from './lifeCycleStagesApi'

const api = new Api({ baseURL: window.location.origin, timeout: 6000 }).api
const stageThunk = createAsyncThunk.withTypes<{ state: RootState; rejectValue: string }>()

export const loadLifeCycleStages = stageThunk('lifeCycleStages/list', async (price: number | undefined, thunk) => {
  const { token } = thunk.getState().session
  try {
    const stages = await api.listLifeCycleStages({ max_price_per_unit: price }, {
      headers: authorization(token), signal: thunk.signal,
    })
    return stages.map((stage) => ({
      id: stage.id!,
      title: stage.title ?? '',
      image_url: mediaUrl(stage.image_url),
      price_per_unit: stage.price_per_unit ?? null,
      likes_count: stage.likes_count ?? 0,
      is_mine: stage.is_mine ?? 0,
    }))
  } catch (error) {
    if (!token && !thunk.signal.aborted && serviceUnavailable(error)) return getLifeCycleStages(price)
    return thunk.rejectWithValue(describeError(error))
  }
})

const toFeedStage = (stage: Awaited<ReturnType<typeof api.getLifeCycleStageFeed>>) => ({
  id: stage.id!,
  title: stage.title ?? '',
  description: stage.description ?? '',
  image_url: mediaUrl(stage.image_url),
  video_url: mediaUrl(stage.video_url),
  price_per_unit: stage.price_per_unit ?? null,
  stage_position: stage.stage_position ?? null,
  likes_count: stage.likes_count ?? 0,
  is_liked: stage.is_liked ?? 0,
})

export const loadLifeCycleStageFeed = stageThunk(
  'lifeCycleStages/feed',
  async ({ id, next }: { id?: number; next?: boolean }, thunk) => {
    const { token } = thunk.getState().session
    try {
      return toFeedStage(await api.getLifeCycleStageFeed({ id, next: next ? 'true' : undefined }, {
        headers: authorization(token), signal: thunk.signal,
      }))
    } catch (error) {
      if (hasStatus(error, 404)) return undefined
      if (!token && !thunk.signal.aborted && serviceUnavailable(error)) return getLifeCycleStageFeed(id, next)
      return thunk.rejectWithValue(describeError(error))
    }
  },
)

export const loadDraftLifeCycleStage = stageThunk('lifeCycleStages/draft', async (_, thunk) => {
  try {
    return await api.getDraftLifeCycleStage({
      headers: authorization(thunk.getState().session.token), signal: thunk.signal,
    })
  } catch (error) {
    if (hasStatus(error, 404)) return undefined
    return thunk.rejectWithValue(describeError(error))
  }
})

export const createLifeCycleStage = stageThunk(
  'lifeCycleStages/create',
  async (data: { title: string; image: File; video: File }, thunk) => {
    try {
      return await api.createLifeCycleStage(data, {
        headers: authorization(thunk.getState().session.token), signal: thunk.signal, timeout: 0,
      })
    } catch (error) {
      return thunk.rejectWithValue(describeError(error))
    }
  },
)

export const publishLifeCycleStage = stageThunk(
  'lifeCycleStages/publish',
  async ({ id, ...data }: { id: number; description: string; price_per_unit: number; stage_position: number }, thunk) => {
    try {
      return await api.publishLifeCycleStage(id, data, {
        headers: authorization(thunk.getState().session.token), signal: thunk.signal,
      })
    } catch (error) {
      return thunk.rejectWithValue(describeError(error))
    }
  },
)

export const deleteLifeCycleStage = stageThunk('lifeCycleStages/delete', async (id: number, thunk) => {
  try {
    await api.deleteLifeCycleStage(id, {
      headers: authorization(thunk.getState().session.token), signal: thunk.signal,
    })
    return id
  } catch (error) {
    return thunk.rejectWithValue(describeError(error))
  }
})

export const likeLifeCycleStage = stageThunk(
  'lifeCycleStages/like',
  async ({ id, like }: { id: number; like: 0 | 1 }, thunk) => {
    try {
      return toFeedStage(await api.likeLifeCycleStage(id, { like }, {
        headers: authorization(thunk.getState().session.token), signal: thunk.signal,
      }))
    } catch (error) {
      return thunk.rejectWithValue(describeError(error))
    }
  },
)
