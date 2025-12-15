import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/services/authApi"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "@/slices/authSlice";



export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {


  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, error }] = useLoginMutation()

  const dispatch = useDispatch()
  const handleSubmit = async () => {
    try {
      const res = await login({ email, password }).unwrap();
      console.log(res,"res")
      dispatch(setToken(res))  ;
      console.log("here")
          navigate("/chat")
    } catch (err) {
      console.error("Login failed", err)
    }
  }
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to Start Chatting</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="jhondoe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password" >Password</FieldLabel>
          </div>
          <Input id="password" type="password" required onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <Field>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>Login</Button>
          {error && <p className="text-sm text-red-600 mt-2">Login failed. Please check your credentials.</p>}
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a href="/register" className="underline underline-offset-4">
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
