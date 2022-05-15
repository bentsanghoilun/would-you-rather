import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { Question } from '../types/question'


interface QuestionState{
    questions: Question[]
}

const initState: QuestionState = {
    questions: []
}

export const questionsSlice = createSlice({
    name: 'questions',
    initialState: initState,
    reducers: {
        setQuestions: (state, action: PayloadAction<Question[]>) => {
            state.questions = action.payload
        }
    }
})

export const selectQuestions = (state: RootState) => state.questions.questions;
export const selectMyQuestions = (state: RootState) => { 
    return state.questions.questions.filter(question => 
        question.askedUser.id === state.authUser.authUser?.id
    )
};
export const selectAnsweredQuestions = (state: RootState) => {
    return state.questions.questions.filter(question => 
        question.askedUser.id !== state.authUser.authUser?.id &&
        question.userAnswered.filter(item => item.user.id === state.authUser.authUser?.id).length !== 0
    )
}
export const selectUnansweredQuestions = (state: RootState) => {
    return state.questions.questions.filter(question => 
        question.askedUser.id !== state.authUser.authUser?.id &&
        question.userAnswered.filter(item => item.user.id === state.authUser.authUser?.id).length === 0
    )
}
export const selectQuestion = (id: string) => (state: RootState) => state.questions.questions.find(q => q.id === id);

export const { setQuestions } = questionsSlice.actions

export default questionsSlice.reducer;