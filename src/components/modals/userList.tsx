import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useGetUsersQuery } from "@/services/usersAPI";
import { useCreateRoomMutation } from "@/services/roomApi";

interface UserListModalProps {
    open: boolean
    onClose: (roomId :string) => void
}

export function UserListModal({ open, onClose }: UserListModalProps) {
    const [createRoom] = useCreateRoomMutation();

    async function addNewConversation( id: string ) {
       const data = (await createRoom({ members: [id, localStorage.getItem('uid') || ''] })).data;

        onClose(data._id);
    }

    const { data: users } = useGetUsersQuery({});
    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-md max-h-[400px] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Users</DialogTitle>
                </DialogHeader>

                <div className="mt-4 space-y-2">
                    {users?.length === 0 && (
                        <p className="text-sm text-muted-foreground">No users found.</p>
                    )}
                    {users?.map((user) => (
                        <div
                            onClick={() => addNewConversation(user._id)}
                            key={user.id}
                            className="p-2 border rounded-md flex items-center justify-between gap-3 cursor-pointer hover:bg-accent"
                        >
                            <Avatar className="h-10 w-10">
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                                <div className="font-medium truncate">{user.name}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 text-right">
                    <Button variant="ghost" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
