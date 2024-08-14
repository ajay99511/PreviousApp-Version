export interface User{
    username : string;
    token : string;
    knownAs : string;
    gender : string;
    photoUrl? : string;
    roles : string[];
}