import { sayHello } from "./lib/say-hello";
import { sayGoodbye } from "./lib/say-goodbye";

export type Name = string;

export default function saySomething(phrase: "Hello" | "Goodbye", name: Name) {
  if (phrase === "Hello") {
    sayHello(name);
  } else {
    sayGoodbye(name);
  }
}
