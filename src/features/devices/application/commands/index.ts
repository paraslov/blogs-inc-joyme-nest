import { DeleteOtherDevicesCommandHandler } from './delete-other-devices.command'
import { CreateDeviceSessionCommandHandler } from './create-device-session.command'
import { DeleteDeviceCommandHandler } from './delete-device.command'

export const devicesCommandHandlers = [
  DeleteOtherDevicesCommandHandler,
  CreateDeviceSessionCommandHandler,
  DeleteDeviceCommandHandler,
]
