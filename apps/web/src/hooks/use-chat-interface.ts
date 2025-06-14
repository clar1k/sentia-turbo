import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import { mockAPI, type Message, type Chat } from "@/utils/mock-api";

export function useChatInterface() {
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [activeChat, setActiveChat] = React.useState<string>("");
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const promptMutation = useMutation(trpc.prompt.mutationOptions());
  const currentChat = chats.find((chat) => chat.id === activeChat);

  React.useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("ai-chats", JSON.stringify(chats));
    }
  }, [chats, isLoading]);

  React.useEffect(() => {
    const loadChats = async () => {
      try {
        setIsLoading(true);
        const loadedChats = await mockAPI.getChats();
        setChats(loadedChats);
        if (loadedChats.length > 0) {
          setActiveChat(loadedChats[0].id);
        }
      } catch (err) {
        toast.error("Failed to load chats");
        console.error("Error loading chats:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadChats();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const createNewChat = async () => {
    try {
      const newChat = await mockAPI.createChat();
      setChats((prev) => [newChat, ...prev]);
      setActiveChat(newChat.id);
      toast.success("New chat created");
    } catch (err) {
      toast.error("Failed to create new chat");
      console.error("Error creating chat:", err);
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      await mockAPI.deleteChat(chatId);
      setChats((prev) => prev.filter((chat) => chat.id !== chatId));

      if (activeChat === chatId) {
        const remainingChats = chats.filter((chat) => chat.id !== chatId);
        setActiveChat(remainingChats[0]?.id || "");
      }
      toast.success("Chat deleted");
    } catch (err) {
      toast.error("Failed to delete chat");
      console.error("Error deleting chat:", err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeChat || isTyping || promptMutation.isPending)
      return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };

    const messageContent = input.trim();
    setInput("");

    // Add user message to chat
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
              title:
                chat.messages.length === 0
                  ? messageContent.slice(0, 30) +
                    (messageContent.length > 30 ? "..." : "")
                  : chat.title,
              lastMessage: new Date(),
            }
          : chat,
      ),
    );

    setIsTyping(true);

    try {
      const response = await promptMutation.mutateAsync({
        message: messageContent,
      });

      // Check if the response is an error
      if (!response.ok) {
        toast.error("Failed to get AI response");
        return;
      }

      // Create AI message with the response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "text" in response
            ? response.text.value?.text ||
              "I apologize, but I couldn't generate a response."
            : "I apologize, but I couldn't generate a response.",
        role: "assistant",
        timestamp: new Date(),
      };

      // Add AI message to chat
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat
            ? {
                ...chat,
                messages: [...chat.messages, aiMessage],
                lastMessage: new Date(),
              }
            : chat,
        ),
      );
    } catch (err) {
      toast.error("Failed to get AI response");
      console.error("Error getting AI response:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return {
    // State
    chats,
    activeChat,
    input,
    isTyping,
    isLoading,
    currentChat,
    messagesEndRef,

    // Mutation state
    isPending: promptMutation.isPending,

    // Setters
    setActiveChat,
    setInput,

    // Functions
    createNewChat,
    deleteChat,
    sendMessage,
    handleKeyPress,
  };
}
