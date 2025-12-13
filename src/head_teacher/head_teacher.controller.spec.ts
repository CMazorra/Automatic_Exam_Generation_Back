import { Test, TestingModule } from '@nestjs/testing';
import { HeadTeacherController } from './head_teacher.controller';
import { HeadTeacherService } from './head_teacher.service';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { TeacherOwnerGuard } from '../auth/teacher-owner.guard';

const mockGuard: CanActivate = {
  canActivate: jest.fn(() => true),
};

describe('HeadTeacherController', () => {
  let controller: HeadTeacherController;
  let service: HeadTeacherService;

  const mockHeadTeacherService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllAll: jest.fn(),
    findAllDeleted: jest.fn(),
    findOne: jest.fn(),
    findOneAll: jest.fn(),
    findOneDelete: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    restore: jest.fn(),
  };

  beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [HeadTeacherController],
    providers: [
      {
        provide: HeadTeacherService,
        useValue: mockHeadTeacherService,
      },
    ],
  })
    .overrideGuard(JwtAuthGuard)
    .useValue(mockGuard)
    .overrideGuard(RolesGuard)
    .useValue(mockGuard)
    .overrideGuard(TeacherOwnerGuard)
    .useValue(mockGuard)
    .compile();

  controller = module.get<HeadTeacherController>(HeadTeacherController);
  service = module.get<HeadTeacherService>(HeadTeacherService);
});


  /* ===================== CREATE ===================== */
  it('should create a head teacher', async () => {
    const dto = { teacher_id: 1 };
    const result = { id: 1, ...dto };

    mockHeadTeacherService.create.mockResolvedValue(result);

    expect(await controller.create(dto as any)).toEqual(result);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  /* ===================== FIND ALL ===================== */
  it('should return all head teachers', async () => {
    const result = [{ id: 1 }, { id: 2 }];

    mockHeadTeacherService.findAll.mockResolvedValue(result);

    expect(await controller.findAll()).toEqual(result);
  });

  it('should return all head teachers including deleted', async () => {
    const result = [{ id: 1 }, { id: 2 }];

    mockHeadTeacherService.findAllAll.mockResolvedValue(result);

    expect(await controller.findAllAll()).toEqual(result);
  });

  it('should return all deleted head teachers', async () => {
    const result = [{ id: 3 }];

    mockHeadTeacherService.findAllDeleted.mockResolvedValue(result);

    expect(await controller.findAllDeleted()).toEqual(result);
  });

  /* ===================== FIND ONE ===================== */
  it('should return one head teacher', async () => {
    const result = { id: 1 };

    mockHeadTeacherService.findOne.mockResolvedValue(result);

    expect(await controller.findOne('1')).toEqual(result);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should return one head teacher including deleted', async () => {
    const result = { id: 1 };

    mockHeadTeacherService.findOneAll.mockResolvedValue(result);

    expect(await controller.findOneAll('1')).toEqual(result);
    expect(service.findOneAll).toHaveBeenCalledWith(1);
  });

  it('should return one deleted head teacher', async () => {
    const result = { id: 1 };

    mockHeadTeacherService.findOneDelete.mockResolvedValue(result);

    expect(await controller.findOneDeleted('1')).toEqual(result);
    expect(service.findOneDelete).toHaveBeenCalledWith(1);
  });

  /* ===================== UPDATE ===================== */
  it('should update a head teacher', async () => {
    const dto = { teacher_id: 2 };
    const result = { id: 1, ...dto };

    mockHeadTeacherService.update.mockResolvedValue(result);

    expect(await controller.update('1', dto as any)).toEqual(result);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  /* ===================== DELETE ===================== */
  it('should delete a head teacher', async () => {
    mockHeadTeacherService.remove.mockResolvedValue({ deleted: true });

    expect(await controller.remove('1')).toEqual({ deleted: true });
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  /* ===================== RESTORE ===================== */
  it('should restore a head teacher', async () => {
    mockHeadTeacherService.restore.mockResolvedValue({ restored: true });

    expect(await controller.restore('1')).toEqual({ restored: true });
    expect(service.restore).toHaveBeenCalledWith(1);
  });
});
