/**
 * Handler para listar todas as tarefas no DynamoDB.
 */
import { DynamoDB } from "aws-sdk";

const dynamo = new DynamoDB.DocumentClient();
const tableName = process.env.TASKS_TABLE || "";

export const handler = async (event: any) => {
  try {
    const params = {
      TableName: tableName,
    };

    const result = await dynamo.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Tarefas obtidas com sucesso!",
        tasks: result.Items,
      }),
    };
  } catch (error) {
    console.error("Erro ao obter as tarefas:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erro interno ao obter as tarefas." }),
    };
  }
};
