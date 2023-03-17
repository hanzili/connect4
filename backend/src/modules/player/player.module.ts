import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { PrismaService } from '../../prisma.service';
import { RoomService } from '../room/room.service';

@Module({
  providers: [PlayerService, PrismaService, RoomService],
  controllers: [PlayerController],
  exports: [PlayerService],
})
export class PlayerModule {}