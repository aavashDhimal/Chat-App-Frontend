

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function InputBox({ setMessageInput, messageInput, handleSendMessage }: any) {
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