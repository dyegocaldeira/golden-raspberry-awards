import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { Movies } from '../../movie/movie.entity';
import { CsvType } from './csv.type';

@Injectable()
export class CsvService {

    private readonly logger = new Logger(CsvService.name);

    public async readCSV(filePath: string): Promise<CsvType[]> {

        if (!this.existFile(filePath)) {
            this.logger.log('File not found');
            return [];
        }

        return new Promise(async (resolve, reject) => {
            const results: CsvType[] = [];
            const separator = process.env.CSV_SEPARATOR || ';';

            fs.createReadStream(filePath)
                .pipe(csv({ separator }))
                .on('data', (data) => {
                    if (this.validateData(data)) {
                        data.winner = Boolean(data.winner && data.winner === 'yes');
                        results.push(data);
                    }
                })
                .on('end', () => resolve(results))
                .on('error', (error) => reject(error));
        });
    }

    private existFile(filePath: string): boolean {
        return fs.existsSync(filePath);
    }

    private validateData(data: Movies): boolean {
        const requiredFields = ['year', 'title', 'studios', 'producers'] as Partial<
            keyof Movies
        >[];
        return requiredFields.every((field) => data[field]);
    }
}
