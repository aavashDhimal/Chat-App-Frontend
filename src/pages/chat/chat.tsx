import { useState, useEffect, useMemo, useRef } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import SideBar from '@/components/layout/chat/Sidebar';
import MessageBox from '@/components/layout/chat/messages';
import InputBox from '@/components/layout/chat/InputBox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { startTyping, stopTyping, sendMessage, socket } from '@/socket';
import { UserListModal } from '@/components/modals/userList';
import { useNavigate, useSearchParams } from 'react-router';
import { useGetRoomsQuery } from '@/services/roomApi';
// interface Message {
//   id: string;
//   sender: string;
//   text: string;
//   timestamp: string;
//   status?: string
// }

interface Conversation {
  _id: string;
  name: string;
  reciverId?: string;
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation>();
  const [messageInput, setMessageInput] = useState('');
  const [usersList, setisUserListModalOpen] = useState(false);
  const [activeUserIds, setActiveUserIds] = useState<string[]>([]);

  const roomListData = useGetRoomsQuery({});
  const roomList = useMemo(() => roomListData.data || [], [roomListData.data]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (roomList?.length > 0 && !selectedConversation) {
      const paramRoomId = searchParams.get('roomId');

      let selectedRoom: Conversation | undefined;

      if (paramRoomId) {
        // Find room matching the roomId from params
        selectedRoom = roomList.find((room: Conversation) => room._id === paramRoomId);
      }

      // Fall back to first room if paramRoomId not found or not provided
      if (!selectedRoom) {
        selectedRoom = roomList[0];
        navigate(`?roomId=${roomList[0]?._id}`)
      }

      setSelectedConversation(selectedRoom);
    }
  }, [roomList, navigate, selectedConversation, searchParams])

  useEffect(() => {
    const onActiveList = (data: { users: string[] }) => {
      setActiveUserIds(data.users || [])
    }

    socket.on('active-list', onActiveList)

    return () => {
      socket.off('active-list', onActiveList)
    }
  }, []);

  useEffect(() => {
    if (usersList === false) {
      roomListData.refetch();
    }
  }, [usersList])

  const handleModalClose = (roomId?: string) => {
    setSelectedConversation(roomList.find(r => r._id === roomId));
    setisUserListModalOpen(false)
  }

  const typingTimerRef = useRef<number | null>(null)
  const typingSentRef = useRef(false)

  useEffect(() => {
    if (!selectedConversation?._id) return
    try {
      if (messageInput && messageInput.trim().length > 0) {
        if (!typingSentRef.current) {
          startTyping(selectedConversation._id)
          typingSentRef.current = true
        }

        if (typingTimerRef.current) window.clearTimeout(typingTimerRef.current)
        typingTimerRef.current = window.setTimeout(() => {
          stopTyping(selectedConversation._id)
          typingSentRef.current = false
        }, 2000)
      } else {
        if (typingSentRef.current) {
          stopTyping(selectedConversation._id)
          typingSentRef.current = false
        }
      }
    } catch (err) {
      // ignore
    }
  }, [messageInput, selectedConversation?._id])

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    // send via socket helper (require to avoid module order issues)
    if (selectedConversation?._id) {
      try {

        sendMessage({ roomId: selectedConversation._id, content: messageInput, type: 'text' })
        stopTyping(selectedConversation._id)
      } catch (err) {
        // ignore send errors here
      }
    }

    setMessageInput('');
  };

  return (
    <>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <SideBar
            setisUserListModalOpen={setisUserListModalOpen}
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
            onAddConversation={() => setisUserListModalOpen(true)}
          />

          <main className="flex-1 flex flex-col bg-background">
            <div className="border-b p-4 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{selectedConversation?.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{selectedConversation?.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {activeUserIds.includes(selectedConversation?.reciverId || '') ? 'Active now' : 'Offline'}
                </p>
              </div>
            </div>

            <MessageBox roomId={selectedConversation?._id} />

            <InputBox
              messageInput={messageInput}
              setMessageInput={setMessageInput}
              handleSendMessage={handleSendMessage}
            />
          </main>
        </div>
      </SidebarProvider>
      {usersList && <UserListModal open={usersList} onClose={handleModalClose}
      />}
    </>
  );
}