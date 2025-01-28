/**
 * Handler para atualizar uma tarefa no DynamoDB.
 */
import { DynamoDB } from "aws-sdk";

const dynamo = new DynamoDB.DocumentClient();
const tableName = process.env.TASKS_TABLE || "";

export const handler = async (event: any) => {
  try {
    const taskId = event.pathParameters?.taskId;
    const body = JSON.parse(event.body || "{}");

    if (!taskId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "taskId é obrigatório." }),
      };
    }

    if (!body.title && !body.description) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "É necessário informar ao menos um campo para atualizar." }),
      };
    }

    const updateExpression = [];
    const expressionAttributeValues: any = {};

    if (body.title) {
      updateExpression.push("title = :title");
      expressionAttributeValues[":title"] = body.title;
    }

    if (body.description) {
      updateExpression.push("description = :description");
      expressionAttributeValues[":description"] = body.description;
    }

    const params = {
      TableName: tableName,
      Key: { taskId },
      UpdateExpression: `set ${updateExpression.join(", ")}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "UPDATED_NEW",
    };

    const result = await dynamo.update(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Tarefa atualizada com sucesso!",
        updatedAttributes: result.Attributes,
      }),
    };
  } catch (error) {
    console.error("Erro ao atualizar a tarefa:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erro interno ao atualizar a tarefa." }),
    };
  }
};
