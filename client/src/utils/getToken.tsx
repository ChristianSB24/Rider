const getToken = () => {
    const auth = JSON.parse(window.localStorage.getItem('taxi.auth') || 'null');
    if (auth) {
      return auth.access;
    }
    return undefined;
  };

export default getToken