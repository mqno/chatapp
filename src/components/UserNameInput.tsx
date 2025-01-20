import { ActionIcon, Loader, TextInput } from "@mantine/core"
import { PlusCircle } from "lucide-react"
import { useState } from "react"

interface UserNameInputProps {
  setUserInfo: (text: string) => void;
  user: string | null;
}

export function UserNameInput({ setUserInfo, user }: UserNameInputProps) {
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState(user)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (!username) return
    try {
      await setUserInfo(username);
      localStorage.setItem('registeredAs', username);
      setLoading(false);
    } catch (error) {
      console.error('Error register issue:', error);
      setLoading(false);
    }

  };

  return (
    <form onSubmit={handleSubmit} className="input-container">
      <TextInput
        value={username || ''}
        onChange={(e) => setUsername(e.target.value)}
        placeholder= "Enter your username"
        disabled={loading}
        rightSection={
          <ActionIcon type="submit" variant="filled" color="violet" disabled={!(username || '').trim()}>
            {loading ? <Loader  /> : <PlusCircle size="1.1rem" />}
          </ActionIcon>
        }
        styles={{
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
    </form>
  )
}