'use client'

import { useChat } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: '/api/completion'
    })

  return (
    <div className='flex flex-col h-screen mx-auto bg-background'>
      <div className='flex-grow overflow-y-auto p-4 space-y-4'>
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-md ${
              m.role === 'user'
                ? 'bg-muted text-right text-foreground' // User's message with muted background
                : 'bg-accent text-left text-foreground' // Bot's message with accent background
            }`}
          >
            {m.content}
          </div>
        ))}
        {isLoading && (
          <div className='flex justify-center'>
            <div className='w-6 h-6 border-4 border-t-primary border-transparent rounded-full animate-spin' />
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className='flex p-4 border-t justify-center'
      >
        <div className='max-w-2xl w-full flex'>
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder='Tulis pesan...'
            disabled={isLoading}
            className='flex-grow p-2 border text-foreground rounded-md'
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
