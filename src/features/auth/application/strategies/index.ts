import { LocalStrategy } from './local.strategy'
import { JwtStrategy } from './jwt.strategy'

export const strategies = [JwtStrategy, LocalStrategy]
