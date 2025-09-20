import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import csv from 'csv-parser';
import { Song } from './song.entity';

@Injectable()
export class SongsService {
  // Loads the CSV data to the DB only if the DB is empty
  async onModuleInit() {
    try {
      const count = await this.songRepository.count();
      if (count === 0) {
        await this.loadSongsFromCsv();
        this.logger.log('CSV songs loaded to DB.');
      } else {
        this.logger.log('Songs already exist in DB, skipping CSV import.');
      }
    } catch (err) {
      this.logger.error('Error during CSV file import:', err.stack);
    }
  }
  private readonly logger = new Logger(SongsService.name);

  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
  ) {}

  // Reads the data from the song_list.csv file
  // transforms it, and saves it to the database
  async loadSongsFromCsv(): Promise<void> {
    this.logger.log('Starting CSV import process...');
    const songsToSave: Song[] = [];
    const csvFilePath = './song_list.csv';

    try {
      await new Promise<void>((resolve, reject) => {
        fs.createReadStream(csvFilePath)
          .pipe(csv({ separator: ';' }))
          .on('data', (row) => {
            // Converting CSV file to lowercase
            const song = this.songRepository.create({
              band: row.Band ? row.Band.toLowerCase() : '',
              song_name: row['Song Name'] ? row['Song Name'].toLowerCase() : '',
              year: row.Year ? parseInt(row.Year) : null,
            });
            songsToSave.push(song);
          })
          .on('end', async () => {
            await this.saveSongsToDb(songsToSave);
            resolve();
          })
          .on('error', (err) => {
            this.logger.error('Error reading CSV file:', err.stack);
            reject(err);
          });
      });
    } catch (err) {
      this.logger.error('An error occurred during CSV processing:', err.stack);
      throw new Error('Failed to process CSV file.');
    }
  }

  private async saveSongsToDb(songs: Song[]): Promise<void> {
    try {
      await this.songRepository.save(songs);
      this.logger.log(`Successfully saved ${songs.length} songs to the database.`);
    } catch (err) {
      this.logger.error('Error saving songs to database:', err.stack);
      throw new Error('Failed to save songs to the database.');
    }
  }

  //  Retrieves all songs from the database, ordered by band name from a to z.
  async findAllSongs(): Promise<Song[]> {
    try {
      return await this.songRepository.find({ order: { band: 'ASC' } });
      
    } catch (err) {
      this.logger.error('Error fetching songs from database:', err.stack);
      throw new Error('Failed to retrieve songs.');
    }
  }
}