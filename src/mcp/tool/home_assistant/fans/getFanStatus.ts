import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { FanSensors } from '../../../../clients/homeAssistant/MySensors/FanSensors.ts'
import { AbstractTool, type OnErrorToolCallback } from '../../AbstractTool.ts'

const args = {
  roomName: z
    .enum(FanSensors.rooms)
    .describe(
      "The name of the room where the smart fan is installed (e.g., 'Quarto Guilherme', 'Sala', 'Cozinha')"
    )
} as const

type Args = typeof args

export class GetRoomFanStatusTool extends AbstractTool<Args> {
  name = 'get-fan-status'
  description =
    "Retrieves the current velocity in portuguese of a specific room's smart fan eg: 'Quarto Guilherme': 'Alto/Médio/Baixo/Desligado'"
  args = args

  execute: ToolCallback<Args> = async args => {
    const roomName = args.roomName
    const fanState = await FanSensors.getFanRoom(roomName)
    return {
      content: [
        {
          type: 'text',
          text: `The fan in the ${roomName} is ${fanState}`
        }
      ]
    }
  }

  onError: OnErrorToolCallback<Args> = (_error, args) => {
    return {
      content: [
        {
          type: 'text',
          text: `An error occurred while getting the fan status for ${args.roomName}.`
        }
      ]
    }
  }
}
