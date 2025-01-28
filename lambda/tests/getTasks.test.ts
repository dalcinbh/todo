// lambda/tests/getTasks.test.ts

import { handler } from '../src/handlers/getTasks';
import { mockScan } from './aws-sdk-mock';

describe('getTasks', () => {
  // Suprime console.error antes de todos os testes neste arquivo
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  // Restaura console.error após todos os testes neste arquivo
  afterAll(() => {
    jest.spyOn(console, 'error').mockRestore();
  });

  beforeEach(() => {
    mockScan.mockReset();
  });

  it('should retrieve tasks successfully', async () => {
    // Mock DynamoDB response
    const mockTasks = [
      { taskId: '1', title: 'Task 1', description: 'Description 1', dueDate: '2025-02-01', completed: false },
      { taskId: '2', title: 'Task 2', description: 'Description 2', dueDate: '2025-02-02', completed: true },
    ];

    mockScan.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValueOnce({ Items: mockTasks }),
    });

    const event = {};

    const result = await handler(event);
    expect(result.statusCode).toBe(200);
    const responseBody = JSON.parse(result.body);
    expect(responseBody.message).toBe('Tarefas obtidas com sucesso!');
    expect(responseBody.tasks).toEqual(mockTasks);
    expect(mockScan).toHaveBeenCalledTimes(1);
  });

  it('should return an error if DynamoDB fails', async () => {
    mockScan.mockReturnValueOnce({
      promise: jest.fn().mockRejectedValueOnce(new Error('Erro ao obter')),
    });

    const event = {};

    const result = await handler(event);
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe('Erro interno ao obter as tarefas.');
    expect(mockScan).toHaveBeenCalledTimes(1);
  });
});
