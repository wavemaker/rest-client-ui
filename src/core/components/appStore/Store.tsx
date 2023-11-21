import { configureStore } from '@reduxjs/toolkit'
import providerState from './Slice'
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore'
const appStore: ToolkitStore = configureStore({
    reducer: {
        slice: providerState
    },
})
export type RootState = ReturnType<typeof appStore.getState>
export default appStore