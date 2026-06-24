import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PoliciesService } from './policies.service';
import { QueryPolicyDto, PolicyParamDto } from './dto/policy.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Policies')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Get()
  @ApiOperation({ summary: '获取我的保单列表' })
  list(@CurrentUser() user: any, @Query() query: QueryPolicyDto) {
    return this.policiesService.findByOwner(user.id, query.status);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取保单详情' })
  detail(@Param('id') id: string) {
    return this.policiesService.findById(Number(id));
  }
}
