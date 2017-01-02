import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Channels } from './src/channels.service';


@NgModule({
  imports: [CommonModule]
})
export class ChannelsModule {
  static forRoot(wsurl?: string): ModuleWithProviders {
    return {
      ngModule: ChannelsModule,
      providers: [{
        provide: Channels,
        useFactory: () => new Channels(wsurl),
        deps: []
      }]
    };
  }
}