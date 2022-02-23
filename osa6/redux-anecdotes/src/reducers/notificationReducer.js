import { createSlice } from "@reduxjs/toolkit"

const initialState = { message: null }

let timeoutID

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationMessage(state, action) {
      const content = action.payload
      state.message = content
    },
    removeNotification(state, action) {
      state.message = null
    },
  }
})

export const { setNotificationMessage, removeNotification } = notificationSlice.actions

export const setNotification = (message, time) => {
  return async dispatch => {
    dispatch(setNotificationMessage(message))
    clearTimeout(timeoutID)
    timeoutID = setTimeout(() => {(dispatch(removeNotification()))}, time * 1000)
  }
}

export default notificationSlice.reducer