type Fn = (...args: any) => any;
type FnToVoid<T extends Fn> = (...args: Parameters<T>) => void;

/**
 * 
 * this provides the ability to debounce frequent calls and execute in a periodical way.
 * 
 * @param func the function that is to be scheduled
 * @param wait the minimum interval of 2 invocations for the function
 * @param context
 */
export function periodicize<T extends Fn>(func: T, wait: number, context: any): FnToVoid<T> {
    let timer: any;

    let latestTimerStartsTimestamp: number = 0;

    let waitListLength = 0;

    const periodicizer = function(...args: Parameters<T>) {
        if (!timer) {
            func.apply(context, args);
            timer = -1;
            return;
        }

        const fromLastCall = latestTimerStartsTimestamp ? Date.now() - latestTimerStartsTimestamp : -1;
        if (fromLastCall > 0 && fromLastCall < wait) {
            const delay = wait - fromLastCall + wait * waitListLength;
            setTimeout(() => periodicizer(...args), delay);
            waitListLength++;
            return;
        }

        if (waitListLength > 0) {
            waitListLength--;
        }

        latestTimerStartsTimestamp = Date.now();
        timer = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };

    return periodicizer;
}
