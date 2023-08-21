import { configureStore } from '@reduxjs/toolkit'
import commonSlice from './Slice'
const appStore = configureStore({
    reducer: { 
        slice : commonSlice
     },
})

export default appStore