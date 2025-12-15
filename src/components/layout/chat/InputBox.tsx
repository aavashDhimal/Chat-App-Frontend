

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface InputBoxProps {
  messageInput: string;
  setMessageInput: (value: string) => void;
  handleSendMessage: () => void;
}

export default function InputBox({ setMessageInput, messageInput, handleSendMessage }: InputBoxProps) {
    return (
        <div className="border-t p-4">
            <div className="flex gap-2">
                <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage();
                        }
                    }}
                    className="flex-1"
                />
                <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}