import React from 'react';

const Error = (props) => {
    const {message} = props;
    return <div class="card error">{message}</div>
};

export default Error;