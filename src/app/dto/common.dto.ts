import { ApiProperty, } from '@nestjs/swagger';
import { Expose, } from 'class-transformer';
import { IsUUID, } from 'class-validator';
import { Request, } from 'express';

export interface RequestAuth extends Request {
  user: {
    userId: string
  };
}

export class AbstractDto {
  @ApiProperty({ description: 'Unique identifier of entity', format: 'uuid', })
  @Expose()
  @IsUUID()
    id!: string;

  
  @ApiProperty({ description: 'Created timestamp', format: 'timestamp', })
  @Expose()
  @IsUUID()
    createdAt!: Date;

  @ApiProperty({ description: 'Updated timestamp', format: 'timestamp', })
  @Expose()
  @IsUUID()
    updatedAt!: Date;
}

// export class OutputEmptyDto {
//   @ApiProperty({
//     type: 'boolean',
//     description: 'Whether the operation was successful',
//   })
//     ok: boolean;
// }

// export class OutputOkDto<Response> {
//   @ApiProperty({
//     type: 'boolean',
//     description: 'Whether the operation was successful',
//   })
//     ok: boolean;

//   @ApiProperty({
//     type: () => AbstractDto,
//   })
//     result: Response;
// }

// class PaginationResultDto<Response> {
//   @ApiProperty({
//     description: 'Number of results',
//   })
//     count: number;

//   @ApiProperty({
//     description: 'Array of results',
//     isArray: true,
//     type: () => AbstractDto,
//   })
//     rows: Response[];
// }

// export class OutputPaginationDto<Response> {
//   @ApiProperty({
//     type: 'boolean',
//     description: 'Whether the operation was successful',
//   })
//     ok: boolean;

//   @ApiProperty({
//     type: () => PaginationResultDto<Response>,
//     description: 'Pagination result',
//   })
//     result: PaginationResultDto<Response>;
// }