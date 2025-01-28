// lambda/tests/updateTask.test.ts

import { handler } from '../src/handlers/updateTask';
import { mockUpdate } from './aws-sdk-mock';

describe('updateTask', () => {
  // Suprime console.error antes de todos os testes neste arquivo
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  // Restaura console.error após todos os testes neste arquivo
  afterAll(() => {
    jest.spyOn(console, 'error').mockRestore();
  });

  beforeEach(() => {
    mockUpdate.mockReset();
  });

  it('should update a task successfully', async () => {
    const event = {
      body: JSON.stringify({ title: 'Estudar AWS', description: 'Atualização da tarefa', completed: true }),
      pathParameters: { taskId: '1' },
    };

    // Mock DynamoDB response
    mockUpdate.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValueOnce({
        Attributes: {
          taskId: '1',
          title: 'Estudar AWS',
          description: 'Atualização da tarefa',
          completed: true,
        },
      }),
    });

    const result = await handler(event);
    expect(result.statusCode).toBe(200);
    const responseBody = JSON.parse(result.body);
    expect(responseBody.message).toBe('Tarefa atualizada com sucesso!');
    expect(responseBody.updatedAttributes).toEqual({
      taskId: '1',
      title: 'Estudar AWS',
      description: 'Atualização da tarefa',
      completed: true,
    });
    expect(mockUpdate).toHaveBeenCalledTimes(1);
  });

  it('should return an error if DynamoDB fails', async () => {
    const event = {
      body: JSON.stringify({ title: 'Estudar AWS' }),
      pathParameters: { taskId: '1' },
    };

    // Mock DynamoDB error
    mockUpdate.mockReturnValueOnce({
      promise: jest.fn().mockRejectedValueOnce(new Error('Erro ao atualizar')),
    });

    const result = await handler(event);
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe('Erro interno ao atualizar a tarefa.');
    expect(mockUpdate).toHaveBeenCalledTimes(1);
  });

  it('should return 400 if taskId is missing', async () => {
    const event = {
      body: JSON.stringify({ title: 'Estudar AWS' }),
      pathParameters: {},
    };

    const result = await handler(event);
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('taskId é obrigatório.');
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('should return 400 if no fields to update are provided', async () => {
    const event = {
      body: JSON.stringify({}),
      pathParameters: { taskId: '1' },
    };

    const result = await handler(event);
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('É necessário informar ao menos um campo para atualizar.');
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
