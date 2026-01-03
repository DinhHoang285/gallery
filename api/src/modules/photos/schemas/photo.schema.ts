import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PhotoDocument = Photo & Document;

@Schema({ timestamps: true, collection: 'photos' })
export class Photo {
  @Prop({ required: true })
  fromSource: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }], default: [] })
  categoryIds: Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  fileIds: string[];

  @Prop()
  title?: string;

  @Prop()
  description?: string;

  @Prop({ default: false })
  isSale: boolean;

  @Prop({ type: Number, default: 0 })
  price: number;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);

