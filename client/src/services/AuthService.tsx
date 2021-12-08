export const getUser = (): {exp: number, first_name: string, group: string, id: number, jti: string, last_name: string, photo: null, token_type:string, username: string} | undefined=> {
    const auth = JSON.parse(window.localStorage.getItem('taxi.auth') || 'null');
    if (auth) {
        const [, payload,] = auth.access.split('.');
        const decoded = window.atob(payload);
        console.log(JSON.parse(decoded))
        return JSON.parse(decoded);
    }
    return undefined;
};

export const isDriver = () => {
    const user = getUser();
    return user && user.group === 'driver';
};

export const isRider = () => {
    const user = getUser();
    return user && user.group === 'rider';
};

export const getAccessToken = () => {
    const auth = JSON.parse(window.localStorage.getItem('taxi.auth') || 'null');
    if (auth) {
      return auth.access;
    }
    return undefined;
  };