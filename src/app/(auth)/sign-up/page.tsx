'use client'
import {zodResolver} from'@hookform/resolvers/zod'
import {useForm} from "react-hook-form"
import * as z from "zod";
import Link  from 'next/link';
import { useEffect, useState } from 'react';
import {  useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation';
import { SignupSchema } from '@/schemas/SignupSchema';
import axios, { AxiosError } from'axios'
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Loader2, { Loader2Icon, LucideLoader2 } from "lucide-react"



const page = () => {
  const [userName,setUserName] = useState('');
  const [userNameMessage,setUserNameMessage]= useState('');
  const [isCheckingUserName,setIsCheckingUserName] = useState(false);
  const [isSubmitting,setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUserName,600);
  const router = useRouter()

  // zod implementation

  const form= useForm<z.infer<typeof SignupSchema>>({
    resolver:zodResolver(SignupSchema),
    defaultValues:{
      userName:'',
      emailId:'',
      password:''
    }
  });

  useEffect(()=>{
      const checkUserNameUnique = async ()=>{
        if(userName){
          setIsCheckingUserName(true)
          setUserNameMessage('')
          try {
          const response =  await axios.get(`/api/check-username-unique?userName=${userName}`);
          console.log(response)
          setUserNameMessage(response.data.message)
          } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            setUserNameMessage(axiosError.response?.data.message|| 'Error checking username')
          }finally{
            setIsCheckingUserName(false)
          }
        }
      };
      checkUserNameUnique()
  },[userName])

const onSubmit = async (data:z.infer<typeof SignupSchema>) =>{
setIsSubmitting(true)
try {

 const response = await axios.post<ApiResponse>('/api/sign-up',data);
 console.log(response)
 toast("success", {
  description:response.data.message
 })

 router.replace(`/verify/${userName}`)
setIsSubmitting(false);
  
} catch (error) {
  const axiosError = error as AxiosError<ApiResponse>;
  setUserNameMessage(axiosError.response?.data.message|| 'something went wrong')
}
}

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
       <div>
        <h1>join feedbackdo</h1>  
       </div>
       <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className='"space-y-6'>
         <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="userName" 
                {...field}
                onChange={(e)=>{
                  field.onChange(e)
                  debounced(e.target.value)
                }} 
                />
               
              </FormControl>
              {userNameMessage}
              {isCheckingUserName && <LucideLoader2 className='animate-spin' />}

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="emailId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>email</FormLabel>
              <FormControl>
                <Input placeholder="www.xyz@gmail.com" 
                {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" 
                {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isSubmitting} className='mt-4 text-center'>{
          isSubmitting?(
            <>
            <Loader2Icon/>
            </>
          ):('Signup')
          }
        </Button>
         </form>
       </Form>
       <div>
       <p>
       Alredy a member ?{''}
       <Link href='/sign-in' className='p-2'> Sign in </Link>
       </p>
       </div>
      </div>
    </div>
  )
}

export default page
