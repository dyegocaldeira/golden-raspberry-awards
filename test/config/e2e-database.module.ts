import { Module } from '@nestjs/common';
import { testDatabaseProviders } from './database.providers';

@Module({
    providers: [...testDatabaseProviders],
    exports: [...testDatabaseProviders],
})
export class TestDatabaseModule { }