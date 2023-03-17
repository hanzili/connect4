import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Room, Prisma } from '@prisma/client';
import { CreateRoomDTO } from 'src/shared/dto/room/createRoom';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async rooms(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RoomWhereUniqueInput;
    where?: Prisma.RoomWhereInput;
  }): Promise<Room[]> {
    const { skip, take, cursor, where } = params;
    return this.prisma.room.findMany({
      skip,
      take,
      cursor,
      where,
    });
  }

  async room(
    RoomWhereUniqueInput: Prisma.RoomWhereUniqueInput,
  ): Promise<Room | null> {
    return this.prisma.room.findUnique({
      where: RoomWhereUniqueInput,
    });
  }

  async createRoom(data: Prisma.RoomCreateInput): Promise<Room> {
    const code = this.generateRandomString();
    return this.prisma.room.create({
      data: {
        code: code,
      },
    });
  }

  async updateRoom(params: {
    where: Prisma.RoomWhereUniqueInput;
    data: Prisma.RoomUpdateInput;
  }): Promise<Room> {
    const { where, data } = params;
    return this.prisma.room.update({
      data,
      where,
    });
  }

  async deleteRoom(where: Prisma.RoomWhereUniqueInput): Promise<Room> {
    return this.prisma.room.delete({
      where,
    });
  }

  private generateRandomString(): string {
    const length = 12;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }

    return result;
  }

  async getPlayers(data: { id: number }) {
    const room = await this.prisma.room.findUnique({
      where: { id: data.id },
      include: { players: true },
    });
    const player1 = room.players[0];
    const player2 = room.players[1];
    return [player1,player2];
  }
}
