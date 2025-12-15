import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState, useRef } from 'react'
import { useGetMessagesQuery } from '@/services/api'
import { socket, connectSocket, joinRoom, leaveRoom, markMessageRead } from '@/socket'
import { useAuth } from '@/context/auth'
// import { io } from 'socket.io-client'

interface Message {
  id: string;
  sender: string;
  content: string;
  createdAt: string;
  status?: string
}

interface MessageBoxProps {
  roomId?: string;
}

export default function MessageBox({ roomId }: MessageBoxProps) {
  const { data: fetchedMessages = [], isLoading } = useGetMessagesQuery(roomId ?? '', { skip: !roomId })
  const [messages, setMessages] = useState<Message[]>([])
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({})
  const [activeUsers, setActiveUsers] = useState<string[]>([])
  const { token } = useAuth()
  const prevRoomRef = useRef<string | undefined>(null)
  // const socketRef = useRef<Socket | null>(null)
  const  currentUserId = localStorage.getItem('uid');
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  // keep messages in sync with fetched data
  useEffect(() => {
    if (fetchedMessages && fetchedMessages.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages(fetchedMessages)
    }
  }, [fetchedMessages])


  // Connect socket when we have a token
  useEffect(() => {
    if (!token) return
    connectSocket(token)
  }, [token])

  // Room join/leave and listeners
  useEffect(() => {
    if (!roomId) return

    // leave previous room
    const prev = prevRoomRef.current
    if (prev && prev !== roomId) {
      leaveRoom(prev)
    }
    prevRoomRef.current = roomId

    // join current room
    joinRoom(roomId)

    const onMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg])
    }

    const onTyping = ({ userId, name, isTyping }: { userId: string; username: string; isTyping: boolean }) => {
      setTypingUsers((prev) => ({ ...prev, [userId]: isTyping }))
      if (isTyping) {
        setTimeout(() => setTypingUsers((p) => ({ ...p, [userId]: false })), 3000)
      }
    }

    const onOnline = ({ userId }: { userId: string }) => {
      setActiveUsers((prev) => Array.from(new Set([...prev, userId])))
    }

    const onOffline = ({ userId }: { userId: string }) => {
      setActiveUsers((prev) => prev.filter((id) => id !== userId))
    }

    const onMessageRead = ({ messageId, userId }: { messageId: string; userId: string }) => {
      setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, status: 'read' } : m)))
    }

    socket.on('message:receive', onMessage)
    socket.on('typing:UserModel', onTyping)
    socket.on('UserModel:online', onOnline)
    socket.on('UserModel:offline', onOffline)
    socket.on('message:read', onMessageRead)

    return () => {
      socket.off('message:receive', onMessage)
      socket.off('typing:UserModel', onTyping)
      socket.off('UserModel:online', onOnline)
      socket.off('UserModel:offline', onOffline)
      socket.off('message:read', onMessageRead)
      // leave room when unmounting or switching
      leaveRoom(roomId)
    }
  }, [roomId])

  // Mark unread messages as read (simple: mark messages not sent by current user)
  useEffect(() => {
    if (!roomId) return
    const uid = localStorage.getItem('uid')
    if (!uid) return

    messages.forEach((m) => {
      if ((m.sender !== uid && m.status !== 'read')) {
        // optimistic update
        setMessages((prev) => prev.map((msg) => (msg.id === m.id ? { ...msg, status: 'read' } : msg)))
        markMessageRead(m.id, roomId)
      }
    })
  }, [messages, roomId])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const viewport = container.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement | null
    if (!viewport) return
    // wait a tick to ensure DOM updated
    const id = window.setTimeout(() => {
      try {
        viewport.scrollTop = viewport.scrollHeight
      } catch (e) {
        // ignore
      }
    }, 50)
    return () => window.clearTimeout(id)
  }, [messages])

  

  return (
    <ScrollArea className="flex-1 overflow-hidden">
      <div className="p-4 space-y-4">
        {isLoading && <div className="text-sm text-muted-foreground">Loading messages...</div>}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === currentUserId
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}

        {Object.entries(typingUsers).map(([userId, isTyping]) =>
          isTyping ? (
            <div key={`typing-${userId}`} className="text-xs text-muted-foreground">
               typing...
            </div>
          ) : null
        )}

     
      </div>
    </ScrollArea>
  );
}