import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const authServiceMock = {
    login: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
      ],
    })
      // 🔹 Mock del guard para que siempre permita el acceso
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // -------------------------
  // LOGIN
  // -------------------------
  it('should call authService.login', async () => {
    const dto = { account: 'admin', password: '1234' };
    const response = { token: 'jwt-token' };

    authServiceMock.login.mockResolvedValue(response);

    const result = await controller.login(dto);

    expect(service.login).toHaveBeenCalledWith('admin', '1234');
    expect(result).toEqual(response);
  });

  // -------------------------
  // LOGOUT
  // -------------------------
  it('should call authService.logout', async () => {
    const response = { message: 'Sesión cerrada', clearCookie: true };

    authServiceMock.logout.mockResolvedValue(response);

    const result = await controller.logout();

    expect(service.logout).toHaveBeenCalled();
    expect(result).toEqual(response);
  });

  // -------------------------
  // ME
  // -------------------------
  it('should return req.user', () => {
    const req = {
      user: {
        id: 1,
        account: 'admin',
        role: 'ADMIN',
      },
    };

    const result = controller.getProfile(req as any);

    expect(result).toEqual(req.user);
  });
});
