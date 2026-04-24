export const asyncNotStarted = { state: "not-started" };
export const asyncIsRunning = { state: "is-running" };
export const asyncFailed = (error) => ({ state: "failed", error });
export const asyncHasFinished = (data) => ({ state: "has-finished", data });
export const ensureAsyncHasFinished = (loading, message) => {
    if (loading.state !== "has-finished")
        throw Error(`ensureAsyncHasFinished (loadingState is ${loading.state}): ${message ?? "did not expect this"}.`);
    return loading.data;
};
