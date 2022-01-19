const getToken = () => {
    const auth = JSON.parse(window.localStorage.getItem('taxi.auth') || 'null');
    if (auth) {
      return auth.access;
    } else {
        return undefined;
    }
  };

export default getToken