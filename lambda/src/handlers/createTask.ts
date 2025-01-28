import { DynamoDB } from 'aws-sdk';
const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: any) => {
  const { title, description, dueDate } = JSON.parse(event.body);
  const params = {
    TableName: process.env.TASKS_TABLE!,
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
};