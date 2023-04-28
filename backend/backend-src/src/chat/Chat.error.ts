
export class ValidationError extends Error {
    constructor(message: string) {
        super(message); // (1)
        this.name = "ValidationError"; // (2)
    }
}
