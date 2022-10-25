import crypto from 'crypto'

export default (password, salt) => {
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
    .toString(`hex`)

  return hash
}
