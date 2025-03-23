export interface IUser {
    _id: string;
    email: string;
    name: string;
    phone: string;
    age: string;
    gender: string;
    role: {
        _id: string,
        title: string
    };
    avatar: string;
    permission: {
        _id: string,
        title: string
    }[]
}