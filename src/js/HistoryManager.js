import { getLocal, setLocal } from './common';

const MAX_LEN = 24;

class HistoryManager {
    constructor(type) {
        this.type = type;
        this.key = `history-${type}`;
        this.list = getLocal(this.key, []);
    }

    get() {
        return this.list;
    }

    add(result) {
        let updatedList = [...this.list];
        updatedList.unshift(result);
        if (updatedList.length > MAX_LEN) {
            let targetTs;
            for (let i = updatedList.length - 1; i >= 0; i--) {
                const r = updatedList[i];
                if (!r.pinned) {
                    targetTs = r.ts;
                    break;
                }
            }
            this.list = updatedList;
            return this.remove(targetTs);
        } else {
            return this._finalize(updatedList);
        }
    }

    pin(ts) {
        return this._pin(ts, true);
    }

    unpin(ts) {
        return this._pin(ts, false);
    }

    remove(ts) {
        const removedList = [];
        this.list.forEach(r => {
            if (r.ts !== ts) {
                removedList.push(r);
            }
        });
        this._finalize(removedList);
        return this.get();
    }

    _pin(ts, pin) {
        const updatedList = this.list.map(r => {
            if (r.ts === ts) {
                r.pinned = pin;
            }
            return r;
        });
        this._save(updatedList);
        return this.get();
    }

    _finalize(updatedList) {
        const anotatedList = updatedList.sort((l, r) => {
            const baseDiff = l.base - r.base;
            if (baseDiff !== 0) {
                return -baseDiff;
            }
            return l.ts - r.ts;
        }).map((r, i) => {
            r.rank = (i < 3) ? i + 1 : undefined;
            return r;
        }).sort((l, r) => {
            return r.ts - l.ts;
        });
        return this._save(anotatedList);
    }

    _save(updatedList) {
        this.list = updatedList;
        setLocal(this.key, this.list);
        return this.get();
    }
};

const managers = {
    Y: new HistoryManager('Y'),
    R: new HistoryManager('R'),
    B: new HistoryManager('B'),
};

const getHistoryManager = (type) => {
    return managers[type];
};

export {
    getHistoryManager
};
