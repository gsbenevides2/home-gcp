import { Entity, type EntityAttributes, SensorType } from './Entity.ts'

export class Switch<GenericAttributtes extends SensorAttributes> extends Entity<
  SensorState,
  GenericAttributtes
> {
  constructor(
    entity_id: string,
    unique_id: string,
    attributes: GenericAttributtes
  ) {
    super(SensorType.SWITCH, entity_id, unique_id, attributes)
  }

  turnOn() {
    return this.updateService('switch', 'turn_on')
  }

  turnOff() {
    return this.updateService('switch', 'turn_off')
  }
}

type SensorState = 'on' | 'off'

export enum SensorDeviceClass {
  SWITCH = 'switch'
}

export interface SensorAttributes extends EntityAttributes {
  device_class?: SensorDeviceClass
}
