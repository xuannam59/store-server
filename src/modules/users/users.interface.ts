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
    permissions: {
        _id: string,
        method: string,
        module: string,
        apiPath: string
    }[]
}