export class APIError extends Error {
    constructor(error: string) {
        super(`[DomainError]: ${error}`);
        this.name = "APIError";
    }
}