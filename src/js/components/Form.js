import React, { useState } from 'react';

const formatNum = (num) => {
    const numStr = Math.round(num * 100) + '';
    return `${numStr.substr(0, numStr.length - 2)}.${numStr.substring(numStr.length - 2)}`;
}

const Form = (props) => {
    const [selectedCell, setSelectedCell] = useState('unselected');
    const [lap, setLap] = useState(undefined);
    const [results, setResults] = useState([]);

    const {data} = props;
    const {a, b, cells} = data;
    const options = [];
    const cellsMap = {unselected: {lv: '', cont: '', area: ''}};
    cells.sort((l, r) => {
        if (l.x !== r.x) {
            return l.x - r.x;
        }
        return l.y - r.y;
    }).forEach(cell => {
        cellsMap[cell.key] = cell;
        options.push(<option value={cell.key}>{cell.key}</option>);
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
        const result = {...cell, lap: formatNum(lap), base: formatNum(base)};
        const updatedResults = [result, ...results];
        setResults(updatedResults);
    };

    return <React.Fragment>
    <form>
        <div class="row">
            <div class="col-sm-4">
                <label for="cell">放置マス</label>
            </div>
            <div class="col-sm-8">
                <select id="cell" onChange={selectCell}>
                    <option value="unselected">選択して下さい</option>
                    {options}
                </select>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-4">
                <label for="lv">敵 Lv</label>
            </div>
            <div class="col-sm-8">
                <input id="lv" value={cellsMap[selectedCell].lv} readOnly={true} />
            </div>
        </div>
        <div class="row">
            <div class="col-sm-4">
                <label for="cont">大陸</label>
            </div>
            <div class="col-sm-8">
                <input id="cont" value={cellsMap[selectedCell].cont} readOnly={true} />
            </div>
        </div>
        <div class="row">
            <div class="col-sm-4">
                <label for="area">地域</label>
            </div>
            <div class="col-sm-8">
                <input id="area" value={cellsMap[selectedCell].area} readOnly={true} />
            </div>
        </div>
        <div class="row">
            <div class="col-sm-4">
                <label for="lap">ラップ</label>
            </div>
            <div class="col-sm-8">
                <input type="number" id="lap" value={lap} step="0.01" min="0" max="60" onChange={changeLap} />
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12">
                <button class="primary" onClick={calc}>予測ドロップ数を計算</button>
            </div>
        </div>
    </form>
    {results.map(result => {
            return <div class="row">
            <div class="col-sm-12">
                {result.key} (Lv. {result.lv}) - {result.lap} 秒 - {result.base} 個/h
            </div>
        </div>
    })}
    </React.Fragment>
};

export default Form;