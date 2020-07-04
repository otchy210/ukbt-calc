import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import Calculator from './Calculator';
import Post from './Post';
import { setLocal, getLocal } from '../common';

const Form = (props) => {
    const {data, api} = props;

    const [loading, setLoading] = useState(true);
    const [mode, setModeOrg] = useState(undefined);
    const setMode = (mode) => {
        setLocal('mode', mode);
        setModeOrg(mode);
    };
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
        const mode = getLocal('mode') || 'K'
        setMode(mode);
        setLoading(false);
    }, []);

    return <>
    <div class="container">
        <form>
            <div class="row">
                <div class="col-sm-12 col-md-4 input-group fluid">
                    <label for="type">モード</label>
                    <select id="type" class={classNames('mode', mode)} value={mode} onChange={(e) => setMode(e.target.value)} disabled={loading}>
                        <option value="Y">強化書</option>
                        <option value="R">血石 (暫定)</option>
                        <option value="B">魔法石 (未)</option>
                        <option value="P">報告</option>
                    </select>
                </div>
                <div class="col-sm-12 col-md-4 input-group fluid">
                    <label for="d-buff">デイリーバフ (x1.5)</label>
                    <span class="nowrap">
                        <label><input type="radio" name="d-buff" value="false" checked={buffs.d === false} onClick={() => setDBuff(false)} disabled={loading} />なし</label>
                        <label><input type="radio" name="d-buff" value="true" checked={buffs.d === true} onClick={() => setDBuff(true)} disabled={loading} />あり</label>
                    </span>
                </div>
                <div class="col-sm-12 col-md-4 input-group fluid">
                    <label for="m-buff">ミミッキバフ</label>
                    <select id="m-buff" onChange={(e) => setMBuff(parseInt(e.target.value))} disabled={loading}>
                        {mBuffOptions}
                    </select>
                </div>
            </div>
        </form>
        {(mode === 'Y' || mode === 'R') && <Calculator loading={loading} type={mode} buffs={buffs} data={data} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />}
        {mode === 'B' && <div class="row">
            <div class="col-sm-12">
                <div class="card fluid">
                    データ不足でまだ使えません＞＜
                </div>
            </div>
        </div>}
        {mode === 'P' && <Post loading={loading} buffs={buffs} data={data} api={api} />}
    </div>
    </>
};

export default Form;