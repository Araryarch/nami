'use client'

import { useChat } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useRef, useEffect, useMemo } from 'react'
import rehypeRaw from 'rehype-raw'

export default function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: chatIsLoading
  } = useChat({
    api: '/api/completion'
  })

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

  const renderContent = useMemo(() => {
    return (content: string) => {
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
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <div className='flex flex-col h-screen bg-background'>
      <div className='flex-grow overflow-y-auto p-4 px-20 space-y-5'>
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-md ${
              m.role === 'user'
                ? 'bg-muted text-right'
                : 'bg-background text-foreground'
            } w-fit max-w-[50vw] result ${m.role === 'user' ? 'ml-auto' : ''}`}
          >
            {chatIsLoading &&
            m.role !== 'user' &&
            m.id === messages[messages.length - 1]?.id ? (
              <div className='flex space-x-2'>
                <div className='w-2.5 h-2.5 bg-muted rounded-full animate-pulse'></div>
                <div className='w-2.5 h-2.5 bg-muted rounded-full animate-pulse delay-100'></div>
                <div className='w-2.5 h-2.5 bg-muted rounded-full animate-pulse delay-200'></div>
              </div>
            ) : (
              renderContent(m.content)
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className='px-20 py-5 flex gap-2 justify-center'>
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onInput={handleInputResize}
          placeholder='Type your message...'
          rows={1}
          className='resize-none max-w-[60vw] text-foreground bg-background border-muted focus:ring-2 focus:ring-primary'
        />
        <Button onClick={handleSubmit}>Send</Button>
      </div>
    </div>
  )
}
