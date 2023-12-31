import { configureStore } from '@reduxjs/toolkit'
import activateSlice from './slices/activateSlice'
import userSlice from './slices/userSlice'

export const store = configureStore({
  reducer: {
    auth : userSlice,
    activate : activateSlice
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch