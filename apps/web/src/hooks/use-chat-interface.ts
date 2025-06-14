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
  const testStreamingMutation = useMutation(
    trpc.testStreaming.mutationOptions(),
  );
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
    if (
      !input.trim() ||
      !activeChat ||
      isTyping ||
      testStreamingMutation.isPending
    )
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
      // Call the streaming API without parameters
      const streamResponse = await testStreamingMutation.mutateAsync();

      // Create an initial AI message that will be updated as we stream
      const aiMessageId = (Date.now() + 1).toString();
      const initialAiMessage: Message = {
        id: aiMessageId,
        content: "",
        role: "assistant",
        timestamp: new Date(),
      };

      // Add the initial empty AI message
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat
            ? {
                ...chat,
                messages: [...chat.messages, initialAiMessage],
                lastMessage: new Date(),
              }
            : chat,
        ),
      );

      // Handle streaming text
      let accumulatedText = "";

      // Stream the text chunks
      for await (const chunk of streamResponse.textStream) {
        accumulatedText += chunk;

        // Update the AI message with accumulated text
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === activeChat
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) =>
                    msg.id === aiMessageId
                      ? { ...msg, content: accumulatedText }
                      : msg,
                  ),
                  lastMessage: new Date(),
                }
              : chat,
          ),
        );
      }

      // Get final text as fallback
      const finalText = await streamResponse.text;

      // Final update with complete text (in case streaming missed anything)
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat
            ? {
                ...chat,
                messages: chat.messages.map((msg) =>
                  msg.id === aiMessageId
                    ? {
                        ...msg,
                        content:
                          finalText ||
                          accumulatedText ||
                          "I apologize, but I couldn't generate a response.",
                      }
                    : msg,
                ),
                lastMessage: new Date(),
              }
            : chat,
        ),
      );
    } catch (err) {
      toast.error("Failed to get AI response");
      console.error("Error getting AI response:", err);

      // Remove the empty AI message on error
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat
            ? {
                ...chat,
                messages: chat.messages.filter(
                  (msg) => msg.id !== (Date.now() + 1).toString(),
                ),
              }
            : chat,
        ),
      );
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
    isPending: testStreamingMutation.isPending,

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
