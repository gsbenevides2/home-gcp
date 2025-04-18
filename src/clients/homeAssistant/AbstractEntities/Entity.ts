import axios, { AxiosInstance } from "npm:axios";

export abstract class Entity<SensorState, SensorAttributes extends EntityAttributes> {
  private entity_id: string;
  private unique_id: string;
  protected attributes: SensorAttributes;
  protected state: SensorState | undefined;
  private sensor_type: string;
  protected api: AxiosInstance;

  protected constructor(sensor_type: SensorType, entity_id: string, unique_id: string, attributes: SensorAttributes) {
    this.entity_id = entity_id;
    this.sensor_type = sensor_type;
    this.unique_id = unique_id;
    this.attributes = attributes;

    const host = Deno.env.get("HA_URL");
    if (!host) throw new Error("HA_URL not set");
    const url = new URL(host);
    url.pathname = `/api`;

    this.api = axios.create({
      baseURL: url.toString(),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${Deno.env.get("HA_TOKEN")}`,
      },
    });
  }

  sendData(state: SensorState): Promise<void> {
    return this.api.post(`/states/${this.entity_id}`, {
      entity_id: this.entity_id,
      unique_id: this.unique_id,
      state,
      attributes: this.attributes,
    });
  }

  async getData(): Promise<StateResponse<SensorState, SensorAttributes>> {
    const response = await this.api.get<StateResponse<SensorState, SensorAttributes>>(`/states/${this.entity_id}`);
    return response.data;
  }

  updateService(domain: string, service: string, data?: Record<string, unknown>) {
    return this.api.post(`/services/${domain}/${service}`, {
      entity_id: this.entity_id,
      ...data,
    });
  }
}

export enum SensorType {
  BINARY_SENSOR = "binary_sensor",
  SENSOR = "sensor",
}

export interface EntityAttributes {
  friendly_name: string;
}

export interface StateResponse<State, Attributes extends EntityAttributes> {
  entity_id: string;
  state: State;
  attributes: Attributes;
  last_changed: string;
  last_reported: string;
  last_updated: string;
  context: {
    id: string;
  };
}
