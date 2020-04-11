export function compose<T>(...fns: Array<Function>) {
    return function(arg: any): T {
        return fns.reduce((composed, f) => f(composed), arg);
    };
}

export function genId() {
    return `f${(+new Date).toString(16)}`;
}
