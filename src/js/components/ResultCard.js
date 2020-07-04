import React from 'react';
import classNames from 'classnames';

const formatNum = (num) => {
    const numStr = Math.round(num * 100) + '';
    return `${numStr.substr(0, numStr.length - 2)}.${numStr.substring(numStr.length - 2)}`;
}

const padLeft = (num) => {
    return `${num < 10 ? '0' : ''}${num}`;
};

const formatDate = (ts) => {
    const d = new Date(ts);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const hour = d.getHours();
    const min = d.getMinutes();
    const sec = d.getSeconds();
    return `${year}-${padLeft(month)}-${padLeft(date)} ${padLeft(hour)}:${padLeft(min)}:${padLeft(sec)}`;
}

const rankMap = {1: '①', 2: '②', 3: '③'};

const ResultCard = (props) => {
    const {buffs, result, highlight, showRank, showPin} = props;
    const factor = (buffs.d ? 1.5 : 1.0) + (buffs.m * 3 / 1000);
    const lap = formatNum(result.lap);
    const num = formatNum(result.base * factor);
    const ts = formatDate(result.ts);
    return <div class="col-sm-12 col-md-6 col-lg-4">
        <div class={classNames('card', 'fluid', 'result', {'highlight': highlight})}>
            <div class="header">
                <h3>
                    {showRank && result.rank <= 3 && <span class={`rank-${result.rank}`}>{rankMap[result.rank]}</span>}
                    [{result.key}] {num} 個/h
                    <span class="sub-info">Lv.{result.lv} - {lap} 秒</span>
                </h3>
                {showPin && <h3 class="pin">☆</h3>}
            </div>
            <div class="ts">{ts}</div>
        </div>
    </div>;
};

export default ResultCard;