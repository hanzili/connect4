import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PrismaService } from '../../prisma.service';
import { RoomService } from '../room/room.service';

@Module({
  providers: [GameService, PrismaService, RoomService],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {}