import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState, useRef, useLayoutEffect } from "react"
import { useGetMessagesQuery } from "@/services/api"
import { socket, connectSocket, joinRoom, leaveRoom, markMessageRead } from "@/socket"
import { useAuth } from "@/context/auth"

interface Message {
  id: string
  sender: string
  content: string
  createdAt: string
  status?: string
}

interface MessageBoxProps {
  roomId?: string
}

export default function MessageBox({ roomId }: MessageBoxProps) {
  const { data: fetchedMessages = [], isLoading } = useGetMessagesQuery(roomId ?? "", { skip: !roomId })
  const [messages, setMessages] = useState<any[]>([])
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({})
  const [activeUsers, setActiveUsers] = useState<string[]>([])
  const { token } = useAuth()
  const prevRoomRef = useRef<string | undefined>(undefined)
  const currentUserId = localStorage.getItem("uid")
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const typingTimeoutsRef = useRef<Record<string, number | undefined>>({})

  useEffect(() => {
    if (fetchedMessages.length) {
      setMessages(fetchedMessages)
    }
  }, [fetchedMessages])

  useEffect(() => {
    if (!token) return
    connectSocket(token)
  }, [token])

  useEffect(() => {
    if (!roomId) return

    const prev = prevRoomRef.current
    if (prev && prev !== roomId) {
      leaveRoom(prev)
    }
    prevRoomRef.current = roomId
    joinRoom(roomId)

    const onMessage = (msg: Message) => {
      setMessages(prev => [...prev, msg])
    }

    const onTyping = ({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
      setTypingUsers(prev => ({ ...prev, [userId]: isTyping }))

      const existing = typingTimeoutsRef.current[userId]
      if (existing) {
        window.clearTimeout(existing)
      }

      if (isTyping) {
        const t = window.setTimeout(() => {
          setTypingUsers(p => ({ ...p, [userId]: false }))
          delete typingTimeoutsRef.current[userId]
        }, 1000)
        typingTimeoutsRef.current[userId] = t
      } else {
        delete typingTimeoutsRef.current[userId]
      }
    }

    const onOnline = ({ users }: { users: string[] }) => {
      setActiveUsers(users)
    }

    const onMessageRead = ({ messageId }: { messageId: string; userId: string }) => {
      setMessages(prev =>
        prev.map(m => (m.id === messageId ? { ...m, status: "read" } : m))
      )
    }

    socket.on("message:receive", onMessage)
    socket.on("typing:UserModel", onTyping)
    socket.on("active-list", onOnline)
    socket.on("message:read", onMessageRead)

    return () => {
      socket.off("message:receive", onMessage)
      socket.off("typing:UserModel", onTyping)
      socket.off("active-list", onOnline)
      socket.off("message:read", onMessageRead)
      leaveRoom(roomId)
    }
  }, [roomId])

  useEffect(() => {
    if (!roomId || !currentUserId) return

    messages.forEach(m => {
      if (m.sender !== currentUserId && m.status !== "read") {
        setMessages(prev =>
          prev.map(msg => (msg.id === m.id ? { ...msg, status: "read" } : msg))
        )
        markMessageRead(m.id, roomId)
      }
    })
  }, [messages, roomId, currentUserId])

  useLayoutEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const viewport = container.querySelector(
      '[data-slot="scroll-area-viewport"]'
    ) as HTMLElement | null

    if (!viewport) return
    viewport.scrollTop = viewport.scrollHeight
  }, [messages, typingUsers])

  return (
    <ScrollArea ref={scrollContainerRef} className="flex-1 overflow-hidden">
      <div className="p-4 space-y-4">
        {isLoading && (
          <div className="text-sm text-muted-foreground">Loading messages...</div>
        )}

        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === currentUserId ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${message.sender === currentUserId
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
                }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}

        {Object.entries(typingUsers).map(([userId, isTyping]) =>
          isTyping ? (
            <div key={`typing-${userId}`} className="text-s font-bold text-muted-foreground">
              typing...
            </div>
          ) : null
        )}
      </div>
    </ScrollArea>
  )
}
