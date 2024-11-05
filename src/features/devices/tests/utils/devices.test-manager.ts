import { JwtService } from '@nestjs/jwt'
import { DecodedTokenDto } from '../../api/models/utils/decoded-token.dto'
import request from 'supertest'
import { HttpStatusCodes } from '../../../../common/models'
import { INestApplication } from '@nestjs/common'
import { DeviceViewDto } from '../../api/models/output/device-view.dto'

export class DevicesTestManager {
  constructor(
    private readonly app: INestApplication,
    private jwtService: JwtService,
  ) {}
  httpServer = this.app.getHttpServer()

  decodeRefreshToken(refreshToken: string): DecodedTokenDto | null {
    try {
      const decoded = this.jwtService.decode(refreshToken)

      return decoded
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  }

  async getDevices(refreshToken: string): Promise<DeviceViewDto[]> {
    const response = await request(this.httpServer)
      .get('/api/security/devices')
      .set({ Cookie: `refreshToken=${refreshToken}` })
      .expect(HttpStatusCodes.OK_200)

    return response.body ?? []
  }
}
