import lsTest from "./lsTest"

const lsAdapter = {
    get(key) {
        if (!lsTest()) {
            return null;
        }

        return localStorage.getItem(key);
    },
    set(key, value) {
        if (!lsTest()) {
            return null;
        }

        localStorage.setItem(key, value);
    },
    remove(key) {
        if (!lsTest()) {
            return null;
        }

        localStorage.removeItem(key);
    },
};

export default lsAdapter;