import { streamText } from 'ai'
import { groq } from '@ai-sdk/groq'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: groq('llama-3.2-90b-vision-preview'),
    messages: messages,
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`
    }
  })

  return result.toDataStreamResponse()
}
