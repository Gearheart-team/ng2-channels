import { Subscription } from 'rxjs/Rx';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';

import * as _ from 'lodash';

import { IChannelConfig, ChannelMessage, IEventData } from './interfaces';


export class WebSocketSubscription {
  public $subscription: Subscription;
  private config: IChannelConfig;

  constructor(private subject: WebSocketSubject<any>, config: IChannelConfig, handler: Function) {
    this.subscribe(config, handler);
  }

  subscribe(config: IChannelConfig, handler: any): WebSocketSubscription {
    if (this.$subscription) {
      this.unsubscribe();
    }
    this.config = config;
    this.$subscription = this.subject
      .map((message: ChannelMessage) => message.event_data)
      .filter((responseMessage: IEventData) => responseMessage.channel === this.config.channel
        && (!this.config.actions || this.config.actions.indexOf(responseMessage.action) !== -1)
        && _.isMatch(responseMessage.instance, this.config.filter)
      )
      .subscribe(handler);

    return this;
  }

  unsubscribe() {
    if (this.$subscription) {
      this.$subscription.unsubscribe();
    }
  }
}
