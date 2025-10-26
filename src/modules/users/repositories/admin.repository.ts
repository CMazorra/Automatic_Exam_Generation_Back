import { Injectable } from "@nestjs/common";
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminRepository{
    constructor(private readonly prisma: PrismaService){}

    async create( data : Prisma.AdminCreateInput){
        return this.prisma.admin.create({data});
    }

    async findAll(){
        return this.prisma.admin.findMany({include: {user:true}});
    }

    async findID(id: number){
        return this.prisma.admin.findUnique({where:{ id}, include: {user: true}});
    }

    async update(id: number, data: Prisma.AdminUpdateInput){
        return this.prisma.admin.update({where: {id}, data});
    }

    async delete(id: number){
        return this.prisma.admin.delete({where: {id}})
    }
}