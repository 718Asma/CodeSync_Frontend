export interface User {
    _id: string;
    fullName?: string;
    username?: string;
    password?: string;
    googleId?: string;
    friends?: User[];
    bio?: string;
    occupation?: string;
    profileImage?: string;
    coverImage?: string;
    gender?: string;
    dateOfBirth?: Date;
    address?: string;
    email?: string;
    savedPosts?: string[];
}