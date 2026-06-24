import { Module } from '@nestjs/common';
import { RepairShopsController } from './repair-shops.controller';
import { RepairShopsService } from './repair-shops.service';
import { MapModule } from '../map/map.module';

@Module({
  imports: [MapModule],
  controllers: [RepairShopsController],
  providers: [RepairShopsService],
  exports: [RepairShopsService],
})
export class RepairShopsModule {}
