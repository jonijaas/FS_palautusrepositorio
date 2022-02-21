import { createSlice } from "@reduxjs/toolkit"

const initialState = {text: ''}


const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter(state, action) {
      const content = action.payload
      state.text = content
    }
  }
})

export const { setFilter } = filterSlice.actions
export default filterSlice.reducer