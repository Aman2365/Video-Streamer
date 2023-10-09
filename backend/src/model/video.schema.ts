import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "./user.schema";

export type VideoDocument = Video & Document;

@Schema()
export class Video {
 
    @Prop({ required: true})
    title: string;

    @Prop({required: true})
    video: string;

    @Prop({required: true})
    coverImage: string;

    @Prop({ default: Date.now() })
    uploadDate: Date

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    createdBy: User
}

export const VideoSchema = SchemaFactory.createForClass(Video)