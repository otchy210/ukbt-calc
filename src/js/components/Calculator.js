import React, { useState, useEffect } from 'react';
import ResultCard from './ResultCard';
import { getHistoryManager } from '../HistoryManager';

const Calculator = (props) => {
    const {loading, type, buffs, data, selectedTab, setSelectedTab} = props;

    const [selectedCell, setSelectedCell] = useState('unselected');
    const [lap, setLap] = useState(undefined);
    const [lastResult, setLastResult] = useState();
    const [history, setHistory] = useState([]);

    const {values, cells} = data;
    const {a, b} = values[type];
    const cellOptions = [];
    const cellsMap = {unselected: {lv: '', cont: '', area: ''}};
    cells.filter(cell => cell.type === type).sort((l, r) => {
        if (l.x !== r.x) {
            return l.x - r.x;
        }
        return l.y - r.y;
    }).forEach(cell => {
        cellsMap[cell.key] = cell;
        cellOptions.push(<option value={cell.key}>{cell.key}</option>);
    });

    const historyManager = getHistoryManager(type);
    useEffect(() => {
        setHistory(historyManager.get());
    }, [type]);

    const selectCell = (e) => {
        setSelectedCell(e.target.value);
    };
    const changeLap = (e) => {
        setLap(e.target.value);
    }
    const calc = (e) => {
        e.preventDefault();
        if (selectedCell === 'unselected') {
            return;
        }
        if (!lap) {
            return;
        }
        const cell = cellsMap[selectedCell];
        const {lv} = cell;
        const dropRate = a * lv + b;
        const turns = (60 * 60 / (lap * 10 + 5 ) ) * 10;
        const base = dropRate * turns;
        const result = {...cell, lap, base, ts: (new Date()).getTime()};
        setLastResult(result);
        setHistory(historyManager.add(result));
    };
    const onRemove = (ts) => {
        return () => {
            if (confirm('この結果を削除してよろしいですか？')) {
                setHistory(historyManager.remove(ts));
            }
        };
    };

    return <React.Fragment>
    <div class="row tab">
        <div class="col-sm-6 input-group fluid">
            <button
                class={selectedTab === 'calc' ? 'primary' : ''}
                onClick={() => setSelectedTab('calc')}
                disabled={loading}
            >計算機</button>
        </div>
        <div class="col-sm-6 input-group fluid">
            <button
                class={selectedTab === 'history' ? 'primary' : ''}
                onClick={() => setSelectedTab('history')}
                disabled={loading}
            >計算結果履歴</button>
        </div>
    </div>
    {selectedTab === 'calc' && <form>
        <div class="row">
            <div class="col-sm-6 col-md-4 input-group fluid">
                <label for="cell">放置マス</label>
                <select id="cell" onChange={selectCell} disabled={loading}>
                    <option value="unselected">選択</option>
                    {cellOptions}
                </select>
            </div>
            <div class="col-sm-6 col-md-4 input-group fluid">
                <label for="lap">ラップ</label>
                <input type="number" id="lap" value={lap} step="0.01" min="0" max="60" onChange={changeLap} disabled={loading} placeholder="数値入力" />
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6 col-md-4 input-group fluid">
                <label for="lv">敵 Lv</label>
                <input id="lv" value={cellsMap[selectedCell].lv} disabled={true} />
            </div>
            <div class="col-sm-6 col-md-4 input-group fluid">
                <label for="cont">大陸</label>
                <input id="cont" value={cellsMap[selectedCell].cont} disabled={true} />
            </div>
            <div class="col-sm-12 col-md-4 input-group fluid">
                <label for="area">地域</label>
                <input id="area" value={cellsMap[selectedCell].area} disabled={true} />
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12 input-group fluid">
                <button class="tertiary" onClick={calc} disabled={loading}>予測ドロップ数を計算</button>
            </div>
        </div>
        {lastResult && <div class="row">
            <ResultCard buffs={buffs} result={lastResult} highlight={true} />
        </div>}
    </form>}
    {selectedTab === 'history' && <form>
        <div class="row">
            <div class="col-sm-12 ">
                20 を超えた履歴は TOP3 を除いて古いものから自動的に削除されます。
            </div>
        </div>
        <div class="row">
            {history.map((result) => <ResultCard
                buffs={buffs}
                result={result}
                showRank={true}
                highlight={lastResult && lastResult.ts === result.ts}
                onRemove={onRemove(result.ts)}
            />)}
        </div>
    </form>}
    </React.Fragment>
}

export default Calculator;