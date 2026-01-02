import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AuthSessionDocument = AuthSession & Document;

@Schema({ timestamps: true, collection: 'authsessions' })
export class AuthSession {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, unique: true, index: true })
  token: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;
}

export const AuthSessionSchema = SchemaFactory.createForClass(AuthSession);

// Tạo TTL index để tự động xóa session hết hạn sau 7 ngày
AuthSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

