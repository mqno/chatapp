import { ActionIcon, Loader, Textarea } from "@mantine/core"
import { Send } from "lucide-react"
import { useState } from "react"

interface MessageInputProps {
  username: string | null;
}

export function MessageInput({ username }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!message || !username) return;

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          user: username,
        }),
      });

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (!message.trim() || !username) return
    try {
      await handleSendMessage();
      setMessage("");
      setLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
    }

  };

  return (
    <form onSubmit={handleSubmit} className="input-container">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(e);
          }
        }}
        placeholder="Write a message"
        disabled={loading}
        autosize
        minRows={1}
        maxRows={3}
        styles={{
          root: {
            width: "90%",
          },
          input: {
            backgroundColor: "#1a1a1a",
            border: "none",
            color: "#fff",
            "&::placeholder": {
              color: "#666",
            },
          },
        }}
      />
      <ActionIcon type="submit" variant="filled" color="violet" disabled={!message.trim()} size={36}>
        {loading ? <Loader size="1.1rem" color="white" /> : <Send size="1.1rem" />}
      </ActionIcon>
    </form>
  )
}