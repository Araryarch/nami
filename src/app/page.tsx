'use client'

import { useChat } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ArrowDownCircle } from 'lucide-react'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import rehypeRaw from 'rehype-raw'

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: chatIsLoading
  } = useChat({
    api: '/api/completion'
  })

  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [isScrolledUp, setIsScrolledUp] = useState(false)

  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return

    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current
    const scrollPosition = scrollTop + clientHeight
    const atBottom = scrollHeight - scrollPosition < 100

    setIsScrolledUp(!atBottom)
  }, [])

  useEffect(() => {
    const container = messagesContainerRef.current
    container?.addEventListener('scroll', handleScroll)

    return () => {
      container?.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    })
  }, [])

  useEffect(() => {
    if (!isScrolledUp) {
      scrollToBottom()
    }
  }, [messages, isScrolledUp, scrollToBottom])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInputResize = () => {
    if (textareaRef.current) {
      const newHeight = textareaRef.current.scrollHeight
      if (textareaRef.current.style.height !== `${newHeight}px`) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = `${Math.min(newHeight, 200)}px`
      }
    }
  }

  useEffect(() => {
    setIsLoading(chatIsLoading)
  }, [chatIsLoading])

  const renderContent = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]+?)\n```/g

    const parts = content.split(codeBlockRegex)
    return parts.map((part, index) => {
      if (index % 3 === 2) {
        const language = parts[index - 1] || 'bash'
        const code = part.trim()
        return (
          <SyntaxHighlighter
            key={index}
            style={nightOwl}
            language={language}
          >
            {code}
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
    <div className='flex flex-col h-screen bg-background max-w-full box-border'>
      <div
        ref={messagesContainerRef}
        className='flex-grow overflow-y-auto p-4 px-20 space-y-5'
      >
        {messages.map((m, index) =>
          m.role === 'user' ? (
            <div
              key={m.id}
              className='p-3 rounded-md bg-muted text-right text-foreground max-w-fit ml-auto'
            >
              {renderContent(m.content)}
            </div>
          ) : (
            <div
              key={m.id}
              className={`p-3 rounded-md bg-background text-left text-foreground max-w-fit mr-auto ${
                isLoading && index === messages.length - 1 ? 'hidden' : ''
              }`}
            >
              {renderContent(m.content)}
            </div>
          )
        )}

        {isLoading && (
          <div className='w-full flex justify-start'>
            <div className='p-3 rounded-md bg-muted text-foreground min-w-[70vw] animate-pulse'>
              <Skeleton className='w-64 h-8 mb-2 animate-pulse' />
              <Skeleton className='w-48 h-8 animate-pulse' />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {messages.length > 0 && isScrolledUp && (
        <div className='fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50'>
          <Button
            variant='secondary'
            onClick={scrollToBottom}
            className='p-2 rounded-full bg-background text-foreground shadow-md hover:bg-background/80'
          >
            <ArrowDownCircle size={24} />
          </Button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className='flex p-4 border-t justify-center'
      >
        <div className='max-w-2xl w-full flex'>
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onInput={handleInputResize}
            placeholder='Ask here...'
            disabled={isLoading}
            className='flex-grow p-2 border text-foreground rounded-md overflow-hidden resize-none max-h-[200px]'
            rows={1}
          />
          <Button
            type='submit'
            disabled={isLoading}
            className='ml-2 bg-primary text-background hover:bg-primary/80'
          >
            Kirim
          </Button>
        </div>
      </form>
    </div>
  )
}
