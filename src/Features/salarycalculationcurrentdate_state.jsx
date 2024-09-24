import { createSlice } from '@reduxjs/toolkit';

const dateSlice = createSlice({
    name: 'date',
    initialState: {
        currentDate: '',
    },
    reducers: {
        setCurrentDate: (state, action) => {
            state.currentDate = action.payload;
        },
    },
});

export const { setCurrentDate } = dateSlice.actions;

export default dateSlice.reducer;