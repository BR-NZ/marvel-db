import { useState, useCallback } from "react";

const useHttp = () => {
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)

    const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-type': 'application/json'}) => {
        setLoading(true);
        try {
            const response = await fetch(url, {method, body, headers});
            if(!response.ok) throw new Error(`Could not fetch ${url}. Status: ${response.status}`);

            const data = await response.json();

            setLoading(false);
            return data;
        } catch(e) {
            setLoading(false);
            setError(e.message);
            throw e;
        }
    }, [])

    const clearError = useCallback(() => {
        setError(null);
    }, [])

    return {error, setError, loading, setLoading, request, clearError}
}

export default useHttp;