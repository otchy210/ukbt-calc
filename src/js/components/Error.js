import React from 'react';

const Error = (props) => {
    const {message} = props;
    return <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="card fluid error">
                    {message}
                </div>
            </div>
        </div>
    </div>
};

export default Error;