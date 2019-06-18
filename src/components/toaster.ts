import { Position, Toaster, Classes } from '@blueprintjs/core';

/** Singleton toaster instance. Create separate instances for different options. */
export const AppToaster = Toaster.create({
    className: Classes.TOAST_CONTAINER,
    position: Position.TOP,
});
