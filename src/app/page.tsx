'use client'

import { useChat } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { MessageCircle, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import rehypeRaw from 'rehype-raw'

type Role = 'system' | 'user' | 'assistant' | 'data'

interface Message {
  id: string
  role: Role
  content: string
}

interface ChatHistory {
  id: string
  title: string
  messages: Message[]
}

export default function Chat() {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>(() => {
    const savedHistory = localStorage.getItem('chatHistory')
    return savedHistory ? JSON.parse(savedHistory) : []
  })

  const [currentChatId, setCurrentChatId] = useState<string | null>(null)

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading: chatIsLoading
  } = useChat({ api: '/api/completion' })

  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      setIsLoading(lastMessage.role === 'assistant' && chatIsLoading)
    }
  }, [messages, chatIsLoading])

  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return
  }, [])

  useEffect(() => {
    const container = messagesContainerRef.current
    container?.addEventListener('scroll', handleScroll)
    return () => container?.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const createNewChat = useCallback(() => {
    const newChatId = crypto.randomUUID()
    const newChat: ChatHistory = {
      id: newChatId,
      title: 'New Chat',
      messages: []
    }

    setChatHistory((prev) => [...prev, newChat])
    setCurrentChatId(newChatId)
    setMessages([])
  }, [setMessages])

  const selectChat = (chatId: string) => {
    const selectedChat = chatHistory.find((chat) => chat.id === chatId)
    if (selectedChat) {
      setCurrentChatId(chatId)
      setMessages(selectedChat.messages)
    }
  }

  const deleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId))

    if (currentChatId === chatId) {
      createNewChat()
    }
  }

  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      setChatHistory((prev) => {
        return prev.map((chat) => {
          if (chat.id === currentChatId) {
            const updatedChat = { ...chat, messages }
            if (messages[0]?.content && messages[0]?.content !== chat.title) {
              updatedChat.title = messages[0].content.slice(0, 30) || 'New Chat'
            }

            if (
              JSON.stringify(updatedChat.messages) !==
              JSON.stringify(chat.messages)
            ) {
              return updatedChat
            }
          }
          return chat
        })
      })
    }
  }, [messages, currentChatId])

  useEffect(() => {
    if (chatHistory.length === 0) {
      createNewChat()
    } else if (!currentChatId) {
      setCurrentChatId(chatHistory[chatHistory.length - 1].id)
      setMessages(chatHistory[chatHistory.length - 1].messages)
    }
  }, [chatHistory, currentChatId, createNewChat, setMessages])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInputResize = () => {
    if (textareaRef.current) {
      const newHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(newHeight, 200)}px`
    }
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const renderContent = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]+?)\n```/g
    const parts = content.split(codeBlockRegex)

    return parts.map((part, index) => {
      if (index % 3 === 2) {
        const language = parts[index - 1] || 'bash'
        return (
          <SyntaxHighlighter
            key={index}
            style={nightOwl}
            language={language}
          >
            {part.trim()}
          </SyntaxHighlighter>
        )
      }

      return (
        <ReactMarkdown
          key={index}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {part}
        </ReactMarkdown>
      )
    })
  }

  return (
    <div className='flex flex-row min-h-screen w-full'>
      <div className='w-[18%] px-5 py-4 bg-secondary'>
        <h1 className='font-semibold mb-4'>Next Chatbot Template</h1>
        <Button
          onClick={createNewChat}
          className='my-4 w-full bg-primary text-background hover:bg-primary/80'
        >
          + New Chat
        </Button>
        <div className='space-y-2'>
          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className='flex items-center'
            >
              <button
                onClick={() => selectChat(chat.id)}
                className={`w-full text-left p-2 rounded-md bg-secondary hover:bg-background flex items-center ${
                  currentChatId === chat.id ? 'bg-muted' : ''
                }`}
              >
                <MessageCircle className='mr-2 w-4 h-4' />
                {chat.title || 'New Chat'}
              </button>
              <Button
                variant='ghost'
                size='icon'
                onClick={(e) => deleteChat(chat.id, e)}
                className='ml-2 text-destructive hover:bg-destructive/10'
              >
                <Trash2 className='w-4 h-4' />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className='flex flex-col h-screen bg-background flex-1 box-border relative'>
        <div
          ref={messagesContainerRef}
          className='flex-grow overflow-y-auto p-4 px-20 space-y-5'
        >
          {messages.map((m, index) => (
            <div
              key={m.id}
              className={`p-3 rounded-md ${
                m.role === 'user'
                  ? 'bg-muted text-right'
                  : 'bg-background text-foreground'
              } max-w-fit ${m.role === 'user' ? 'ml-auto' : ''}`}
            >
              {isLoading && index === messages.length - 1 ? (
                <Skeleton className='h-12 w-4/5' />
              ) : (
                renderContent(m.content)
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className='px-20 py-5 flex gap-2'>
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onInput={handleInputResize}
            placeholder='Type your message...'
            rows={1}
            className='resize-none w-full text-foreground bg-background border-muted focus:ring-2 focus:ring-primary'
          />
          <Button onClick={handleSubmit}>Send</Button>
        </div>
      </div>
    </div>
  )
}
