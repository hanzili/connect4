import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { PrismaService } from '../../prisma.service';
import { PlayerService } from '../player/player.service';

@Module({
  providers: [RoomService, PrismaService],
  controllers: [RoomController],
  exports: [RoomService],
})
export class RoomModule {}