import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { CanActivate} from '@nestjs/common';
import { StudentOwnerGuard } from '../auth/student-owner.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';


import { Role } from '@prisma/client';

const mockGuard: CanActivate = {
  canActivate: jest.fn(() => true),
};

describe('StudentController', () => {
  let controller: StudentController;
  let service: StudentService;

  const studentServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllAll: jest.fn(),
    findAllDeleted: jest.fn(),
    findOne: jest.fn(),
    findOneAll: jest.fn(),
    findOneDeleted: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    restore: jest.fn(),
    getStudentSubjects: jest.fn(),
  };

  beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [StudentController],
    providers: [
      {
        provide: StudentService,
        useValue: studentServiceMock,
      },
    ],
  })
    .overrideGuard(JwtAuthGuard)
    .useValue(mockGuard)
    .overrideGuard(RolesGuard)
    .useValue(mockGuard)
    .overrideGuard(StudentOwnerGuard)
    .useValue(mockGuard)
    .compile();

  controller = module.get<StudentController>(StudentController);
});


  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ----------------------------
  // create
  // ----------------------------
  it('should create a student', async () => {
    const dto: CreateStudentDto = { id: 1 };
    const result = { ...dto };
    studentServiceMock.create.mockResolvedValue(result);

    expect(await controller.create(dto)).toEqual(result);
    expect(studentServiceMock.create).toHaveBeenCalledWith(dto);
  });

  // ----------------------------
  // findAll / findAllAll / findAllDeleted
  // ----------------------------
  it('should return all active students', async () => {
    const result = [{ id: 1 }];
    studentServiceMock.findAll.mockResolvedValue(result);

    expect(await controller.findAllActive()).toEqual(result);
    expect(studentServiceMock.findAll).toHaveBeenCalled();
  });

  it('should return all students', async () => {
    const result = [{ id: 1 }];
    studentServiceMock.findAllAll.mockResolvedValue(result);

    expect(await controller.findAllAll()).toEqual(result);
    expect(studentServiceMock.findAllAll).toHaveBeenCalled();
  });

  it('should return all deleted students', async () => {
    const result = [{ id: 1 }];
    studentServiceMock.findAllDeleted.mockResolvedValue(result);

    expect(await controller.findAllDeleted()).toEqual(result);
    expect(studentServiceMock.findAllDeleted).toHaveBeenCalled();
  });

  // ----------------------------
  // findOne variants
  // ----------------------------
  it('should find one active student', async () => {
    const result = { id: 1 };
    studentServiceMock.findOne.mockResolvedValue(result);

    expect(await controller.findOne('1')).toEqual(result);
    expect(studentServiceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('should find one student regardless of status', async () => {
    const result = { id: 1 };
    studentServiceMock.findOneAll.mockResolvedValue(result);

    expect(await controller.findOneAll('1')).toEqual(result);
    expect(studentServiceMock.findOneAll).toHaveBeenCalledWith(1);
  });

  it('should find one deleted student', async () => {
    const result = { id: 1 };
    studentServiceMock.findOneDeleted.mockResolvedValue(result);

    expect(await controller.findOneDeleted('1')).toEqual(result);
    expect(studentServiceMock.findOneDeleted).toHaveBeenCalledWith(1);
  });

  // ----------------------------
  // update / remove / restore
  // ----------------------------
  it('should remove a student', async () => {
    const result = { id: 1 };
    studentServiceMock.remove.mockResolvedValue(result);

    expect(await controller.remove('1')).toEqual(result);
    expect(studentServiceMock.remove).toHaveBeenCalledWith(1);
  });

  it('should restore a student', async () => {
    const result = { id: 1 };
    studentServiceMock.restore.mockResolvedValue(result);

    expect(await controller.restore('1')).toEqual(result);
    expect(studentServiceMock.restore).toHaveBeenCalledWith(1);
  });

  // ----------------------------
  // getStudentSubjects
  // ----------------------------
  it('should return student subjects', async () => {
    const result = { subjects: ['Math', 'Physics'] };
    studentServiceMock.getStudentSubjects.mockResolvedValue(result);

    expect(await controller.getStudentSubjects('1')).toEqual(result);
    expect(studentServiceMock.getStudentSubjects).toHaveBeenCalledWith(1);
  });
});
