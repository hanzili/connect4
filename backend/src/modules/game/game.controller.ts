import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { GameService } from './game.service';
import { Game as GameModel } from '@prisma/client';

@Controller('games')
export class GameController {
  constructor(private readonly GameService: GameService) {}

  @Get()
  async games(): Promise<GameModel[]> {
    return this.GameService.games({});
  }

  @Get(':id')
  async game(@Param('id') id: string): Promise<GameModel> {
    return this.GameService.game({ id: Number(id) });
  }

  @Post()
  async createGame(@Body() data: { roomId: number }): Promise<GameModel> {
    return this.GameService.createGame(data);
  }

  @Put(':id')
  async updateGame(
    @Param('id') id,
    @Body()
    data: {
      column: number;
      userId: number;
    },
  ): Promise<GameModel> {
    return this.GameService.updateGame({
      data: {
        column: data.column,
        userId: data.userId,
      },
      where: { id: Number(id) },
    });
  }

  @Delete(':id')
  async deleteGame(@Param('id') id: string): Promise<GameModel> {
    return this.GameService.deleteGame({ id: Number(id) });
  }
}
