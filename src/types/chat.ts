export interface ChatMessage {
  _id: string
  message: string
  user: string
  timestamp: string
}

export interface ChatHeaderProps {
  userName: string
  userAvatar: string
  onBackClick: () => void
  onMenuClick: () => void
}



export interface MessageProps {
  message: ChatMessage
  currentUser: string
}
