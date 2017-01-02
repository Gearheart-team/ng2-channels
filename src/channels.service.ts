import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import {
  IChannelConfig, IEventData, ChannelMessage
} from './interfaces';
import { WebSocketSubscription } from './websocket.subscription';

export class Channels {
  private subject: WebSocketSubject<any>;

  constructor(private wsurl: string) {
    if (!!this.wsurl) {
      this.connect(this.wsurl);
    }
  }

  public connect(wsurl: string) {
    if (!this.subject) {
      this.subject = <WebSocketSubject<any>>WebSocketSubject.create(
        {
          url: wsurl,
          resultSelector: this.resultSelector
        }
      );
    }
  }

  public subscribe(config: IChannelConfig, handler: Function) {
    this.sendChannelMessage('subscribe', config);
    return new WebSocketSubscription(this.subject, config, handler);
  };

  public publish(event: IEventData) {
    this.sendChannelMessage('sync', event);
  };

  private checkConnection(raiseException: boolean): void {
    if (!this.subject && raiseException) {
      throw Error('The connection is not established.');
    }
  }

  private createChannelsMessage(eventType: string, eventData: any = null): ChannelMessage {
    return {event: eventType, event_data: eventData};
  }

  private sendChannelMessage(eventType: string, eventData: any = null, raiseException: boolean = true): void {
    this.checkConnection(raiseException);
    let msg = this.createChannelsMessage(eventType, eventData);
    this.subject.next(JSON.stringify(msg));
  }

  private resultSelector(e: MessageEvent): ChannelMessage {
    let data = JSON.parse(e.data);
    return {
      event: data.event,
      event_data: data.event_data
    };
  }

}