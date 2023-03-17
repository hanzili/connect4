import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomModule } from './modules/room/room.module';
import { PlayerModule } from './modules/player/player.module';
import { GameModule } from './modules/game/game.module';

@Module({
  imports: [RoomModule,PlayerModule,GameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
