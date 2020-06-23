import React, { useState } from 'react';
import ResultCard from './ResultCard';

const Form = (props) => {
    const [dBuff, setDBuff] = useState(false);
    const [mBuff, setMBuff] = useState(0);
    const [selectedTab, setSelectedTab] = useState('calc');
    const [selectedCell, setSelectedCell] = useState('unselected');
    const [lap, setLap] = useState(undefined);
    const [latestResult, setLatestResult] = useState(undefined);

    const mBuffOptions = [];
    const formatPercent = (lv) => {
        const numStr = lv * 3 + '';
        return `${numStr.substring(0, numStr.length - 1)}.${numStr.substring(numStr.length - 1)}%`;
    };
    for(let lv = 0; lv <= 100; lv++) {
        const percent = formatPercent(lv);
        const label = lv === 0 ? '----' : `Lv.${lv} [${percent}]`;
        mBuffOptions.push(<option value={lv} selected={lv === mBuff}>{label}</option>);
    }

    const {data} = props;
    const {a, b, cells} = data;
    const cellOptions = [];
    const cellsMap = {unselected: {lv: '', cont: '', area: ''}};
    cells.sort((l, r) => {
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
        setLatestResult(result);
    };

    return <React.Fragment>
    <div class="container">
        <form>
            <div class="row">
                <div class="col-sm-12 col-md-6 input-group fluid">
                    <label for="d-buff">デイリーバフ (x1.5)</label>
                    <span class="nowrap">
                        <label><input type="radio" name="d-buff" value="false" checked={dBuff === false} onClick={() => setDBuff(false)} />なし</label>
                        <label><input type="radio" name="d-buff" value="true" checked={dBuff === true} onClick={() => setDBuff(true)} />あり</label>
                    </span>
                </div>
                <div class="col-sm-12 col-md-6 input-group fluid">
                    <label for="m-buff">ミミッキバフ</label>
                    <select id="m-buff" onChange={(e) => setMBuff(parseInt(e.target.value))}>
                        {mBuffOptions}
                    </select>
                </div>
            </div>
        </form>
        <div class="row">
            <div class="col-sm-6 input-group fluid">
                <input
                    type="button"
                    class={selectedTab === 'calc' ? 'primary' : ''}
                    value="計算機"
                    onClick={() => setSelectedTab('calc')}
                />
            </div>
            <div class="col-sm-6 input-group fluid">
                <input
                    type="button"
                    class={selectedTab === 'history' ? 'primary' : ''}
                    value="計算結果履歴"
                    onClick={() => setSelectedTab('history')}
                />
            </div>
        </div>
        {selectedTab === 'calc' && <form>
            <div class="row">
                <div class="col-sm-12 col-md-4 input-group fluid">
                    <label for="cell">放置マス</label>
                    <select id="cell" onChange={selectCell}>
                        <option value="unselected">選択して下さい</option>
                        {cellOptions}
                    </select>
                </div>
                <div class="col-sm-12 col-md-4 input-group fluid">
                    <label for="lap">ラップ</label>
                    <input type="number" id="lap" value={lap} step="0.01" min="0" max="60" onChange={changeLap} placeholder="ラップタイムを入力" />
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12 col-md-4 input-group fluid">
                    <label for="lv">敵 Lv</label>
                    <input id="lv" value={cellsMap[selectedCell].lv} readOnly={true} />
                </div>
                <div class="col-sm-12 col-md-4 input-group fluid">
                    <label for="cont">大陸</label>
                    <input id="cont" value={cellsMap[selectedCell].cont} readOnly={true} />
                </div>
                <div class="col-sm-12 col-md-4 input-group fluid">
                    <label for="area">地域</label>
                    <input id="area" value={cellsMap[selectedCell].area} readOnly={true} />
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12 input-group fluid">
                    <input type="button" class="tertiary" value="予測ドロップ数を計算"  onClick={calc} />
                </div>
            </div>
        </form>}
        {selectedTab === 'calc' && latestResult && <div class="row">
            <div class="col-sm-12 col-md-4">
                <ResultCard dBuff={dBuff} mBuff={mBuff} result={latestResult} />
            </div>
        </div>}
        {selectedTab === 'history' && <div class="row">
            <div class="col-sm-12">
                ごめんまだです！過去の計算結果の履歴が見れて、結果を比較できる…ようになる予定。乞うご期待！
            </div>
        </div>}
    </div>
    </React.Fragment>
};

export default Form;