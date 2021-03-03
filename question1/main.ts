export function isValidWalk(walk: string[]) {
    const location = {
        ns: 0,
        ew: 0
    }
    for (let i = 0; i < walk.length; i++) {
        if (walk[i] === "n") location["ns"]++;
        else if (walk[i] === "s") location["ns"]--;
        else if (walk[i] === "e") location["ew"]++;
        else if (walk[i] === "w") location["ns"]--;
    }
    return location["ns"] === 0 && location["ew"] === 0;
}

