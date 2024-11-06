import request from 'supertest'
import { HttpStatusCodes } from '../../../../common/models'
import { INestApplication } from '@nestjs/common'
import { DeviceViewDto } from '../../api/models/output/device-view.dto'

export class DevicesTestManager {
  constructor(private readonly app: INestApplication) {}
  httpServer = this.app.getHttpServer()

  async getDevices(refreshToken: string): Promise<DeviceViewDto[]> {
    const response = await request(this.httpServer)
      .get('/api/security/devices')
      .set({ Cookie: `refreshToken=${refreshToken}` })
      .expect(HttpStatusCodes.OK_200)

    return response.body ?? []
  }
}
