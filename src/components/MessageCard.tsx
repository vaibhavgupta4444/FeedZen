'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Message } from "@/models/User"
import axios from "axios"
import { toast } from "sonner"
import { X } from "lucide-react"
import { ApiResponse } from "@/types/ApiResponse"

type MessageCardProps = {
  message: Message
  onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-message?messageId=${message._id}`)
      toast.success(response.data.message)
      onMessageDelete(message.id)
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete message.")
    }
  }

  return (
    <Card className="w-full shadow-md border rounded-2xl p-4">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-lg font-semibold">{message.content}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            {new Date(message.createdAt).toLocaleString()}
          </CardDescription>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-100">
              <X className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this message?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Are you sure you want to permanently delete this message?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>

      <CardContent className="text-sm text-gray-600">
        {/* Optional: Add more message metadata or display formatting here */}
      </CardContent>
    </Card>
  )
}

export default MessageCard
