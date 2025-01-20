import { Text } from "@mantine/core"
import type { MessageProps } from "../types/chat"

export function Message({ message, currentUser }: MessageProps) {
  const isUserMessage = message.user === currentUser
  const formattedTime = new Date(message.timestamp).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })

  return (
    <div className={`message ${isUserMessage ? "message--user" : "message--other"}`}>
     {!isUserMessage && <b>
        {`${message.user} : `}
            &nbsp;
      </b>}
      <div className="message__bubble">
        <Text className="message__content">{message.message}</Text>
        <Text className="message__time">{formattedTime}</Text>
      </div>
      {isUserMessage && <b>
        &nbsp;
        {` : ${message.user}`}
      </b>}
    </div>
  )
}