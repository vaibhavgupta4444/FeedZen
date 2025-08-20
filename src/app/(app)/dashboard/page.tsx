'use client'

import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Message, User } from "@/models/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { toast } from "sonner"

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessage: false
    }
  })

  const { control, setValue, watch } = form
  const acceptMessage = watch("acceptMessage")

  // Delete message from UI
  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(message => message._id !== messageId))
  }

  // Fetch if user is accepting messages
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitching(true)
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages")
      setValue("acceptMessage", response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Failed to fetch accept message status")
    } finally {
      setIsSwitching(false)
    }
  }, [setValue])

  // Fetch messages
  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages")
      setMessages(response.data.messages || [])
      if (refresh) toast.success("Showing latest messages")
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Failed to fetch messages")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle switch toggle
  const handleSwitchChange = async () => {
    setIsSwitching(true)
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessage: !acceptMessage
      })
      setValue("acceptMessage", !acceptMessage)
      toast.success(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Failed to update status")
    } finally {
      setIsSwitching(false)
    }
  }

  // Copy profile URL to clipboard
  const username = (session?.user)?.name
  console.log("session",session?.user)
  const baseUrl = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : ""
  const profileUrl = `${baseUrl}/u/${username}`
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success("Saved to clipboard")
  }

  // Initial fetch
  useEffect(() => {
    if (!session || !session.user) return
    fetchAcceptMessage()
    fetchMessages()
  }, [session, fetchAcceptMessage, fetchMessages])

  if (!session || !session.user) return <div>Please login</div>

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      {/* Copy link section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input type="text" value={profileUrl} disabled className="input input-bordered w-full p-2 mr-2" />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      {/* Accept Messages switch */}
      <div className="mb-4 flex items-center space-x-2">
        <Controller
          name="acceptMessage"
          control={control}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitching}
            />
          )}
        />
        <span>Accept Messages: {acceptMessage ? "On" : "Off"}</span>
      </div>

      <Separator />

      {/* Refresh messages button */}
      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault()
          fetchMessages(true)
        }}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
      </Button>

      {/* Messages list */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard key={String(message._id)} message={message} onMessageDelete={handleDeleteMessage} />
          ))
        ) : (
          <p>No messages to display</p>
        )}
      </div>
    </div>
  )
}

export default Page