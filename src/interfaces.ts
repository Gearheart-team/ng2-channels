
export interface IChannelConfig {
  channel: string;
  actions?: string[];
  filter?: any;
}

export interface IEventData {
  channel: string;
  action: string;
  instance: any;
}

export interface ChannelMessage {
  event: string;
  event_data: IEventData;
}