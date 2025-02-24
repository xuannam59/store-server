export interface ISendMail {
    email: string,
    data: any
    name?: string,
    template: string,
    subject: string,
    content?: string
}