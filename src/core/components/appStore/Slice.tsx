import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProviderI } from "../ProviderModal";

interface CommonState {
    selectedProvider: ProviderI;
    providerAuthURL: string;
    providerList: [];
    configOpen: boolean,
    providerOpen: boolean
}

const providerState = createSlice({
    name: 'providerId',
    initialState: {
        selectedProvider: { providerId: '', authorizationUrl: '', accessTokenUrl: '', sendAccessTokenAs: '', accessTokenParamName: '', scopes: [] },
        providerAuthURL: "",
        providerList: [],
        configOpen: false,
        providerOpen: false
    } as CommonState,
    reducers: {
        setSelectedProvider: (state, action: PayloadAction<ProviderI>) => {
            state.selectedProvider = action.payload;
        },
        setProviderAuthorizationUrl: (state, action: PayloadAction<string>) => {
            state.providerAuthURL = action.payload;
        },
        setproviderList: (state, action) => {
            state.providerList = action.payload
        },
        setConfigOpen: (state, action) => {
            state.configOpen = action.payload
        },
        setProviderOpen: (state, action) => {
            state.providerOpen = action.payload
        }
    }
});

export const { setSelectedProvider, setProviderAuthorizationUrl, setproviderList, setConfigOpen, setProviderOpen } = providerState.actions;

export default providerState.reducer;
