import {Module} from '@nestjs/common';
import {AppService} from './app.service';
import {IpcService} from './services/ipc.service';
import {UtilService} from './services/util.service';
import {SettingsService} from "./services/settings.service";
import {DatabaseService} from "./services/database.service";
import {ServersService} from "./services/servers.service";
import {ServerLogService} from "./services/server-log.service";

@Module({
  imports: [],
  controllers: [],
  providers: [
    AppService,
    IpcService,
    UtilService,
    SettingsService,
    DatabaseService,
    ServersService,
    ServerLogService
  ],
})
export class AppModule {
}
