import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import {
  availableLightsNames,
  TuyaLight,
  type AvailableLightsNames
} from '../../../../clients/homeAssistant/MySensors/TuyaLight.ts'
import { AbstractTool, type OnErrorToolCallback } from '../../AbstractTool.ts'

const args = {
  roomName: z
    .enum(availableLightsNames)
    .describe(
      "The name of the room where the smart light is installed (e.g., 'bedroom', 'living_room')"
    ),
  brightness: z
    .number()
    .describe('The desired percentage of  brightness of the lamp (0-100)')
} as const

type Args = typeof args

export class SetRoomLampBrightnessTool extends AbstractTool<Args> {
  name = 'set-room-light-brightness'
  description = "Set the brightness of a specific room's smart light"
  args = args

  execute: ToolCallback<Args> = async args => {
    await TuyaLight.setLightBrightness(
      args.roomName as unknown as AvailableLightsNames,
      args.brightness as unknown as number
    )
    return {
      content: [
        {
          type: 'text',
          text: `The light in the ${args.roomName} has ${args.brightness}% brightness`
        }
      ]
    }
  }

  onError: OnErrorToolCallback<Args> = (_error, args) => {
    return {
      content: [
        {
          type: 'text',
          text: `An error occurred while setting the light brightness for ${args.roomName}.`
        }
      ]
    }
  }
}
