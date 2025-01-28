import { DynamoDB } from 'aws-sdk';
const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: any) => {
  try {
    const { title, description, dueDate } = JSON.parse(event.body);

    // Validação do corpo da requisição
    if (!title || !description || !dueDate) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Dados inválidos.' }),
      };
    }

    const params = {
      TableName: process.env.TASKS_TABLE || 'defaultTableName',
      Item: {
        taskId: Date.now().toString(),
        title,
        description,
        dueDate,
        completed: false,
      },
    };

    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Tarefa criada com sucesso!' }),
    };
  } catch (error) {
    console.error('Erro ao criar a tarefa:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erro interno ao criar a tarefa.' }),
    };
  }
};