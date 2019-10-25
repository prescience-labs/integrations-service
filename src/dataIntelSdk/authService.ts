import uuid = require('uuid')
import Axios from 'axios'
import { settings } from '../config/settings'

interface ICreateUser {
  email: string
  password?: string
}

interface ILogInUser {
  email: string
  password?: string
}

export default class AuthServiceSdk {
  private static authorizationHeader = {
    Authorization: `Basic ${settings.authService.clientId}:${settings.authService.secretKey}`,
  }
  public static async createUser({ email, password = uuid.v4() }: ICreateUser) {
    const { data } = await Axios.post(
      `${settings.authService.url}/users`,
      { email, password },
      {
        headers: {
          ...AuthServiceSdk.authorizationHeader,
        },
      },
    )
    return data
  }

  public static async forceLogIn({ email }: ILogInUser) {
    const {
      data: { token },
    } = await Axios.post(
      `${settings.authService.url}/token/force`,
      { email },
      { headers: { ...AuthServiceSdk.authorizationHeader } },
    )
    return token
  }

  public static async logIn({ email, password }: ILogInUser) {
    const { data } = await Axios.post(
      `${settings.authService.url}/token`,
      { email, password },
      { headers: { ...AuthServiceSdk.authorizationHeader } },
    )
    return data
  }
}
