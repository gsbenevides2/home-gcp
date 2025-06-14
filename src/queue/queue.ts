import { openKv } from '@deno/kv'
import { randomUUIDv7 } from 'bun'
import { Logger } from '../logger/index.ts'
import { codespacesStart } from './operations/codespacesStart.ts'
import { codespacesStop } from './operations/codespacesStop.ts'
import { codespacesToggle } from './operations/codespacesToggle.ts'
import { executeSavedPrompt } from './operations/executeSavedPrompt.ts'
import { updateCodespacesSensor } from './operations/updateCodespacesSensor.ts'
import { updateDNSSensors } from './operations/updateDNSSensors.ts'
import { updatePageStatusSensors } from './operations/updatePageStatusSensors.ts'
import { updateSensors } from './operations/updateSensors.ts'
import { updateTrainSensors } from './operations/updateTrainSensors.ts'

export const db = await openKv()

export const publicOperations = [
  'codespaces-start',
  'codespaces-stop',
  'codespaces-toggle',
  'update-train-sensors',
  'update-codespaces-sensor',
  'update-page-status-sensors',
  'update-dns-sensors',
  'update-sensors'
] as const

export const privateOperations = ['execute-saved-prompt'] as const

export type PrivateOperations = (typeof privateOperations)[number]

export type PublicOperations = (typeof publicOperations)[number]

export type Operations = PublicOperations | PrivateOperations

const opFuncs: Record<
  Operations,
  (data: Record<string, unknown>) => Promise<void>
> = {
  'codespaces-start': codespacesStart,
  'codespaces-stop': codespacesStop,
  'codespaces-toggle': codespacesToggle,
  'update-train-sensors': updateTrainSensors,
  'update-codespaces-sensor': updateCodespacesSensor,
  'update-page-status-sensors': updatePageStatusSensors,
  'update-dns-sensors': updateDNSSensors,
  'update-sensors': updateSensors,
  'execute-saved-prompt': executeSavedPrompt
}
interface QueueItem {
  operation: Operations
  data: Record<string, unknown>
}
db.listenQueue(async queueItem => {
  const { operation, data } = queueItem as QueueItem
  const tracerId = randomUUIDv7()
  if (typeof operation !== 'string') {
    Logger.error(
      'Queue',
      'Operation is not a string',
      { operation, data },
      tracerId
    )
    return
  }
  if (!(operation in opFuncs)) {
    Logger.error(
      'Queue',
      'Operation is not a valid operation',
      {
        operation
      },
      tracerId
    )
    return
  }
  Logger.info('Queue', 'Operation received', operation, tracerId)
  try {
    await opFuncs[operation as Operations](data)
    Logger.info('Queue', 'Operation completed', operation)
  } catch (e: unknown) {
    Logger.error(
      'Queue',
      'Operation failed',
      {
        operation,
        error: e
      },
      tracerId
    )
  }
})

export const addToQueue = async (
  operation: Operations,
  data?: Record<string, unknown>
) => {
  await db.enqueue({
    operation,
    data: data ?? {}
  })
}
