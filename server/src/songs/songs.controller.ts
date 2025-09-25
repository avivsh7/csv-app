import { Controller, Get, Post, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { SongsService } from './songs.service';
import { Song } from './song.entity';

@Controller('songs')
export class SongsController {
  private readonly logger = new Logger(SongsController.name);

  constructor(private readonly songsService: SongsService) {}

  @Get()
  async findAll(): Promise<Song[]> {
    return this.songsService.findAllSongs();
  }
}