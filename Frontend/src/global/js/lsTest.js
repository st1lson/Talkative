const lsTest = () => {
    const test = 'test';
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);

        return true;
    } catch {
        return false;
    }
};

export default lsTest;