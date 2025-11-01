import { Injectable } from "@nestjs/common";
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from "@prisma/client";

@Injectable()
export class UserRepository{
    constructor(private readonly prisma: PrismaService){}

    async create( user: Prisma.UserCreateInput) {
        return this.prisma.user.create({data: user});
    }
    
    async findAll(){
        return this.prisma.user.findMany()
    }

    async findID( id: number){
        return this.prisma.user.findUnique({ where: {id_us: id}});
    }

    async update( id: number, data: Prisma.UserUpdateInput){
        return this.prisma.user.update({where: {id_us: id}, data});
    }

    async delete( id: number){
        return this.prisma.user.delete({where: {id_us: id}})
    }
}