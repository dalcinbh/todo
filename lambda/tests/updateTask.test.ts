import { handler } from '../src/handlers/updateTask';
import { DynamoDB } from 'aws-sdk';

// Mock do DynamoDB
jest.mock('aws-sdk', () => {
  const mockUpdate = jest.fn().mockReturnValue({
    promise: jest.fn(),
  });
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => ({
        update: mockUpdate,
      })),
    },
  };
});

describe('updateTask', () => {
  it('deve atualizar uma tarefa com sucesso', async () => {
    const event = {
      pathParameters: { taskId: '1' },
      body: JSON.stringify({
        title: 'Comprar leite e pão',
        completed: true,
      }),
    };

    // Mock da resposta do DynamoDB
    (DynamoDB.DocumentClient.prototype.update as jest.Mock).mockReturnValueOnce({
      promise: jest.fn().mockResolvedValueOnce({
        Attributes: {
          taskId: '1',
          title: 'Comprar leite e pão',
          completed: true,
        },
      }),
    });

    const result = await handler(event);
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe('Tarefa atualizada com sucesso!');
  });

  it('deve retornar erro se o taskId não for fornecido', async () => {
    const event = {
      pathParameters: {}, // Sem taskId
      body: JSON.stringify({
        title: 'Comprar leite e pão',
      }),
    };

    const result = await handler(event);
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('taskId é obrigatório.');
  });
});