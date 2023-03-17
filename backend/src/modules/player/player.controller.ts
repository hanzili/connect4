import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { PlayerService } from './player.service';
import { Player as PlayerModel } from '@prisma/client';
import { CreatePlayerDTO } from 'src/shared/dto/player/createPlayer';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get()
  async players(): Promise<PlayerModel[]> {
    return this.playerService.players({});
  }

  @Get(':id')
  async player(@Param('id') id: string): Promise<PlayerModel> {
    return this.playerService.player({ id: Number(id) });
  }

  @Post()
  async createPlayer(@Body() data: CreatePlayerDTO): Promise<PlayerModel> {
    return this.playerService.createPlayer(data);
  }

  @Put(':id')
  async updatePlayer(
    @Param('id') id,
    @Body()
    data: {
      name: string;
      roomId: number;
    },
  ): Promise<PlayerModel> {
    return this.playerService.updatePlayer({
      data: {
        name: data.name,
        room: {
          connect: { id: data.roomId },
        },
      },
      where: { id: id },
    });
  }

  @Delete(':id')
  async deletePlayer(@Param('id') id: string): Promise<PlayerModel> {
    return this.playerService.deletePlayer({ id: Number(id) });
  }
}
