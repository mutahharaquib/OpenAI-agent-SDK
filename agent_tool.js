import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";
import axios from "axios";
import { use } from "react";

const GetWeatherResultSchema = z.object({
  city: z.string().describe("name of the city"),
  degree_c: z.number().describe("the degree celcius of the temp"),
  condition: z.string().optional().describe("condition of the weather"),
});

const getWeatherTool = tool({
  name: "get_weather",
  description: "returns the current weather information for the given city",
  parameters: z.object({
    city: z.string().describe("name of the city"),
  }),
  execute: async function ({ city }) {
    const url = `https://wttr.in/${city.toLowerCase()}?format=%C+%t`;
    const response = await axios.get(url, { responseType: "text" });
    return `The weather of ${city} is ${response.data}`;
  },
});

const sendEmailTool = tool({
  name: "send_email",
  description: "This tool sends an email",
  parameters: z.object({
    toEmail: z.string().describe("email address to"),
    subject: z.string().describe("subject"),
    body: z.string().describe("body of the email"),
  }),
  execute: async function ({ body, subject, toEmail }) {},
});

const agent = new Agent({
  name: "Weather Agent",
  instructions: `You are an expert weather agent that helps user to tell weather report`,
  tools: [getWeatherTool, sendEmailTool],
  outputType: GetWeatherResultSchema,
});

async function main(query = "") {
  const result = await run(agent, query);
  console.log(`Result:`, result.finalOutput.degree_c);
}

main(`What is the weather in Hyderabad?`);

// import{ agent, run } from "@openai/agents"; means that we are importing the "agent" and "run" functions from the "@openai/agents" package. and the import{ tool } from "@openai/agents"; means that we are importing the "tool" function from the "@openai/agents" package. The "agent" function is used to create a new agent, and the "run" function is used to run the agent with a given query. The "tool" function is used to create a new tool that can be used by the agent.

// zod is a schema declaration and validation library. It allows you to define the shape of your data and validate it at runtime. In this code, we are using zod to define the schema for the output of the agent and the parameters for the tools. The GetWeatherResultSchema defines the shape of the output that we expect from the agent, which includes the city, degree in Celsius, and an optional condition.
