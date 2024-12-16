export interface ISendOTP {
    email: string,
    otp?: string,
    name?: string,
    template: string,
    subject: string,
    content?: string
}