// import { CreatorModel, EditorModel } from "@/user.modal/user.model";
// import dbConnect from "@/utils/dbConnect";
// import bcrypt from "bcryptjs";
// import NextAuth from "next-auth"
// import Credentials from "next-auth/providers/credentials"
// import Google from "next-auth/providers/google"
// import { NextResponse } from "next/server";
 
// export const { signIn, signOut, auth , handlers } = NextAuth({
//   providers: [
//     Credentials({
//       credentials: {
//         email: { label: "email" },
//         password: { label: "password", type: "password" },
//       },
//       async authorize(credential) {
        
//         await dbConnect();
//         const user = await EditorModel.findOne({email : credential.email });
//         if(user){
//           const isValid = await bcrypt.compare(credential.password as string , user.password );
//           if(isValid) return user;
//           else throw new Error("Please enter valid credentials");
//         }else{
//            console.log("user not found");
//            return null;
//         };
//       },
//     }),

//     Google({
//       authorization : {
//         params : {
//           prompt: "consent",
//           access_type: "offline",
//           response_type: "code",
//         }
//       }
//     })

    
//   ],callbacks : {
//     async signIn({profile , user , account}){
//         if(account?.provider == "google"){
//           console.log("Google Account : " , account);
//           // console.log("Profile : " , profile);

//           try {
//             await dbConnect();

//             const existsUser = await CreatorModel.findOne({email : profile?.email as string});
//             if(!existsUser){
//               await CreatorModel.create({
//                 email :  profile?.email as string,
//                 password : account.access_token as string,
//                 profileURL : profile?.picture as string,
//                 editorList : [],
//                 requests : []
//               })
//             }
//               return true;
//           } catch (error) {
//             return false;
//           }
//         }

//       return true;
//     },
//     async jwt({token , user } ){
//       if(user){
//         token.email = user.email;
//       }
//       return token;
//     },
//     async session({token , session}){
//         if(token){
//           session.user.email = token.email
//         }
//         return session;
//     }
//   }
// })


// export const {GET, POST } = handlers