import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface User {
    _id?: string
    accessToken : string
}

interface Session{
    user : {
        _id? : string
        accessToken : string
        isVerified: boolean
        isAcceptingMessages: boolean
        username: string
    }& DefaultSession['User']
}
}


declare module 'next-auth/JWT' {
    interface JWT {
        _id: string
        accessToken : string
      isVerified: boolean
      isAcceptingMessages: boolean
      username: string
  }
}