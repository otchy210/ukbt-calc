import React, { useState, useEffect } from 'react';
import ResultCard from './ResultCard';
import { setLocal, getLocal } from '../common';

const Form = (props) => {
    const [loading, setLoading] = useState(true);
    const [buffs, setBuffs] = useState({d: undefined, m: 0});
    const setDBuff = (dBuff) => {
        const updatedBuffs = {...buffs, d: dBuff};
        setLocal('buffs', updatedBuffs);
        setBuffs(updatedBuffs);
    };
    const setMBuff = (mBuff) => {
        const updatedBuffs = {...buffs, m: mBuff};
        setLocal('buffs', updatedBuffs);
        setBuffs(updatedBuffs);
    };
    const [selectedTab, setSelectedTab] = useState('calc');
    const [selectedCell, setSelectedCell] = useState('unselected');
    const [lap, setLap] = useState(undefined);
    const [latestResult, setLatestResult] = useState(undefined);

    const mBuffOptions = [];
    const formatPercent = (lv) => {
        const numStr = (lv < 4 ? '0' : '') + (lv * 3);
        return `${numStr.substring(0, numStr.length - 1)}.${numStr.substring(numStr.length - 1)}%`;
    };
    for(let lv = 0; lv <= 100; lv++) {
        const percent = formatPercent(lv);
        const label = lv === 0 ? '----' : `Lv.${lv} [${percent}]`;
        mBuffOptions.push(<option value={lv} selected={lv === buffs.m}>{label}</option>);
    }

    useEffect(() => {
        const savedBuffs = getLocal('buffs');
        if (savedBuffs) {
            setBuffs(savedBuffs);
        } else {
            setDBuff(false);
            setMBuff(0);
        }
        setLoading(false);
    }, []);

    const {data} = props;
    const {a, b, cells} = data;
    const cellOptions = [];
    const cellsMap = {unselected: {lv: '', cont: '', area: ''}};
    cells.filter(cell => cell.type === 'Y').sort((l, r) => {
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
                        <label><input type="radio" name="d-buff" value="false" checked={buffs.d === false} onClick={() => setDBuff(false)} disabled={loading} />なし</label>
                        <label><input type="radio" name="d-buff" value="true" checked={buffs.d === true} onClick={() => setDBuff(true)} disabled={loading} />あり</label>
                    </span>
                </div>
                <div class="col-sm-12 col-md-6 input-group fluid">
                    <label for="m-buff">ミミッキバフ</label>
                    <select id="m-buff" onChange={(e) => setMBuff(parseInt(e.target.value))} disabled={loading}>
                        {mBuffOptions}
                    </select>
                </div>
            </div>
        </form>
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
                <div class="col-sm-12 col-md-4 input-group fluid">
                    <label for="cell">放置マス</label>
                    <select id="cell" onChange={selectCell} disabled={loading}>
                        <option value="unselected">選択して下さい</option>
                        {cellOptions}
                    </select>
                </div>
                <div class="col-sm-12 col-md-4 input-group fluid">
                    <label for="lap">ラップ</label>
                    <input type="number" id="lap" value={lap} step="0.01" min="0" max="60" onChange={changeLap} disabled={loading} placeholder="ラップタイムを入力" />
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12 col-md-4 input-group fluid">
                    <label for="lv">敵 Lv</label>
                    <input id="lv" value={cellsMap[selectedCell].lv} disabled={true} />
                </div>
                <div class="col-sm-12 col-md-4 input-group fluid">
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
        </form>}
        {selectedTab === 'calc' && latestResult && <div class="row">
            <div class="col-sm-12 col-md-4">
                <ResultCard buffs={buffs} result={latestResult} />
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