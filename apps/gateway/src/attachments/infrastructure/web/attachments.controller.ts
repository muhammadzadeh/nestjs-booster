import { Get, Param, Post, Req, StreamableFile } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonController } from '@repo/decorator';
import { FastifyRequest } from 'fastify';
import { extname } from 'path';
import { CurrentUser } from '../../../authentication/infrastructure/web/decorators';
import { AttachmentsService } from '../../application/attachments.service';
import { AttachmentListResponse } from './attachment-list.response';
import { AttachmentVisibilityDto } from './attachment-visibility.dto';
import { DownloadAttachmentDto, DownloadSharedAttachmentDto } from './download-attachment.dto';
import { FilesUploadDto } from './files-upload.dto';

@CommonController('/attachments')
@ApiTags('Attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post(':visibility')
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    status: 201,
    type: AttachmentListResponse,
  })
  @ApiOperation({
    operationId: 'upload',
  })
  @ApiBody({ type: FilesUploadDto })
  async upload(
    @Param() visibilityDto: AttachmentVisibilityDto,
    @CurrentUser() user: CurrentUser,
    @Req() request: FastifyRequest,
  ): Promise<AttachmentListResponse> {
    const uploadedFiles = request.files();

    const attachments = [];
    for await (const file of uploadedFiles) {
      const attachment = await this.attachmentsService.upload({
        file: {
          fileData: file.file,
          originalName: file.filename,
          mimeType: {
            ext: extname(file.filename),
            mime: file.mimetype,
          },
        },
        visibility: visibilityDto.visibility,
        userId: user.id,
        isDraft: false,
      });

      attachments.push(attachment);
    }

    return AttachmentListResponse.from(attachments);
  }

  @ApiOperation({
    operationId: 'download',
  })
  @Get(':id')
  async download(@Param() downloadDto: DownloadAttachmentDto, @CurrentUser() user: CurrentUser) {
    const { attachment, buffer } = await this.attachmentsService.download({
      id: downloadDto.id,
      userId: user.id,
    });

    const encodedFilename = encodeURIComponent(attachment.name.replace(/\s+/g, '+'));

    return new StreamableFile(buffer, {
      type: attachment.mimeType?.mime,
      disposition: `attachment; filename*=UTF-8''${encodedFilename}`,
    });
  }

  @ApiOperation({
    operationId: 'downloadShared',
  })
  @Get('share/:token')
  async downloadShared(@Param() downloadDto: DownloadSharedAttachmentDto) {
    const { attachment, buffer } = await this.attachmentsService.download({
      id: downloadDto.token,
      isShared: true,
    });

    const encodedFilename = encodeURIComponent(attachment.name.replace(/\s+/g, '+'));

    return new StreamableFile(buffer, {
      type: attachment.mimeType?.mime,
      disposition: `attachment; filename*=UTF-8''${encodedFilename}`,
    });
  }
}
