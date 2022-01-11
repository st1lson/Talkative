import lsAdapter from "./IsAdapter"

const credentials = {
    get() {
        const username = lsAdapter.get('username');
        const email = lsAdapter.get('email');

        if (!username || !email) {
            return null;
        }

        return { username, email };
    },
    set(username, email) {
        lsAdapter.set('username', username);
        lsAdapter.set('email', email);
    },
    remove() {
        lsAdapter.remove('username');
        lsAdapter.remove('email');
    },
    exists() {
        return !!this.get();
    }
};

export default credentials;