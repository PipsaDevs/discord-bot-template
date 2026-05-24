/**
 * A bounded queue is an array with limited capacity.
 * When the array is full and you want to add a new element,
 * it will eliminate those elements who entered first
 */

export default class BoundedQueue<T> {
	private _items: T[] = [];
	private _capacity: number;
	private _head = 0;
	private _tail = 0;
	private _size = 0;

	constructor(capacity: number) {
		this._capacity = capacity;
	}

	get items() {
		const res: T[] = [];
		let current = this._head;
		for (let i = 0; i < this._size; i++) {
			res.push(this._items[current] as T);
			current = (current + 1) % this._capacity;
		}
		return res;
	}
	get capacity() {
		return this._capacity;
	}
	get size() {
		return this._size;
	}

	push_back(...items: T[]): void {
		for (const item of items) {
			this._items[this._tail] = item;
			if (this._size === this._capacity) {
				this._head = (this._head + 1) % this._capacity;
			} else {
				this._size++;
			}
			this._tail = (this._tail + 1) % this._capacity;
		}
	}
}
