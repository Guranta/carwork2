import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ClaimsService } from './claims.service';
import { CreateClaimDto, UpdateClaimStatusDto } from './dto/claim.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Claims')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Post()
  @ApiOperation({ summary: '创建理赔报案' })
  create(@CurrentUser() user: any, @Body() dto: CreateClaimDto) {
    return this.claimsService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: '获取我的理赔列表' })
  list(@CurrentUser() user: any, @Query('status') status?: string) {
    return this.claimsService.findByUser(user.id, status);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取理赔详情' })
  detail(@Param('id') id: string) {
    return this.claimsService.findById(Number(id));
  }

  @Post(':id/images')
  @ApiOperation({ summary: '上传事故照片' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 9 }]))
  uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.claimsService.uploadImages(Number(id), files.images || []);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: '更新理赔状态(管理员)' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateClaimStatusDto) {
    return this.claimsService.updateStatus(Number(id), dto);
  }
}
