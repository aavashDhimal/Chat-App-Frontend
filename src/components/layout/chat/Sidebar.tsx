import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/auth';
import { useNavigate } from 'react-router-dom';
import { useGetRoomsQuery } from '@/services/roomApi';
import { socket } from '@/socket';
// ...existing code...

interface Rooms {
  _id: string;
  name: string;
  reciverId?: string;
}

interface SideBarProps {
  selectedConversation: Rooms | null;
  setisUserListModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectConversation: (conversation: Rooms) => void;
  onAddConversation: () => void;
}

export default function SideBar({
  selectedConversation,
  onSelectConversation,
  onAddConversation,
}: SideBarProps) {
  // ...existing code...
  const { logout } = useAuth();
  const rooms = useGetRoomsQuery({}).data || [];
  const navigate = useNavigate();
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const currentUserId = localStorage.getItem('uid');

  useEffect(() => {
    const onActive = (data: any) => {
      console.log(data,"users")
      setActiveUsers(data.users);
    };


    socket.on('active-list', onActive);

    return () => {
      socket.off('active-list', onActive);
    };
  }, []);

  return (
    <Sidebar collapsible="none" className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <Button
            size="sm"
            variant="ghost"
            onClick={onAddConversation}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-hidden">
        <ScrollArea className="h-full">
          <SidebarGroup>
            <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {rooms?.map((conversation: Rooms) => {
                  // const isActive = selectedConversation?._id === conversation._id;
                  // const isUnread = !!(
                  //   conversation.unread ||
                  //   (conversation.unreadCount && conversation.unreadCount > 0)
                  // );


                  const isOnline = activeUsers.includes(conversation.reciverId);

                  return (
                    <SidebarMenuItem key={conversation._id}>
                      <SidebarMenuButton
                        isActive={isOnline}
                        onClick={() => {
                          onSelectConversation(conversation);
                          navigate(`?roomId=${conversation._id}`);
                        }}
                        className="flex items-center gap-3 h-14"
                      >
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage color="white" alt={conversation.name} />
                            <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                          </Avatar>

                          {isOnline && (
                            <span
                              className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-white"
                              aria-hidden="true"
                            />
                          )}
                        </div>

                        <div className="flex-1 overflow-hidden">
                          {/* <div className={`${isUnread ? 'font-bold' : 'font-medium'} truncate`}> */}
                            {conversation.name}
                          {/* </div> */}
                          {isOnline && (
                            <div className="text-xs text-muted-foreground truncate">Online</div>
                          )}
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-sm text-center cursor-pointer hover:bg-muted rounded-md" onClick={logout}>
          Logout
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}