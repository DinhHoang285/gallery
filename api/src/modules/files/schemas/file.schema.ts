import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FileDocument = File & Document;

@Schema({ timestamps: true, collection: 'files' })
export class File {
  @Prop({ required: true })
  type: string; // MIME type (e.g., 'image/jpeg', 'image/png')

  @Prop({ required: true })
  name: string; // Original filename

  @Prop()
  description?: string;

  @Prop({ default: 'diskStorage' })
  server: string;

  @Prop({ required: true })
  path: string; // File path on disk

  @Prop({ required: true })
  size: number; // File size in bytes

  @Prop()
  thumbnail?: string; // Thumbnail path

  @Prop()
  originalName?: string; // Original filename before upload
}

export const FileSchema = SchemaFactory.createForClass(File);

