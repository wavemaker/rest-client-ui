import { configureStore } from '@reduxjs/toolkit'
import providerState from './Slice'
const appStore = configureStore({
    reducer: { 
        slice : providerState
     },
})
export type RootState = ReturnType<typeof appStore.getState>
export default appStore