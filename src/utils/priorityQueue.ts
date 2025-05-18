/**
 * Generic Min-Heap Priority Queue implementation.
 * Items with the lowest priority value are dequeued first.
 */

export class PriorityQueue<T> {
    private heap: { item: T; priority: number}[] = [];

    // returns the number of elements in the queue
    public size(): number {
        return this.heap.length;
    }

    // add an item with the given priority to the queue
    public push(item: T, priority: number): void {
        const node = { item, priority };
        this.heap.push(node);
        this.bubbleUp(this.heap.length - 1);
    }

    // remove and returns the element with the highest priority (lowest value)
    public pop(): T | undefined {
        const heap = this.heap;
        if (heap.length === 0) return undefined;
        this.swap(0, heap.length - 1);
        const node = heap.pop();
        this.bubbleDown(0);
        return node!.item;
    }
    
    private bubbleUp(index: number): void {
        const heap = this.heap;
        let idx = index;
        while (idx > 0) {
            const parentIdx = Math.floor((idx - 1) / 2);
            if (heap[idx].priority >= heap[parentIdx].priority) break;
            this.swap(idx, parentIdx);
            idx = parentIdx;
        }
    }

    private bubbleDown(index: number): void {
        const heap = this.heap;
        let idx = index;
        const length = heap.length;

        while (true) {
            const leftIdx = 2 * idx + 1;
            const rightIdx = 2 * idx + 2;
            let smallest = idx;

            if (leftIdx < length && heap[leftIdx].priority < heap[smallest].priority) {
                smallest = leftIdx;
            }
            if (rightIdx < length && heap[rightIdx].priority < heap[smallest].priority) {
                smallest = rightIdx;
            }
            if (smallest === idx) break;
            this.swap(idx, smallest);
            idx = smallest;
        }
    }

    private swap(i: number, j: number): void {
        const heap = this.heap;
        [heap[i], heap[j]] = [heap[j], heap[i]];
    }

    public peek(): T | undefined {
        return this.heap.length > 0 ? this.heap[0].item : undefined;
    }
    
    public peekPriority(): number | undefined {
        return this.heap.length > 0 ? this.heap[0].priority : undefined;
    }

}