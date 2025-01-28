// lambda/tests/createTask.test.ts

import { handler } from '../src/handlers/createTask';
import { mockPut } from './aws-sdk-mock';

describe('createTask', () => {
  // Suprime console.error antes de todos os testes neste arquivo
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  // Restaura console.error após todos os testes neste arquivo
  afterAll(() => {
    jest.spyOn(console, 'error').mockRestore();
  });

  beforeEach(() => {
    mockPut.mockReset();
  });

  it('should create a task successfully', async () => {
    const event = {
      body: JSON.stringify({ title: 'Estudar Jest', description: 'Descrição da tarefa', dueDate: '2025-02-01' }),
    };

    // Mock DynamoDB response
    mockPut.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValueOnce({}),
    });

    const result = await handler(event);
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe('Tarefa criada com sucesso!');
    expect(mockPut).toHaveBeenCalledTimes(1);
  });

  it('should return an error if DynamoDB fails', async () => {
    const event = {
      body: JSON.stringify({ title: 'Estudar Jest', description: 'Descrição da tarefa', dueDate: '2025-02-01' }),
    };

    // Mock DynamoDB error
    mockPut.mockReturnValueOnce({
      promise: jest.fn().mockRejectedValueOnce(new Error('Erro ao criar')),
    });

    const result = await handler(event);
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe('Erro interno ao criar a tarefa.');
    expect(mockPut).toHaveBeenCalledTimes(1);
  });

  it('should return 400 if required fields are missing', async () => {
    const event = {
      body: JSON.stringify({ title: 'Estudar Jest' }), // Missing description and dueDate
    };

    const result = await handler(event);
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('Dados inválidos.');
    expect(mockPut).not.toHaveBeenCalled();
  });
});
