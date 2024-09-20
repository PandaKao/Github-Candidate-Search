// TODO: Create an interface for the Candidate objects returned by the API
export default interface Candidate {
    name: string | null;
    login: string;
    avatar_url: string;
    email: string | null;
    location: string | null;
    company: string | null;
    bio: string | null;
}