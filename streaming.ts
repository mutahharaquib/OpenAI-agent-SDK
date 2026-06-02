import 'dotenv/config';
import { Agent, run } from '@openai/agents';

const agent = new Agent({
  name: 'Storyteller',
  instructions:
    'You are a storyteller. You will be given a topic and you should tell a story about it.',
});

async function* streamOutput(q: string) {
  const result = await run(agent, q, { stream: true });
  const stream = result.toTextStream();

  for await (const val of stream) {
    yield { isCompleted: false, value: val };
  }

  yield { isCompleted: true, value: result.finalOutput };
}

async function main(q: string) {
  for await (const o of streamOutput(q)) {
    console.log(o);
  }
}

main('tell me about operating systems').catch(console.error);

// stream:true is supported in run, and it returns a streamable result. You can convert it to a text stream using toTextStream() method. The stream will yield intermediate outputs as they are generated, and finally yield the complete output when done.