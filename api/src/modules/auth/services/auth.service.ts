import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../../user/schemas/user.schema';
import {
  AuthSession,
  AuthSessionDocument,
} from '../schemas/auth-session.schema';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(AuthSession.name)
    private authSessionModel: Model<AuthSessionDocument>,
    private jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Hash password với salt rounds cao hơn để tăng bảo mật
    // Salt rounds 12 là mức cân bằng tốt giữa bảo mật và hiệu suất
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Tạo user mới
    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      name: name || email.split('@')[0],
    });

    // Tạo JWT token
    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);

    // Tạo session với thời hạn 7 ngày
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.authSessionModel.create({
      userId: user._id,
      token,
      expiresAt,
      isActive: true,
    });

    return {
      message: 'Đăng ký thành công',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Tìm user theo email và select password (vì password có select: false trong schema)
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Kiểm tra password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Tạo JWT token
    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);

    // Tạo session với thời hạn 7 ngày
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.authSessionModel.create({
      userId: user._id,
      token,
      expiresAt,
      isActive: true,
    });

    return {
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async validateSession(token: string): Promise<UserDocument | null> {
    try {
      // Verify JWT token
      const payload = this.jwtService.verify(token);

      // Kiểm tra session trong database
      const session = await this.authSessionModel.findOne({
        token,
        isActive: true,
        expiresAt: { $gt: new Date() },
      });

      if (!session) {
        return null;
      }

      // Lấy thông tin user
      const user = await this.userModel.findById(payload.sub);
      return user;
    } catch (error) {
      return null;
    }
  }

  async logout(token: string): Promise<void> {
    // Vô hiệu hóa session
    await this.authSessionModel.updateOne(
      { token },
      { isActive: false },
    );
  }

  async logoutAll(userId: string): Promise<void> {
    // Vô hiệu hóa tất cả sessions của user
    await this.authSessionModel.updateMany(
      { userId, isActive: true },
      { isActive: false },
    );
  }
}


