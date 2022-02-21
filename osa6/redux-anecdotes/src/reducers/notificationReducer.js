import { createSlice } from "@reduxjs/toolkit"

const initialState = { message: null }


const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      const content = action.payload
      state.message = content
    },
    removeNotification(state, action) {
      state.message = null
    }
  }
})

export const { setNotification, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer