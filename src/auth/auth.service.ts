import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { AuthModel } from './auth.model'; // Based on updated model
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel('Auth') private readonly lmsAuthModel: Model<AuthModel>,
        private readonly jwtService: JwtService,
    ) { }

    // Fetch all internships
    async findAll(): Promise<AuthModel[]> {
        return await this.lmsAuthModel
            .find()
            .sort({ createdAt: -1 }) // Use 'desc' or -1 for descending order
            .exec();
    }

    // Fetch a single internship by ID
    async findOne(id: string): Promise<AuthModel> {
        if (!isValidObjectId(id)) {
            return await this.findByMobile(id);
        }

        const lmsAuth = await this.lmsAuthModel.findById(id).exec();
        if (!lmsAuth) {
            throw new NotFoundException(`LMSAuth with ID ${id} not found`);
        }
        return lmsAuth;
    }

    // Fetch a single internship by ID
    async findByMobile(mobile: string): Promise<AuthModel> {
        const lmsAuth = await this.lmsAuthModel.findOne({ mobile }).exec();
        if (!lmsAuth) {
            throw new NotFoundException(`LMSAuth with Mobile ${mobile} not found`);
        }
        return lmsAuth;
    }

    // Save internship data and the image path to MongoDB
    async create(internshipData: any): Promise<AuthModel> {
        const createdLMSAuth = new this.lmsAuthModel({
            ...internshipData,
            // Store the local path or URL
        });
        return await createdLMSAuth.save();
    }

    async login(loginData: any) {
        const identifier = loginData.mobile || loginData.username;
        const { password } = loginData;

        const user = await this.lmsAuthModel.findOne({ mobile: identifier }).exec();
        if (!user) throw new UnauthorizedException('Invalid credentials');
        if (user.password !== password) throw new UnauthorizedException('Invalid credentials');

        const payload = {
            sub: user._id,
            id: user._id,
            username: user.firstName,
            name: user.firstName,
            role: user.role,
        };
        const access_token = this.jwtService.sign(payload);

        return {
            success: true,
            data: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                isLoggedIn: true,
            },
            access_token,
        };
    }

    async update(id: string, internshipData: any): Promise<AuthModel> {
        const updatedLMSAuth = await this.lmsAuthModel
            .findByIdAndUpdate(id, internshipData, { new: true }) // { new: true } returns the modified document
            .exec();

        if (!updatedLMSAuth) {
            throw new NotFoundException(`LMSAuth with ID ${id} not found`);
        }
        return updatedLMSAuth;
    }

    // Delete an internship
    async remove(id: string): Promise<any> {
        const result = await this.lmsAuthModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`LMSAuth with ID ${id} not found`);
        }
        return { deleted: true };
    }

    async resetPassword(data: any) {
        const { email, password } = data;

        const user = await this.lmsAuthModel.findOneAndUpdate({ email }, { password }, { new: true }).exec();

        if (!user) {
            throw new NotFoundException("User with email ${email} not found");
        }
        return user;
    }
}