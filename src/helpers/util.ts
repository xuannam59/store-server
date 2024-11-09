import bcrypt from "bcrypt";
const saltRounds = 10

export const hashPasswordHelper = (password: string): string => {
    try {
        return bcrypt.hashSync(password, saltRounds);
    } catch (error) {
        console.log(error)
    }
}

export const comparePasswordHelper = (password: string, hash: string): Boolean => {
    try {
        return bcrypt.compareSync(password, hash);
    } catch (error) {
        console.log(error)
    }
}
