import { config } from 'dotenv'

config()

export const appSettingsOld = {
  PORT: 3003,
  ACCESS_JWT_SECRET: process.env.ACCESS_JWT_SECRET,
  ACCESS_JWT_EXPIRES: '5h',
  REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET,
  REFRESH_JWT_EXPIRES: '10h',
  MONGO_CONNECTION_URI: process.env.MONGO_CONNECTION_URI,
  DB_NAME: process.env.MONGO_DB_NAME,
  SEND_MAIL_SERVICE_EMAIL: process.env.SEND_MAIL_SERVICE_EMAIL,
  SEND_MAIL_SERVICE_PASSWORD: process.env.SEND_MAIL_SERVICE_PASSWORD,
}

export type EnvironmentVariable = { [key: string]: string | undefined }
export type EnvironmentsTypes = 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION' | 'TESTING'
export const Environments = ['DEVELOPMENT', 'STAGING', 'PRODUCTION', 'TESTING']

export class EnvironmentSettings {
  constructor(private env: EnvironmentsTypes) {}

  getEnv() {
    return this.env
  }

  isProduction() {
    return this.env === 'PRODUCTION'
  }

  isStaging() {
    return this.env === 'STAGING'
  }

  isDevelopment() {
    return this.env === 'DEVELOPMENT'
  }

  isTesting() {
    return this.env === 'TESTING'
  }
}

class AppSettings {
  constructor(
    public env: EnvironmentSettings,
    public api: APISettings,
  ) {}
}

class APISettings {
  // Application
  public readonly APP_PORT: number

  // Database
  public readonly MONGO_CONNECTION_URI: string
  public readonly DB_NAME: string

  constructor(private readonly envVariables: EnvironmentVariable) {
    // Application
    this.APP_PORT = this.getNumberOrDefault(envVariables.APP_PORT, 3003)

    // Database
    this.MONGO_CONNECTION_URI = envVariables.MONGO_CONNECTION_URI ?? 'mongodb://localhost/nest'
    this.DB_NAME = envVariables.MONGO_DB_NAME ?? 'blogs-inc-joyme-local'
  }

  private getNumberOrDefault(value: string, defaultValue: number): number {
    const parsedValue = Number(value)

    if (isNaN(parsedValue)) {
      return defaultValue
    }

    return parsedValue
  }
}

const env = new EnvironmentSettings(
  (Environments.includes(process.env.ENV?.trim()) ? process.env.ENV.trim() : 'DEVELOPMENT') as EnvironmentsTypes,
)

const api = new APISettings(process.env)
export const appSettings = new AppSettings(env, api)
