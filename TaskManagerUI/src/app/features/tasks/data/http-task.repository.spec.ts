import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { HttpTaskRepository } from './http-task.repository';

describe('HttpTaskRepository', () => {
  let repository: HttpTaskRepository;
  let httpMock: HttpTestingController;
  const tasksUrl = `${environment.apiUrl}/tasks`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpTaskRepository, provideHttpClient(), provideHttpClientTesting()],
    });

    repository = TestBed.inject(HttpTaskRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getAll_WithValidResponse_ReturnsMappedTasks', () => {
    let result: readonly { id: number; title: string; isComplete: boolean }[] | undefined;

    repository.getAll().subscribe((tasks) => {
      result = tasks;
    });

    const req = httpMock.expectOne(tasksUrl);
    expect(req.request.method).toBe('GET');
    req.flush({
      success: true,
      data: [{ id: 1, title: 'Task one', isComplete: false }],
    });

    expect(result).toEqual([{ id: 1, title: 'Task one', isComplete: false }]);
  });

  it('create_WithValidData_SendsPostRequest', () => {
    let result: { id: number; title: string; isComplete: boolean } | undefined;

    repository.create('New task').subscribe((task) => {
      result = task;
    });

    const req = httpMock.expectOne(tasksUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ title: 'New task' });
    req.flush({
      success: true,
      data: { id: 2, title: 'New task', isComplete: false },
    });

    expect(result).toEqual({ id: 2, title: 'New task', isComplete: false });
  });

  it('delete_WithValidId_SendsDeleteRequest', () => {
    let completed = false;

    repository.delete(3).subscribe(() => {
      completed = true;
    });

    const req = httpMock.expectOne(`${tasksUrl}/3`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true, data: null });

    expect(completed).toBeTrue();
  });

  it('toggleComplete_WithValidId_SendsPatchRequest', () => {
    let result: { id: number; title: string; isComplete: boolean } | undefined;

    repository.toggleComplete(4).subscribe((task) => {
      result = task;
    });

    const req = httpMock.expectOne(`${tasksUrl}/4/toggle`);
    expect(req.request.method).toBe('PATCH');
    req.flush({
      success: true,
      data: { id: 4, title: 'Toggled', isComplete: true },
    });

    expect(result).toEqual({ id: 4, title: 'Toggled', isComplete: true });
  });

  it('getAll_WithFailedResponse_ThrowsError', () => {
    let errorMessage: string | undefined;

    repository.getAll().subscribe({
      error: (error: Error) => {
        errorMessage = error.message;
      },
    });

    const req = httpMock.expectOne(tasksUrl);
    req.flush({ success: false, message: 'Server error' });

    expect(errorMessage).toBe('Server error');
  });
});
