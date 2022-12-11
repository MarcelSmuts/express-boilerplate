import { createClient } from 'redis'

let _client
const prefix = `${process.env.REDIS_PREFIX}:`

const getRedisClient = () => {
  if (_client) {
    return _client
  }

  // redis[s]://[[username][:password]@][host][:port][/db-number]
  _client = createClient({
    url: process.env.REDIS_CONNECTION_STRING
  })

  _client.on('error', error => {
    console.error('REDIS: ', error)
  })
  return _client
}

export default {
  _getClient: getRedisClient,
  async set (
    key: string,
    value: string,
    expiryTimeInMinutes: number = 7 * 24 * 60 // Default expiry to 1 week
  ): Promise<void> {
    const keyWithPrefix = `${prefix}${key}`
    const client = this._getClient()
    await client.connect()
    await client.set(keyWithPrefix, value, {
      EX: expiryTimeInMinutes * 60
    })
    await client.disconnect()
  },
  async get (key: string): Promise<string> {
    const client = this._getClient()
    await client.connect()
    const value = await client.get(`${prefix}${key}`)
    await client.disconnect()
    return value
  }
}
