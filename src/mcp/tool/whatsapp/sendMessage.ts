import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { WhatsAppClient } from '../../../clients/WhatsApp'
import { AbstractTool, type OnErrorToolCallback } from '../AbstractTool'

const args = {
  to: z
    .number()
    .describe(
      'The phone number in format 5511972839087 to send the message to'
    ),
  message: z.string().describe('The message to send')
}

export class SendWhatsAppMessageTool extends AbstractTool<typeof args> {
  name = 'send-whatsapp-message'
  description = 'Send a message to a WhatsApp number'
  args = args

  execute: ToolCallback<typeof args> = async args => {
    const whatsAppInstance = await WhatsAppClient.getInstance()
    const connectResult = await whatsAppInstance.connect()
    if (connectResult === 'awaitingForAuthentication') {
      return {
        content: [
          {
            type: 'text',
            text: 'WhatsApp is not connected, please connect to WhatsApp to send a message'
          }
        ]
      }
    }
    await whatsAppInstance.sendMessage(args.to, args.message)
    await whatsAppInstance.release()
    return {
      content: [{ type: 'text', text: 'Message sent successfully' }]
    }
  }

  onError: OnErrorToolCallback<typeof args> = () => {
    return {
      content: [{ type: 'text', text: 'Error sending message' }]
    }
  }
}
