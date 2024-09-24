import { createSlice } from "@reduxjs/toolkit";


const forgotSlice = createSlice({
    name: 'forgotpassword',
    initialState: {
        value: {
            email: null

        }
    },

    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload;
        }
    }
})

export const { setEmail } = forgotSlice.actions;

export default forgotSlice.reducer;