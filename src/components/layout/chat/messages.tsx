import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  status?: string
}

interface MessageBoxProps {
  messages: Message[];
}

export default function MessageBox({ messages }: MessageBoxProps) {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === 'You'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm">{message.text}</p>
            <span>  <p className="text-xs opacity-70 mt-1">{message.timestamp} {message.status}</p>  </span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}