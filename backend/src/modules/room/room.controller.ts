import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { Room as RoomModel } from '@prisma/client';
import { CreateRoomDTO } from 'src/shared/dto/room/createRoom';

@Controller('Rooms')
export class RoomController {
  constructor(private readonly RoomService: RoomService) {}

  @Get()
  async rooms(): Promise<RoomModel[]> {
    return this.RoomService.rooms({});
  }

  @Get(':id')
  async room(@Param('id') id: string): Promise<RoomModel> {
    return this.RoomService.room({ id: Number(id) });
  }

  @Post()
  async createRoom(@Body() data): Promise<RoomModel> {
    return this.RoomService.createRoom(data);
  }

  @Put(':id')
  async updateRoom(
    @Param('id') id: string,
    @Body()
    params: { code: string },
  ): Promise<RoomModel> {
    return this.RoomService.updateRoom({
      data: { code: params.code },
      where: { id: Number(id) },
    });
  }

  @Delete(':id')
  async deleteRoom(@Param('id') id: string): Promise<RoomModel> {
    return this.RoomService.deleteRoom({ id: Number(id) });
  }
}
