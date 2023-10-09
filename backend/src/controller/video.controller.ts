import { Body, Controller, Delete, Get, HttpStatus, Param, Post, UseInterceptors, UploadedFiles, Put, Req, Res, Query } from "@nestjs/common";
import { Video } from "../model/video.schema"
import { VideoService } from "../service/video.service";
import { FileFieldsInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { log } from "console";

@Controller('/api/v1/video')
export class VideoController {
    constructor(private readonly videoService: VideoService) { }

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'video', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
    ]))
    async createBook(@Res() response, @Req() request, @Body() video: Video, @UploadedFiles() files: { video?: Express.Multer.File[], cover?: Express.Multer.File[] })
     {
        if (!files.video[0].filename || !files.cover[0].filename || !video.title) {
            const missingFields = [];
            if (!video.title) missingFields.push('Title');
            if (!files.cover[0].filename) missingFields.push('Cover Image');
            if (!files.video[0].filename) missingFields.push('Video');
    
            return response.status(HttpStatus.BAD_REQUEST).json({ message: `The following fields are required: ${missingFields.join(', ')}` });
        }
        const requestBody = { createdBy: request.user, title: video.title, video: files.video[0].filename, coverImage: files.cover[0].filename }
        const newVideo = await this.videoService.createVideo(requestBody);
        return response.status(HttpStatus.CREATED).json({
            newVideo
        })
    }

    @Get()
    async read(@Query() id): Promise<Object> {
        return await this.videoService.readVideo(id);
    }

    @Get('/:id')
    async stream(@Param('id') id, @Res() response, @Req() request) {
        return this.videoService.streamVideo(id, response, request);
    }
    @Put('/:id')
    async update(@Res() response, @Param('id') id, @Body() video: Video) {
        const updatedVideo = await this.videoService.update(id, video);
        return response.status(HttpStatus.OK).json(updatedVideo)
    }

    @Delete('/:id')
    async delete(@Res() response, @Param('id') id) {
        await this.videoService.delete(id);
        return response.status(HttpStatus.OK).json({
            user: `video with ${id} is deleted.`
        })
    }
}