class PromiseQueue {
    // a queue is just a dynamic array
    constructor(concurrency) {
        this.concurrency = concurrency;
        this.queue = [];
        this.currentCount = 0;
    }
    enqueue(promise) {
        // executes right after creation, starting the recursive execution
        this.queue.push(promise);
        this.processQueue();
    }
    async processQueue() {
        // will only execute the next promise when the counter decreases
        // which will happen only after the promice is executed
        while (this.currentCount < this.concurrency && this.queue.length > 0) {
            // removes the first element and execute it
            const promise = this.queue.shift();
            this.currentCount++;

            try {
                await promise();
            } catch (error) {
                console.error("Promise failed: ", error);
            } finally {
                this.currentCount--;
                this.processQueue();
            }
        }
    }
}

const queue = new PromiseQueue(3);

const createAsyncPromise = (id, duration) => {
    return async () => {
        const startingTime = Date.now();
        console.log(
            `Starting promise ${id} at ${new Date(startingTime).toLocaleTimeString()}`
        );
        await new Promise((resolve) => setTimeout(resolve, duration));
        console.log(
            `Finished promise ${id} at ${new Date(Date.now()).toLocaleTimeString()} after ${(Date.now() - startingTime) / 1000} seconds`
        );
    };
};

for (let i = 1; i <= 10; i++) {
    queue.enqueue(createAsyncPromise(i, Math.random() * 2000 + 4000));
}
