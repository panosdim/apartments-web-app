// eslint-disable-next-line @typescript-eslint/no-unused-vars
import reactn from 'reactn';
import { UserType, FlatType } from './model';

declare module 'reactn/default' {
    interface State {
        isLoggedIn: boolean;
        user: UserType;
        flats: FlatType[];
    }
}
