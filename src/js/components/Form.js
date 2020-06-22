import React, { useState } from 'react';

const Form = (props) => {
    const [selectedCell, setSelectedCell] = useState('unselected');

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

    return <form>
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
    </form>
};

export default Form;