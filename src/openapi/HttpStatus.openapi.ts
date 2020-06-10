import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class HttpStatusDoc {
  @ApiProperty({ enum: HttpStatus, default: HttpStatus.OK })
  statusCode: HttpStatus;
  @ApiProperty()
  message: string;
}

export class HttpStatusUnauthorizedDoc extends HttpStatusDoc {
  @ApiProperty({ default: HttpStatus.UNAUTHORIZED })
  statusCode: HttpStatus;
  @ApiProperty()
  message: string;
}

export class HttpStatusNotFoundDoc extends HttpStatusDoc {
  @ApiProperty({ default: HttpStatus.NOT_FOUND })
  statusCode: number;
  @ApiProperty()
  message: string;
}

export class HttpStatusCreatedDoc extends HttpStatusDoc {
  @ApiProperty({ default: HttpStatus.CREATED })
  statusCode: number;

  @ApiProperty()
  message: string;
}
