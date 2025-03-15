import { app } from "@app";
import { connectToDb } from "@db";

app.listen(3000, async () => {
  await connectToDb();
  console.log(`Listen on: ${3000}`);
});
