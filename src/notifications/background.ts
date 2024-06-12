import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { poolAndNotifyNewTxs } from "./txPooler";

export const TASK_NAME = "tx-pooler";

TaskManager.defineTask(TASK_NAME, async () => {
  console.debug(`Pooling txs in the background...`);

  let notified: boolean;
  try {
    notified = await poolAndNotifyNewTxs();
  } catch (e) {
    console.error(`Failed to execute task ${TASK_NAME}.\n${e}`);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }

  if (notified) {
    return BackgroundFetch.BackgroundFetchResult.NewData;
  }
  return BackgroundFetch.BackgroundFetchResult.NoData;
});

export async function registerBackgroundTxPooler() {
  const status = await BackgroundFetch.getStatusAsync();
  if (status !== BackgroundFetch.BackgroundFetchStatus.Available) {
    return;
  }

  const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
  if (isRegistered) {
    return;
  }

  BackgroundFetch.registerTaskAsync(TASK_NAME, {
    minimumInterval: 60,
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}
