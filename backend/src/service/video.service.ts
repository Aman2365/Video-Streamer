import {
    ForbiddenException,
    Injectable,
    NotFoundException,
    ServiceUnavailableException,
    UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Video, VideoDocument } from "../model/video.schema";
import { createReadStream, statSync } from 'fs';
import { join } from 'path';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';

@Injectable()
export class VideoService {

    constructor(@InjectModel(Video.name) private videoModel: Model<VideoDocument>,private readonly jwt: JwtService, private readonly userService: UserService) { }

    async createVideo(video: Object): Promise<Video> {
        const newVideo = new this.videoModel(video);
        return newVideo.save();
    }
    async readVideobyId(id): Promise<any> {
        if (id) {
            // console.log(id);
            
            return this.videoModel.findOne({ _id: id }).populate("createdBy").exec();
        }
        // return this.videoModel.findOne({ _id: id.id }).populate("createdBy").exec();
    }

    async readVideosByTag(tag: string): Promise<Video[]> {
        return this.videoModel.find({ tag: tag }).populate('createdBy').exec();
      }
    
      async readAllVideos(): Promise<Video[]> {
        return this.videoModel.find().populate('createdBy').exec();
      }

    async streamVideo(id: string, response: Response, request: Request) {
        try {
            const data = await this.videoModel.findOne({ _id: id })

            if (!data) {
                throw new NotFoundException(null, 'VideoNotFound')
            }
            const { range } = request.headers;
            if (range) {
                const { video } = data;
                const videoPath = statSync(join(process.cwd(), `./public/${video}`))
                const CHUNK_SIZE = 1 * 1e6;
                const start = Number(range.replace(/\D/g, ''));
                const end = Math.min(start + CHUNK_SIZE, videoPath.size - 1);
                const videoLength = end - start + 1;
                response.status(206)
                response.header({
                    'Content-Range': `bytes ${start}-${end}/${videoPath.size}`,
                    'Accept-Ranges': 'bytes',
                    'Content-length': videoLength,
                    'Content-Type': 'video/mp4',
                })
                const vidoeStream = createReadStream(join(process.cwd(), `./public/${video}`), { start, end });
                vidoeStream.pipe(response);
            } else {
                throw new NotFoundException(null, 'range not found')
            }


        } catch (e) {
            console.error(e)
            throw new ServiceUnavailableException()
        }
    }

    async update(id, video: Video): Promise<Video> {
        return await this.videoModel.findByIdAndUpdate(id, video, { new: true })
    }

    async delete(id,request): Promise<any> {
        // try{
            const token = request.headers.authorization.split(' ')[1];
            const decoded = await this.jwt.verify(token);
            const userEmail = decoded.email
            const data = await this.videoModel.findOne({_id: id}).populate('createdBy').exec()
            const videoOwner = data.createdBy.email;
            if(userEmail == videoOwner){
                return await this.videoModel.findByIdAndRemove(id);
            }  else {
                // The video doesn't belong to the user
                throw new ForbiddenException('You do not have permission to delete this video.');
              }
        // }  catch (error) {
        //     // Handle any errors, e.g., token verification error
        //     throw new UnauthorizedException('Invalid token or unauthorized request.');
        //   }
    }
}