export interface Nodes {
    name: string,
    identifier: string;
    id: string,
    host: string,
    port: number,
    password: string,
    retryAmount: number,
    retryDelay: number,
    secure: boolean
}