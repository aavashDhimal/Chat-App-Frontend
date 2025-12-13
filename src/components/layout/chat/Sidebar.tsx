import React from 'react';
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
import { useAuth } from '@/context/auth';

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  messages: Array<{
    id: string;
    sender: string;
    text: string;
    timestamp: string;
  }>;
}

interface SideBarProps {
  conversations: Conversation[];
  selectedConversation: Conversation;
  onSelectConversation: (conversation: Conversation) => void;
  onAddConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export default function SideBar({
  conversations,
  selectedConversation,
  onSelectConversation,
  onAddConversation,
}: SideBarProps) {


  const { logout } = useAuth();

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

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {conversations.map((conversation) => (
                <SidebarMenuItem key={conversation.id}>
                  <SidebarMenuButton
                    isActive={selectedConversation.id === conversation.id}
                    onClick={() => onSelectConversation(conversation)}
                    className="flex items-center gap-3 h-14"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage color="white" alt={conversation.name} />
                      <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <div className="font-medium truncate">{conversation.name}</div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-sm text-center cursor-pointer hover:bg-muted rounded-md" onClick={logout}>
          Logout
        </div>
      </SidebarFooter>
    </Sidebar>
  );
} 