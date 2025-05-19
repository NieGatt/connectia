export interface IgoogleUser {
    sort: "GOOGLE",
    email: string,
    firstName: string,
    lastName: string,
    image?: string,
    isVerified: boolean;
}