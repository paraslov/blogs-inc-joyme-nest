import { LocalStrategy } from './local.strategy'
import { JwtStrategy } from './jwt.strategy'
import { SaStrategy } from './sa-strategy'
import { RefreshTokenStrategy } from './refresh-token.strategy'

export const strategies = [JwtStrategy, LocalStrategy, SaStrategy, RefreshTokenStrategy]
