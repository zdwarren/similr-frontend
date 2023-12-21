
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = localStorage.getItem('authToken');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
        ...options.headers, // Include any additional headers
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response;
}

const toCamel = (s: string): string => {
    return s.replace(/([-_][a-z])/gi, ($1) => {
        return $1
            .toUpperCase()
            .replace('-', '')
            .replace('_', '');
    });
};

const isArray = function (a: any) {
    return Array.isArray(a);
};

const isObject = function (o: any) {
    return o === Object(o) && !isArray(o) && typeof o !== 'function';
};

const keysToCamel = function (o: any) {
    if (isObject(o)) {
        const n: any = {};

        Object.keys(o)
            .forEach((k) => {
                n[toCamel(k)] = keysToCamel(o[k]);
            });

        return n;
    } else if (isArray(o)) {
        return o.map((i: any) => {
            return keysToCamel(i);
        });
    }

    return o;
};

export { keysToCamel, fetchWithAuth };
