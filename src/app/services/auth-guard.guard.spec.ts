import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true when user is authenticated', () => {
 
    spyOn(localStorage, 'getItem').and.returnValue('valid-token');
    
    const result = executeGuard(
      {} as any, 
      {} as any  
    );
    
    expect(result).toBe(true);
  });

  it('should redirect to login when user is not authenticated', () => {
    
    spyOn(localStorage, 'getItem').and.returnValue(null);
    
    const result = executeGuard(
      {} as any, 
      {} as any 
    );
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});