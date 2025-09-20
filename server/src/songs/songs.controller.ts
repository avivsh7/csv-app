import { Controller, Get, Post, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { SongsService } from './songs.service';
import { Song } from './song.entity';

@Controller('songs')
export class SongsController {
  private readonly logger = new Logger(SongsController.name);

  constructor(private readonly songsService: SongsService) {}

  @Post('load-from-csv')
  @HttpCode(HttpStatus.OK)
  async loadSongsFromCsv(): Promise<{ message: string }> {
    try {
      await this.songsService.loadSongsFromCsv();
      return { message: 'CSV data has been successfully loaded into SQL.' };
    } catch (err) {
      this.logger.error('Failed to load songs from CSV', err.stack);
      return { message: 'Failed to load songs from CSV.' };
    }
  }

  @Get()
  async findAll(): Promise<Song[]> {
    return this.songsService.findAllSongs();
  }
}