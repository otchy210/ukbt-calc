import React from 'react';

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
    return `${year}-${month}-${date} ${padLeft(hour)}:${padLeft(min)}:${padLeft(sec)}`;
}

const ResultCard = (props) => {
    const {buffs, result} = props;
    const factor = (buffs.d ? 1.5 : 1.0) + (buffs.m * 3 / 1000);
    const lap = formatNum(result.lap);
    const num = formatNum(result.base * factor);
    const ts = formatDate(result.ts);
    return <div class="card fluid result">
        <h3>[{result.key}] {num} 個/h <span class="smaller-font">Lv.{result.lv} - {lap} 秒</span></h3>
        <div class="ts">{ts}</div>
    </div>;
};

export default ResultCard;