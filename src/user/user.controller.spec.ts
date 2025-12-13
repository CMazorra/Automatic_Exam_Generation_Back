import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllAll: jest.fn(),
    findAllDelete: jest.fn(),
    findOne: jest.fn(),
    findOneAll: jest.fn(),
    findOneDelete: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    restore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
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
  it('should call userService.create', async () => {
    const dto: CreateUserDto = {
      name: 'John',
      password: '1234',
      account: 'john123',
      age: 20,
      course: 'Math',
      role: Role.STUDENT,
    };
    const result = { ...dto, id_us: 1 };
    mockUserService.create.mockResolvedValue(result);

    expect(await controller.create(dto)).toEqual(result);
    expect(mockUserService.create).toHaveBeenCalledWith(dto);
  });

  // ----------------------------
  // findAll variants
  // ----------------------------
  it('should call userService.findAllAll', async () => {
    const result = [{ id_us: 1, name: 'John' }];
    mockUserService.findAllAll.mockResolvedValue(result);

    expect(await controller.findAllAll()).toEqual(result);
    expect(mockUserService.findAllAll).toHaveBeenCalled();
  });

  it('should call userService.findAllDelete', async () => {
    const result = [{ id_us: 1, name: 'John', isActive: false }];
    mockUserService.findAllDelete.mockResolvedValue(result);

    expect(await controller.findAllDelete()).toEqual(result);
    expect(mockUserService.findAllDelete).toHaveBeenCalled();
  });

  it('should call userService.findAllActive', async () => {
    const result = [{ id_us: 1, name: 'John', isActive: true }];
    mockUserService.findAll.mockResolvedValue(result);

    expect(await controller.findAllActive()).toEqual(result);
    expect(mockUserService.findAll).toHaveBeenCalled();
  });

  // ----------------------------
  // findOne variants
  // ----------------------------
  it('should call userService.findOneAll', async () => {
    const result = { id_us: 1, name: 'John' };
    mockUserService.findOneAll.mockResolvedValue(result);

    expect(await controller.findOneAll('1')).toEqual(result);
    expect(mockUserService.findOneAll).toHaveBeenCalledWith(1);
  });

  it('should call userService.findOneDelete', async () => {
    const result = { id_us: 1, name: 'John', isActive: false };
    mockUserService.findOneDelete.mockResolvedValue(result);

    expect(await controller.findOneDelete('1')).toEqual(result);
    expect(mockUserService.findOneDelete).toHaveBeenCalledWith(1);
  });

  it('should call userService.findOne', async () => {
    const result = { id_us: 1, name: 'John', isActive: true };
    mockUserService.findOne.mockResolvedValue(result);

    expect(await controller.findOne('1')).toEqual(result);
    expect(mockUserService.findOne).toHaveBeenCalledWith(1);
  });

  // ----------------------------
  // update
  // ----------------------------
  it('should call userService.update', async () => {
    const dto: UpdateUserDto = { name: 'Jane' };
    const result = { id_us: 1, ...dto };
    mockUserService.update.mockResolvedValue(result);

    expect(await controller.update('1', dto)).toEqual(result);
    expect(mockUserService.update).toHaveBeenCalledWith(1, dto);
  });

  // ----------------------------
  // remove / restore
  // ----------------------------
  it('should call userService.remove', async () => {
    const result = { id_us: 1, isActive: false };
    mockUserService.remove.mockResolvedValue(result);

    expect(await controller.remove('1')).toEqual(result);
    expect(mockUserService.remove).toHaveBeenCalledWith(1);
  });

  it('should call userService.restore', async () => {
    const result = { id_us: 1, isActive: true };
    mockUserService.restore.mockResolvedValue(result);

    expect(await controller.restore('1')).toEqual(result);
    expect(mockUserService.restore).toHaveBeenCalledWith(1);
  });
});
