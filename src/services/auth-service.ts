import GetMember from '../database/queries/members/get-member'
import CreateOTPs from '../database/queries/otps/create-otps'
import GetOTP from '../database/queries/otps/get-otp'
import UseOTP from '../database/queries/otps/use-otp'
import Member from '../models/member'
import communicationService from './communication-service'

async function forgotPassword (email: string): Promise<void> {
  const memberQry = new GetMember({ email })
  const member = await memberQry.execute()

  if (!member) {
    return
  }

  let otpCode
  const existingOTPQry = new GetOTP(member.id)
  const existingOTP = await existingOTPQry.execute()

  if (existingOTP && existingOTP.code) {
    otpCode = existingOTP.code
  } else {
    const createOTPQry = new CreateOTPs(
      [member.id],
      parseInt(
        process.env.FORGOT_PASSWORD_OTP_EXPIRY_IN_MINUTES ||
          '15' /* 15 minutes */
      )
    )
    const newOtps = await createOTPQry.execute()
    otpCode = newOtps[0].code
  }

  communicationService.sendForgotPasswordEmail(email, otpCode, member.firstName)
}

async function validateOTP (otpCode: string): Promise<Member | null> {
  const otpQry = new GetOTP(undefined, otpCode)
  const otp = await otpQry.execute()

  if (!otp || !otp.code || !otp.memberId) {
    return null
  }

  const useOTPQry = new UseOTP(otp.memberId, otp.code)
  await useOTPQry.execute()

  const memberQry = new GetMember({ id: otp.memberId })
  const member = await memberQry.execute()

  if (!member) {
    return null
  }

  return member
}

export default {
  forgotPassword,
  validateOTP
}
