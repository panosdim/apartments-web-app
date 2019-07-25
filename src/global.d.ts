// eslint-disable-next-line @typescript-eslint/no-unused-vars
import reactn from 'reactn';
import { UserType, FlatType, LesseeType } from './model';

declare module 'reactn/default' {
    interface State {
        isLoggedIn: boolean;
        user: UserType;
        flats: FlatType[];
        selectedFlat: FlatType;
        selectedLessee: LesseeType;
        allLessees: LesseeType[];
        selectedBalance: BalanceType;
        allBalance: BalanceType[];
    }
}
