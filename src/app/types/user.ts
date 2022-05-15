export interface User{
    id: string;
    email: string;
    name: string;
    profilePic: string | null;
    answered: number;
    asked: number;
}