'use client'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { messageSchema } from "@/schemas/messageSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useState } from "react"

export default function MessageForm() {
  const { username } = useParams<{ username: string }>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    
    setIsSubmitting(true)
    
    try {
      const response = await axios.post('/api/send-messages', {
        username,
        content: data.content,
      })

      toast.success(response.data.message);
      form.reset()
    } catch (error) {
      console.error('Submission error:', error)
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to send message")
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4 text-center">Public Profile Link</h1>
      <div>
        <p className="font-semibold">Send Anonymous Message to {username}</p>
        
       
        <Form {...form}>
          <form 
            onSubmit={(e) => {
              e.preventDefault() 
              form.handleSubmit(onSubmit)(e) // Properly chain the submit handlers
            }}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <textarea
                      className="w-full border rounded p-2 min-h-[120px]"
                      placeholder="Write your message here..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}