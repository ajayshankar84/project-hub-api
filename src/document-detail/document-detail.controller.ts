import { Controller, Get, Post, Patch, Delete, Param, Body, UseInterceptors, UploadedFile, ParseIntPipe, Put } from '@nestjs/common';
import { DocumentDetailService } from './document-detail.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Public } from '../auth/public.decorator';
import { CreateDocumentDetailDto } from './document-detail.model';

const uploadConfig = {
    storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
            const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
            cb(null, `${randomName}${extname(file.originalname)}`);
        },
    }),
    limits: {
        fileSize: 1.5 * 1024 * 1024 * 1024, // 1.5GB Limit
    },
};

@Controller('document-detail')
export class DocumentDetailController {
    constructor(private readonly documentDetailService: DocumentDetailService) { }

    @Get()
    @Public()
    async findAll() {
        return this.documentDetailService.findAll();
    }

    @Get('customer/:customerId')
    @Public()
    async findByCustomerId(@Param('customerId') customerId: string) {
        return this.documentDetailService.findByCustomerId(customerId);
    }

    @Get('customer/:customerId/:page/:limit')
    @Public()
    async findPagedByCustomerId(
        @Param('customerId') customerId: string,
        @Param('page', ParseIntPipe) page: number,
        @Param('limit', ParseIntPipe) limit: number
    ) {
        return this.documentDetailService.findPagedByCustomerId(customerId, page, limit);
    }

    @Get(':id')
    @Public()
    async findOne(@Param('id') id: string) {
        return this.documentDetailService.findOne(id);
    }

    @Post()
    @Public()
    @UseInterceptors(FileInterceptor('file', uploadConfig))
    async create(@Body() data: CreateDocumentDetailDto, @UploadedFile() file: Express.Multer.File) {
        return this.documentDetailService.create(data, file);
    }

    @Patch(':id')
    @Public()
    @UseInterceptors(FileInterceptor('file', uploadConfig))
    async update(@Param('id') id: string, @Body() data: Partial<CreateDocumentDetailDto>, @UploadedFile() file: Express.Multer.File) {
        return this.documentDetailService.update(id, data, file);
    }

    @Put(':id/status')
    @Public()
    async updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.documentDetailService.updateStatus(id, status);
    }

    @Delete(':id')
    @Public()
    async remove(@Param('id') id: string) {
        return this.documentDetailService.remove(id);
    }
}
