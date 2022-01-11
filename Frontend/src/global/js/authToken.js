import day from 'dayjs';
import jwtDecode from 'jwt-decode';
import lsAdapter from './lsAdapter.js';

const authToken = {
    get() {
        const token = lsAdapter.get('token');

        let decodedToken;

        try {
            decodedToken = jwtDecode(token);
        } catch (e) {
            return null;
        }

        const { exp } = decodedToken;

        const expires = day.unix(exp);

        if (!token || !expires) {
            return null;
        }

        return { token, expires };
    },
    set(token) {
        lsAdapter.set('token', token);
    },
    remove() {
        lsAdapter.remove('token');
    },
    exists() {
        return !!this.get();
    },
    valid() {
        if (!this.exists()) {
            return false;
        }

        const { exp } = jwtDecode(this.get().token);

        const expires = day.unix(exp);

        return day().isBefore(day(expires));
    },
};

export default authToken;
