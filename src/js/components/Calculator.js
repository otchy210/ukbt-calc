import React, { useState } from 'react';
import ResultCard from './ResultCard';

const Calculator = (props) => {
    const {loading, type, buffs, data} = props;

    const [selectedTab, setSelectedTab] = useState('calc');
    const [selectedCell, setSelectedCell] = useState('unselected');
    const [lap, setLap] = useState(undefined);
    const [results, setResults] = useState([]);

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
        const enemies = 60 * 60 / lap * 5;
        const base = dropRate * enemies;
        const result = {...cell, lap, base, ts: (new Date()).getTime()};
        const updatedResults = [...results];
        updatedResults.unshift(result);
        if (updatedResults.length > 4) {
            updatedResults.pop();
        }
        setResults(updatedResults);
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
        {results.length > 0 && <div class="row">
            {results.map((result, index) => <ResultCard buffs={buffs} result={result} highlight={index === 0} />)}
        </div>}
    </form>}
    {selectedTab === 'history' && <div class="row">
        <div class="col-sm-12">
            ごめんまだです！過去の計算結果の履歴が見れて、結果を比較できる…ようになる予定。乞うご期待！
        </div>
    </div>}
    </React.Fragment>
}

export default Calculator;