import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { DecodedTokenDto } from '../api/models/utils/decoded-token.dto'

@Injectable()
export class DevicesService {
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
