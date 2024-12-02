import { streamText } from 'ai'
import { groq } from '@ai-sdk/groq'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: groq('llama-3.2-90b-vision-preview'),
    messages: messages,
    temperature: 1,
    maxTokens: 8192,
    topP: 1,
    system: 'Write the system message here',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`
    }
  })

  return result.toDataStreamResponse()
}
