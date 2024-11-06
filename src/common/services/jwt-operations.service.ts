import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

export class DecodedTokenDto {
  username: string
  sub: string
  deviceId: string
  iat: number
  exp: number
}

@Injectable()
export class JwtOperationsService {
  constructor(private jwtService: JwtService) {}

  decodeRefreshToken(refreshToken: string): DecodedTokenDto | null {
    try {
      const decoded = this.jwtService.decode(refreshToken)

      return decoded
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  }
}
