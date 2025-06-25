"use client"
import axios from 'axios'
import {toast} from  'sonner' 
import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, Mail, Lock, User} from "lucide-react"
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isCreatorLogin, setIsCreatorLogin] = useState(false)

  const toggleForm = () => {
    setIsLogin(!isLogin)
  }

  const toggleCreatorLogin = () => {
    setIsCreatorLogin(!isCreatorLogin)
  }

 

  return (
    <div className="flex min-h-screen w-full">
      {/* Image Section */}
      <div className="hidden md:block w-1/2 bg-slate-100 relative">
        <Image src="data:image/jpeg;base64,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" alt="Login cover" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
          <h2 className="text-2xl font-bold mb-2">{isLogin ? "Welcome back" : "Join our community"}</h2>
          <p className="text-sm text-white/80 max-w-md">
            {isLogin
              ? "Sign in to access your account and continue your journey with us."
              : "Create an account to get started and explore all our features."}
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold">
              {isLogin ? (isCreatorLogin ? "Creator Login" : "Welcome back") : "Create an account"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isLogin ? "Please enter your details to sign in." : "Enter your information to get started."}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {isLogin ? (
              <LoginForm
                key="login"
                isCreator={isCreatorLogin}
                onToggleCreator={toggleCreatorLogin}
                onSignUpClick={toggleForm}
              />
            ) : (
              <SignupForm key="signup" onLoginClick={toggleForm} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

interface LoginFormProps {
  isCreator: boolean
  onToggleCreator: () => void
  onSignUpClick: () => void
}

function LoginForm({ isCreator, onToggleCreator, onSignUpClick }: LoginFormProps) {
  const [email , setEmail ] = useState("");
  const [password , setPassword ] = useState("");
  const router = useRouter()
  async function handleLogin(e : any ){
    e.preventDefault();

    interface loginData{
      email : string,
      password : string
    }
    
    const data : loginData = {
      email : email,
      password  : password
    }

    const response = await signIn("credentials" , {email  ,  password , redirect : false});
      console.log(response);
      
  };

  const {data : session } = useSession();
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="email" onChange={(e) => setEmail(e.target.value)} type="email" placeholder="name@example.com" className="pl-10" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Button variant="link" className="p-0 h-auto text-sm font-normal" onClick={(e) => e.preventDefault()}>
              Forgot password?
            </Button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="password"  onChange={(e) => setPassword(e.target.value)}type="password" className="pl-10" />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="text-sm font-normal">
            Remember me
          </Label>
        </div>

        <Button type="submit" className="w-full" onClick={handleLogin}>
          Sign in
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <Button  className="w-full" type='button' onClick={() => signIn("google")}>
        
          Login With Google
        </Button>

        <div className="text-center">
          <Button
            variant="link"
            className="text-sm"
            onClick={(e) => {
              e.preventDefault()
              window.location.href = "https://www.google.com"
            }}
          >
            Login as creator
          </Button>
        </div>

        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto text-sm font-normal"
            onClick={(e) => {
              e.preventDefault()
              onSignUpClick()
            }}
          >
            Sign up
          </Button>
        </div>
      </form>
    </motion.div>
  )
};

interface SignupFormProps {
  onLoginClick: () => void
};

function SignupForm({ onLoginClick }: SignupFormProps) {

  const [acceptedTerms , setAcceptedTerms] = useState(false);
  const [fullname , setFullname] = useState("");
  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");
  interface signup{
    fullName : string,
    email : string,
    password : string
  }

  const router = useRouter();

  async function handleSignup(e : any){
    if(!acceptedTerms){
      toast.error("Please accept the terms and conditions");
      return;
    }
    e.preventDefault();
    const data : signup = {
      fullName : fullname,
      email : email,
      password : password
    }
    const response = await axios.post("/api/v1/signup" , data);
    if(response.data.success){
      toast.success(response.data.message + ` ${response.data.user}`);
      // router.push("/login")
    }else{
      toast.error(response.data.message);
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="name" onChange={(e) => setFullname(e.target.value)} type="text" placeholder="John Doe" className="pl-10" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="signup-email" onChange={(e) => setEmail(e.target.value)} type="email" placeholder="name@example.com" className="pl-10" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="signup-password" onChange={(e) => setPassword(e.target.value)} type="password" className="pl-10" />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="terms" onCheckedChange={() => setAcceptedTerms(!acceptedTerms)}/>
          <Label htmlFor="terms" className="text-sm font-normal">
            I agree to the{" "}
            <Button variant="link" className="p-0 h-auto text-sm font-normal">
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button variant="link" className="p-0 h-auto text-sm font-normal">
              Privacy Policy 
            </Button>
          </Label>
        </div>

        <Button type="submit" onClick={handleSignup} className="w-full">
          Create account
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto text-sm font-normal"
            onClick={(e) => {
              e.preventDefault()
              onLoginClick()
            }}
          >
            Sign in
          </Button>
        </div>
      </form>
    </motion.div>
  )
};

