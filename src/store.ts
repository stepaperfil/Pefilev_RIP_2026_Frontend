import { configureStore, createSlice, isFulfilled, isPending, isRejected, type PayloadAction } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'

const session = createSlice({
  name: 'session',
  initialState: { token: '', busy: false },
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload
    },
    setAuthBusy(state, action: PayloadAction<boolean>) {
      state.busy = action.payload
    },
  },
})

const stages = createSlice({
  name: 'lifeCycleStages',
  initialState: { maxPrice: '', appliedPrice: '', pending: 0 },
  reducers: {
    setMaxPrice(state, action: PayloadAction<string>) {
      state.maxPrice = action.payload
    },
    applyPrice(state) {
      state.appliedPrice = state.maxPrice
    },
  },
  extraReducers: (builder) => builder
    .addCase(session.actions.setToken, (state) => {
      state.maxPrice = ''
      state.appliedPrice = ''
    })
    .addMatcher((action) => isPending(action) && action.type.startsWith('lifeCycleStages/'), (state) => {
      state.pending += 1
    })
    .addMatcher(
      (action) => (isFulfilled(action) || isRejected(action)) && action.type.startsWith('lifeCycleStages/'),
      (state) => { state.pending -= 1 },
    ),
})

export const { setToken, setAuthBusy } = session.actions
export const { setMaxPrice, applyPrice } = stages.actions
export const store = configureStore({
  reducer: { session: session.reducer, lifeCycleStages: stages.reducer },
})

export type RootState = ReturnType<typeof store.getState>
export const useAppDispatch = useDispatch.withTypes<typeof store.dispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const selectBusy = (state: RootState) => state.session.busy || state.lifeCycleStages.pending > 0
