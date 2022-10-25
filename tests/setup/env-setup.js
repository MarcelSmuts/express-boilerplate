const port = '1000'
const host = '0.0.0.1'

process.env.PORT = port
process.env.HOST = host
process.env.JWT_SECRET = 'secret'

export default {
  port,
  host
}
