// lambda/tests/deleteTask.test.ts

import { handler } from '../src/handlers/deleteTask';
import { mockDelete } from './aws-sdk-mock';

describe('deleteTask', () => {
  // Suprime console.error antes de todos os testes neste arquivo
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  // Restaura console.error após todos os testes neste arquivo
  afterAll(() => {
    jest.spyOn(console, 'error').mockRestore();
  });

  beforeEach(() => {
    mockDelete.mockReset();
  });

  it('deve deletar uma tarefa com sucesso', async () => {
    const event = { pathParameters: { taskId: '1' } };

    // Mock DynamoDB response
    mockDelete.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValueOnce({}),
    });

    const result = await handler(event);
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe('Tarefa com ID 1 deletada com sucesso!');
    expect(mockDelete).toHaveBeenCalledTimes(1);
  });

  it('deve retornar erro se o DynamoDB falhar', async () => {
    const event = { pathParameters: { taskId: '1' } };

    // Mock DynamoDB error
    mockDelete.mockReturnValueOnce({
      promise: jest.fn().mockRejectedValueOnce(new Error('Erro ao deletar')),
    });

    const result = await handler(event);
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe('Erro interno ao deletar a tarefa.');
    expect(mockDelete).toHaveBeenCalledTimes(1);
  });

  it('deve retornar 400 se taskId estiver faltando', async () => {
    const event = { pathParameters: {} };

    const result = await handler(event);
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('taskId é obrigatório.');
    expect(mockDelete).not.toHaveBeenCalled();
  });
});
