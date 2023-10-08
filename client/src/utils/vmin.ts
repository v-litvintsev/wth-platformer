export function vmin(percent: number) {
    return Math.min(
        (percent *
            Math.max(
                document.documentElement.clientHeight,
                window.innerHeight || 0
            )) /
        100,
        (percent *
            Math.max(
                document.documentElement.clientWidth,
                window.innerWidth || 0
            )) /
        100
    );
}