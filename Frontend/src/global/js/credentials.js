import lsAdapter from './lsAdapter';

const credentials = {
    get() {
        const username = lsAdapter.get('username');

        if (!username) {
            return null;
        }

        return { username };
    },
    set(username) {
        lsAdapter.set('username', username);
    },
    remove() {
        lsAdapter.remove('username');
    },
    exists() {
        return !!this.get();
    },
};

export default credentials;
