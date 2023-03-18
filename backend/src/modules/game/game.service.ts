import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Game, Prisma, Room } from '@prisma/client';
import { RoomService } from '../room/room.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService, private room: RoomService) {}

  async games(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.GameWhereUniqueInput;
    where?: Prisma.GameWhereInput;
  }): Promise<Game[]> {
    const { skip, take, cursor, where } = params;
    return this.prisma.game.findMany({
      skip,
      take,
      cursor,
      where,
    });
  }

  async game(
    GameWhereUniqueInput: Prisma.GameWhereUniqueInput,
  ): Promise<Game | null> {
    return this.prisma.game.findUnique({
      where: GameWhereUniqueInput,
    });
  }

  async createGame(data: { roomId: number }): Promise<Game> {
    const room = await this.room.room({ id: data.roomId });
    console.log(room);
    if (room.games.length !== 0 && !room.games[room.games.length - 1].winnerId)
      throw new HttpException('Current game has not end', HttpStatus.FORBIDDEN);
    const players = await this.room.getPlayers({ id: data.roomId });
    if (players.length < 2)
      throw new HttpException('Not enough players', HttpStatus.FORBIDDEN);
    const board: number[][] = [];
    for (let i = 0; i < 6; i++) {
      board[i] = [];
      for (let j = 0; j < 7; j++) {
        board[i][j] = -1;
      }
    }
    return this.prisma.game.create({
      data: {
        board: JSON.stringify(board),
        turnId: players[0].id,
        roomId: data.roomId,
      },
    });
  }

  async updateGame(params: {
    where: Prisma.GameWhereUniqueInput;
    data: {
      column: number;
      userId: number;
    };
  }): Promise<Game> {
    const { where, data } = params;
    const game = await this.prisma.game.findUnique({
      where,
      include: { room: true },
    });
    if (game.winnerId)
      throw new HttpException('The game has end', HttpStatus.FORBIDDEN);
    if (data.userId != game.turnId)
      throw new HttpException("Not this user's turn", HttpStatus.FORBIDDEN);
    const players = await this.room.getPlayers({ id: game.roomId });
    let nextId;
    if (players[0].id === game.turnId) nextId = players[1].id;
    else nextId = players[1].id;
    const board = JSON.parse(game.board);
    if (!this.makeMove(board, data.column, data.userId))
      throw new HttpException('invalid move', HttpStatus.FORBIDDEN);
    const winnerId = this.checkEndGame(board);
    return this.prisma.game.update({
      data: {
        winnerId: winnerId,
        turnId: nextId,
        board: JSON.stringify(board),
      },
      where,
    });
  }

  async deleteGame(where: Prisma.GameWhereUniqueInput): Promise<Game> {
    return this.prisma.game.delete({
      where,
    });
  }

  makeMove(board: number[][], column: number, playerId: number): boolean {
    let found = false;
    for (let i = 5; i >= 0; i--) {
      if (board[i][column] == -1) {
        console.log(board[i][column]);
        board[i][column] = playerId;
        found = true;
        break;
      }
    }
    return found;
  }

  checkEndGame(board: number[][]): number | null {
    // Check for horizontal wins
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        if (
          board[row][col] !== -1 &&
          board[row][col] === board[row][col + 1] &&
          board[row][col] === board[row][col + 2] &&
          board[row][col] === board[row][col + 3]
        ) {
          return board[row][col];
        }
      }
    }
    // Check for vertical wins
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 7; col++) {
        if (
          board[row][col] !== -1 &&
          board[row][col] === board[row + 1][col] &&
          board[row][col] === board[row + 2][col] &&
          board[row][col] === board[row + 3][col]
        ) {
          return board[row][col];
        }
      }
    }
    // Check for diagonal wins (top-left to bottom-right)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (
          board[row][col] !== -1 &&
          board[row][col] === board[row + 1][col + 1] &&
          board[row][col] === board[row + 2][col + 2] &&
          board[row][col] === board[row + 3][col + 3]
        ) {
          return board[row][col];
        }
      }
    }
    // Check for diagonal wins (bottom-left to top-right)
    for (let row = 3; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        if (
          board[row][col] !== -1 &&
          board[row][col] === board[row - 1][col + 1] &&
          board[row][col] === board[row - 2][col + 2] &&
          board[row][col] === board[row - 3][col + 3]
        ) {
          return board[row][col];
        }
      }
    }
    // If no winner found, return null
    return null;
  }
}
