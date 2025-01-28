/**
 * Handler para deletar uma tarefa no DynamoDB.
 */
import { DynamoDB } from "aws-sdk";

const dynamo = new DynamoDB.DocumentClient();
const tableName = process.env.TASKS_TABLE || "";

export const handler = async (event: any) => {
  try {
    const taskId = event.pathParameters?.taskId;

    if (!taskId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "taskId é obrigatório." }),
      };
    }

    const params = {
      TableName: tableName,
      Key: { taskId },
    };

    await dynamo.delete(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Tarefa com ID ${taskId} deletada com sucesso!`,
      }),
    };
  } catch (error) {
    console.error("Erro ao deletar a tarefa:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erro interno ao deletar a tarefa." }),
    };
  }
};
