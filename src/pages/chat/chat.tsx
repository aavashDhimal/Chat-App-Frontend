import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import SideBar from '@/components/layout/chat/Sidebar';
import MessageBox from '@/components/layout/chat/messages';
import InputBox from '@/components/layout/chat/InputBox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { initialConversations } from '@/components/layout/chat/sidebar-list';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  status?: string
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  messages: Message[];
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(conversations[0]);
  const [messageInput, setMessageInput] = useState('');

  const handleAddConversation = () => {
    const newName = prompt('Enter conversation name:');
    if (!newName) return;

    const newConversation: Conversation = {
      id: Date.now().toString(),
      name: newName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newName}`,
      messages: [],
    };

    const updatedConversations = [...conversations, newConversation];
    setConversations(updatedConversations);
    setSelectedConversation(newConversation);
  };

  const handleDeleteConversation = (id: string) => {
    const filtered = conversations.filter(c => c.id !== id);
    setConversations(filtered);
    if (selectedConversation.id === id && filtered.length > 0) {
      setSelectedConversation(filtered[0]);
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      text: messageInput,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      status : 'Delivered'
    };

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return { ...conv, messages: [...conv.messages, newMessage] };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setSelectedConversation({
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMessage],
    });

    setMessageInput('');
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <SideBar
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
          onAddConversation={handleAddConversation}
          onDeleteConversation={handleDeleteConversation}
        />

        <main className="flex-1 flex flex-col bg-background">
          <div className="border-b p-4 flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
              <AvatarFallback>{selectedConversation.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{selectedConversation.name}</h2>
              <p className="text-xs text-muted-foreground">Active now</p>
            </div>
          </div>

          <MessageBox messages={selectedConversation.messages} />

          <InputBox
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            handleSendMessage={handleSendMessage}
          />
        </main>
      </div>
    </SidebarProvider>
  );
}