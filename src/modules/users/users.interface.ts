export interface IUser {
    _id: string;
    email: string;
    name: string;
    role: {
        _id: string,
        name: string
    };
    avatar: string;
    permission: {
        _id: string,
        name: string
    }[]
}