import { Body, Controller, Delete, Get, HttpStatus, Param, Post, UseInterceptors, UploadedFiles, Put, Req, Res, Query } from "@nestjs/common";
import { Video } from "../model/video.schema"
import { VideoService } from "../service/video.service";
import { FileFieldsInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { response } from "express";

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
            if (!files.cover || !files.cover?.[0]) missingFields.push('Cover Image');
            if (!files.video || !files.video?.[0]) missingFields.push('Video');
            if(!video.tag) missingFields.push('Add atleast one tag');
            
            return response.status(HttpStatus.BAD_REQUEST).json({ message: `The following fields are required: ${missingFields.join(', ')}` });
        }
        const requestBody = { createdBy: request.user, title: video.title, video: files.video[0].filename, coverImage: files.cover[0].filename, tag: video.tag }
        const newVideo = await this.videoService.createVideo(requestBody);
        return response.status(HttpStatus.CREATED).json({
            newVideo
        })
    }

    @Get()
    async read(@Query('tag') tag:string, @Res() response): Promise<Object> {
        if (tag) {
            const data = await this.videoService.readVideosByTag(tag);
            return response.status(HttpStatus.OK).json(data);
          } else {
            const data = await this.videoService.readAllVideos()
            return response.status(HttpStatus.OK).json(data);
          }
    }

    @Get()
    async metadata(@Query('id') id:string, @Res() response): Promise<Object>{
        // console.log(id,'id');
        const data = await this.videoService.readVideobyId(id);
        return response.status(HttpStatus.OK).json(data);
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
    async delete(@Res() response, @Param('id') id, @Req() request) {
        const data = await this.videoService.delete(id,request);
        return response.json({  
            data: data
        })
    }
}