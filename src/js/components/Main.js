import React, { useState, useEffect } from 'react';
import Error from './Error';
import Loading from './Loading';
import Form from './Form';

const Main = () => {
    const [api, setApi] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState(undefined);

    const getParams = () => {
        const query = location.search;
        if (!query || !query.startsWith('?')) {
            return {};
        }
        const kvStr = query.substr(1);
        const kv = kvStr.split('&');
        const result = {};
        kv.forEach(kv => {
            const [k, v] = kv.split('=');
            result[k] = v;
        })
        return result;
    };

    useEffect(() => {
        const params = getParams();
        const { key } = params;
        if (!key) {
            setLoading(false);
            setError('パラメータ key がセットされていません。');
            return;
        }
        const api = `https://script.google.com/macros/s/${key}/exec?v=2`;
        setApi(api);
        fetch(api).then((res) => {
            res.json().then(data => {
                setLoading(false);
                setData(data);
            });
        }).catch((err) => {
            setLoading(false);
            const errMessage = err.toString();
            setError(`読み込みに失敗しました (${errMessage})`);
        });
    }, []);

    return <React.Fragment>
        {error !== '' && <Error message={error} />}
        {loading && <Loading />}
        {!loading && data && <Form data={data} api={api} />}
    </React.Fragment>
};

export default Main;