import { handler } from '../src/handlers/deleteTask';
import { DynamoDB } from 'aws-sdk';

// Mock do DynamoDB
jest.mock('aws-sdk', () => {
  const mockDelete = { promise: jest.fn() };
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => ({
        delete: jest.fn(() => mockDelete),
      })),
    },
  };
});

describe('deleteTask', () => {
  it('deve excluir uma tarefa com sucesso', async () => {
    const event = {
      pathParameters: { taskId: '1' },
    };

    const result = await handler(event);
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe('Tarefa com ID 1 deletada com sucesso!');
  });

  it('deve retornar erro se o taskId não for fornecido', async () => {
    const event = {
      pathParameters: {}, // Sem taskId
    };

    const result = await handler(event);
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('taskId é obrigatório.');
  });
});