import { User } from './user';

export interface UserAnswered{
    user: User;
    answer: string;
}

export interface Answers{
    a: string;
    b: string;
}

export interface Question{
    id: string;
    askedUser: User;
    answers: Answers;
    userAnswered: UserAnswered[];
    createdAt: number;
}