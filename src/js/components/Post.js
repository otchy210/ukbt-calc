import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { setLocal, getLocal } from '../common';

const typeMap = {
    'Y': '強化書',
    'R': '血石',
    'B': '魔法石',
    'N': '',
};

const Post = (props) => {
    const {loading, buffs, data, api} = props;

    const [name, setNameOrg] = useState('');
    const setName = (name) => {
        setLocal('name', name);
        setNameOrg(name);
    }
    const [selectedCell, setSelectedCell] = useState('unselected');
    const [lap, setLap] = useState('');
    const [timeSpent, setTimeSpent] = useState('3');
    const [count, setCount] = useState('');

    const selectedCellRef = useRef();
    useEffect(() => {
        const name = getLocal('name', '');
        setNameOrg(name);
        selectedCellRef.current.setCustomValidity('放置マスを選択して下さい');
    }, [])
    const[posting, setPosting] = useState(false);
    const[error, setError] = useState();

    const cells = data.cells.sort((l, r) => {
        if (l.x !== r.x) {
            return l.x - r.x;
        }
        return l.y - r.y;
    });
    const cellsMap = {unselected: {lv: '', cont: '', area: '', type: 'N'}};

    const selectCell = (e) => {
        const value = selectedCellRef.current.value;
        const customValidity = value === 'unselected' ? '放置マスを選択して下さい' : '';
        selectedCellRef.current.setCustomValidity(customValidity);
        setSelectedCell(value);
    };
    const changeLap = (e) => {
        setLap(e.target.value);
    }
    const post = (e) => {
        e.preventDefault();
        const payload = {
            buffs,
            name,
            selectedCell,
            lap: Number.parseFloat(lap),
            timeSpent: Number.parseFloat(timeSpent),
            count: Number.parseInt(count)
        };
        setPosting(true);
        fetch(api, {
            method: 'POST',
            'Content-Type': 'application/json; charset=utf-8',
            body: JSON.stringify(payload)
        }).then(
            r => r.json()
        ).then(json => {
            location.reload();
        }).catch(e => {
            console.error(e);
            setError(e.message);
        }).finally(() => {
            setPosting(false);
        });
    };

    return <form>
        <div class="row">
            <div class="col-sm-12 col-md-4 input-group fluid">
                <label for="name">名前</label>
                <input id="name" value={name} onChange={e => setNameOrg(e.target.value)} onBlur={e => setName(e.target.value)} disabled={loading} required={true} placeholder="名前入力" />
            </div>
            <div class="col-sm-6 col-md-4 input-group fluid">
                <label for="cell">放置マス</label>
                <select id="cell" ref={selectedCellRef} onChange={selectCell} disabled={loading}>
                    <option value="unselected">選択</option>
                    {cells.map(cell => {
                        const key = cell.key;
                        cellsMap[key] = cell;
                        return <option value={key} selected={selectedCell === key}>{key}</option>
                    })}
                </select>
            </div>
            <div class="col-sm-6 col-md-4 input-group fluid">
                <label for="lap">ラップ</label>
                <input type="number" id="lap" value={lap} step="0.01" min="0" max="60" onChange={changeLap} disabled={loading} required={true} placeholder="数値入力" />
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6 col-md-4 input-group fluid">
                <label for="timeSpent">放置時間</label>
                <select id="timeSpent" onChange={e => setTimeSpent(e.target.value)} disabled={loading}>
                    {['3','4','5','6','7','8','9'].map(h => {
                        const halfH = `${h}.5`;
                        return <>
                            <option value={h} selected={h === timeSpent}>{h} 時間</option>
                            <option value={halfH} selected={halfH === timeSpent}>{h} 時間半</option>
                        </>
                    })}
                </select>
            </div>
            <div class="col-sm-6 col-md-4 input-group fluid">
                <label for="count">ドロップ数</label>
                <input type="number" id="count" value={count} min="1" max="1000" onChange={e => setCount(e.target.value)} disabled={loading} required={true} placeholder="数値入力" />
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12 input-group fluid">
                <label for="type">タイプ</label>
                <input id="type" className={classNames('mode', cellsMap[selectedCell].type)} value={typeMap[cellsMap[selectedCell].type]} disabled={true} />
            </div>
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
        <div class="col-sm-12">
                ※報告前に「デイリーバフ」「ミミッキバフ」が正しいか確認をお願いします。
            </div>
            {error && <div class="col-sm-12">
                <div class="card fluid error">
                    エラー！[{error}]
                </div>
            </div>}
            <div class="col-sm-12 input-group fluid">
                <button class="tertiary" onClick={post} disabled={
                    loading ||
                    name.length === 0 ||
                    selectedCell === 'unselected' ||
                    lap.length === 0 ||
                    count.length === 0 ||
                    posting
                }>
                    {posting ? '送信中...' : '報告する'}
                </button>
            </div>
        </div>
    </form>
}

export default Post;