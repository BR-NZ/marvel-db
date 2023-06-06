import { useState, useCallback } from "react";

const useHttp = () => {
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [process, setProcess] = useState('waiting')

    const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-type': 'application/json'}) => {
        setLoading(true);
        setProcess('loading');

        try {
            const response = await fetch(url, {method, body, headers});
            if(!response.ok) throw new Error(`Could not fetch ${url}. Status: ${response.status}`);

            const data = await response.json();

            setLoading(false);
            return data;
        } catch(e) {
            setLoading(false);
            setError(e.message);
            setProcess('error');
            throw e;
        }
    }, [])

    const clearError = useCallback(() => {
        setError(null);
        setProcess('loading');
    }, [])

    return {error, setError, clearError, loading, setLoading, request, process, setProcess}
}

export default useHttp;