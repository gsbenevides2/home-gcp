import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { SendDiscordMessageTool } from './discord/sendMessage.ts'
import { MovimentDetectionTool } from './home_assistant/camera/movimentDetection.ts'
import { ChangeCodespacesStatusTool } from './home_assistant/codespaces/changeStatus.ts'
import { GetCodespacesStatusTool } from './home_assistant/codespaces/getStatus.ts'
import { GetRoomFanStatusTool } from './home_assistant/fans/getFanStatus.ts'
import { ChangeFanStatusTool } from './home_assistant/fans/setFanStatus.ts'
import { GetRoomLampTool } from './home_assistant/lamps/getRoomLamp.ts'
import { GetRoomLampBrightnessTool } from './home_assistant/lamps/getRoomLampBrightness.ts'
import { SetRoomLampTool } from './home_assistant/lamps/setRoomLamp.ts'
import { SetRoomLampBrightnessTool } from './home_assistant/lamps/setRoomLampBrightness.ts'
import { GetPiholeStatusTool } from './home_assistant/pihole/getStatus.ts'
import { SetPiholeStatusTool } from './home_assistant/pihole/setStatus.ts'
import { GetIdOfPlataformsTool } from './home_assistant/platform_status/getIdOfPlataforms.ts'
import { GetPlatformStatusTool } from './home_assistant/platform_status/getStatus.ts'
import { GetSpotifyData } from './home_assistant/spotify/getData.ts'
import { MakeSpotifyOperation } from './home_assistant/spotify/makeOperation.ts'
import { PlaySong } from './home_assistant/spotify/playSong.ts'
import { SearchSong } from './home_assistant/spotify/searchSong.ts'
import { GetTrainStatus } from './home_assistant/train/getStatus.ts'
import { GetStreamerStatusTool } from './home_assistant/twicth/getStatus.ts'
import { GetStreamerIdsTool } from './home_assistant/twicth/getStreamerIds.ts'
import { StartDeviceTool } from './home_assistant/wakeOnLan/startDevice.ts'
import { MarkdownfyWebpage } from './markdownfy/webpage.ts'

import { SendEmailTool } from './email/sendEmail.ts'
import { CreateEventTool } from './google/calendar/createEvent.ts'
import { DeleteEventTool } from './google/calendar/deleteEvent.ts'
import { ListCalendars } from './google/calendar/listCalendars.ts'
import { ListEvents } from './google/calendar/listEvents.ts'
import { UpdateEventTool } from './google/calendar/updateEvent.ts'
import { GetMultiplePlatformStatusTool } from './home_assistant/platform_status/getMultipleStatus.ts'
import { AddObservationsTool } from './memory/addObservations.ts'
import { CreateEntitiesTool } from './memory/createEntities.ts'
import { CreateRelationsTool } from './memory/createRelations.ts'
import { DeleteEntitiesTool } from './memory/deleteEntities.ts'
import { DeleteObservationsTool } from './memory/deleteObservations.ts'
import { DeleteRelationsTool } from './memory/deleteRelations.ts'
import { OpenNodesTool } from './memory/openNodes.ts'
import { ReadGraphTool } from './memory/readGraph.ts'
import { SearchNodesTool } from './memory/searchNodes.ts'
import { ChangeJobTool } from './scheduller/changeJob.ts'
import { CreateJobTool } from './scheduller/createJob.ts'
import { CurrentTimeTool } from './scheduller/currentTime.ts'
import { DeleteJobTool } from './scheduller/deleteJob.ts'
import { ListJobTool } from './scheduller/listJob.ts'

export const toolList = [
  new GetRoomLampTool(),
  new SetRoomLampTool(),
  new GetTrainStatus(),
  new GetCodespacesStatusTool(),
  new ChangeCodespacesStatusTool(),
  new SetRoomLampBrightnessTool(),
  new GetRoomLampBrightnessTool(),
  new GetRoomFanStatusTool(),
  new ChangeFanStatusTool(),
  new GetPiholeStatusTool(),
  new SetPiholeStatusTool(),
  new MovimentDetectionTool(),
  new GetStreamerIdsTool(),
  new GetStreamerStatusTool(),
  new GetPlatformStatusTool(),
  new GetIdOfPlataformsTool(),
  new GetMultiplePlatformStatusTool(),
  new StartDeviceTool(),
  new GetSpotifyData(),
  new MakeSpotifyOperation(),
  new SearchSong(),
  new PlaySong(),
  new SendDiscordMessageTool(),
  new CreateJobTool(),
  new ChangeJobTool(),
  new ListJobTool(),
  new DeleteJobTool(),
  new CurrentTimeTool(),
  new MarkdownfyWebpage(),
  new CreateEntitiesTool(),
  new CreateRelationsTool(),
  new AddObservationsTool(),
  new DeleteEntitiesTool(),
  new DeleteObservationsTool(),
  new DeleteRelationsTool(),
  new ReadGraphTool(),
  new SearchNodesTool(),
  new OpenNodesTool(),
  new SendEmailTool(),
  new ListCalendars(),
  new ListEvents(),
  new CreateEventTool(),
  new DeleteEventTool(),
  new UpdateEventTool()
]

export function registerTools(server: McpServer) {
  toolList.forEach(tool => {
    tool.serverRegister(server)
  })
}
