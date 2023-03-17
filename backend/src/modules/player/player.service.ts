import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Player, Prisma, Room } from '@prisma/client';
import { CreatePlayerDTO } from 'src/shared/dto/player/createPlayer';
import { RoomService } from '../room/room.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class PlayerService {
  constructor(private prisma: PrismaService, private room: RoomService) {}

  async players(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PlayerWhereUniqueInput;
    where?: Prisma.PlayerWhereInput;
  }): Promise<Player[]> {
    const { skip, take, cursor, where } = params;
    return this.prisma.player.findMany({
      skip,
      take,
      cursor,
      where,
    });
  }

  async player(
    PlayerWhereUniqueInput: Prisma.PlayerWhereUniqueInput,
  ): Promise<Player | null> {
    return this.prisma.player.findUnique({
      where: PlayerWhereUniqueInput,
    });
  }

  async createPlayer(data: CreatePlayerDTO): Promise<Player> {
    if (data.code != null) {
      const room = await this.prisma.room.findUnique({
        where: { code: data.code },
        include: { players: true },
      });
      if (room.players.length >= 2)
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      return this.prisma.player.create({
        data: {
          name: data.name,
          roomId: room.id,
        },
      });
    }
    return this.prisma.player.create({
      data: {
        name: data.name,
      },
    });
  }

  async updatePlayer(params: {
    where: Prisma.PlayerWhereUniqueInput;
    data: Prisma.PlayerUpdateInput;
  }): Promise<Player> {
    const { where, data } = params;
    return this.prisma.player.update({
      data,
      where,
    });
  }

  async deletePlayer(where: Prisma.PlayerWhereUniqueInput): Promise<Player> {
    return this.prisma.player.delete({
      where,
    });
  }
}
