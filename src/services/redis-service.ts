import { createClient } from 'redis'
import { promisify } from 'util'

let _client
const prefix = `${process.env.REDIS_PREFIX}:`

const getRedisClient = () => {
  if (_client) {
    return _client
  }

  _client = createClient({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD
  })
  _client.on('error', error => {
    console.error(error)
  })
  _client.getAsync = promisify(_client.get).bind(_client)
  return _client
}

export default {
  _getClient () {
    return getRedisClient()
  },
  async set (
    key: string,
    value: string,
    expiryTimeInMinutes: number = 7 * 24 * 60 // Default expiry to 1 week
  ): Promise<void> {
    const keyWithPrefix = `${prefix}${key}`
    const client = this._getClient()
    return client.set(keyWithPrefix, value, () => {
      client.expire(keyWithPrefix, expiryTimeInMinutes * 60)
    })
  },
  async get (key: string): Promise<string> {
    return this._getClient().getAsync(`${prefix}${key}`)
  }
}
