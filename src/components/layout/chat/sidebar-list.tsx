

export const initialConversations = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    messages: [
      { id: '1', sender: 'Alice Johnson', text: 'Hey! How are you?', timestamp: '10:30 AM' },
      { id: '2', sender: 'You', text: 'I\'m good! How about you?', timestamp: '10:32 AM' },
      { id: '3', sender: 'Alice Johnson', text: 'Great! Just finished that project.', timestamp: '10:33 AM' ,status :'Read'},
    ],
  },
  {
    id: '2',
    name: 'Bob Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    messages: [
      { id: '1', sender: 'Bob Smith', text: 'Did you see the game last night?', timestamp: '9:15 AM' },
      { id: '2', sender: 'You', text: 'Yes! It was amazing!', timestamp: '9:20 AM' },
    ],
  },
  {
    id: '3',
    name: 'Carol White',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol',
    messages: [
      { id: '1', sender: 'Carol White', text: 'Meeting at 3 PM today?', timestamp: '8:00 AM' },
    ],
  },
];