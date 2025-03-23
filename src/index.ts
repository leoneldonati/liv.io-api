import { app } from "@app";
import { PORT } from "@const";
import { connectToDb } from "@db";

app.listen(PORT, async () => {
  await connectToDb();
  console.log(`Listen on: ${PORT}`);
});
