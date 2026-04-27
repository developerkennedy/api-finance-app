export interface TokenServicePorts {
    signAccessToken(payload: { sub: string }): string
    verifyAccessToken(token: string): { sub: string }
    hashToken(token: string): string
}