export function findOutlier(integers: number[]): number {
    let i = 1;
    const first = integers[0];
    const last = integers[integers.length - 1];
    let isEven, outlier = null;
    
    // check first and last values of array to determine type of the ints
    // if first and last values are opposite types, use the second 
    // value of the array to determine which one to return
    if (first % 2 === 0 && last % 2 === 0) isEven = true;
    else if (first % 2 === 1 && last % 2 === 1) isEven = false;
    else {
      if ((integers[1] % 2 === 0 && first % 2 === 0) || integers[1] % 2 === 1 && first % 2 === 1) outlier = last;
      else outlier = first;
    }

    // loop through array until you find outlier
    while (outlier === null) {
      if (isEven) {
        if (integers[i] % 2 === 1) outlier = integers[i];
        else i++;
      }
      else {
        if (integers[i] % 2 === 0) outlier = integers[i];
        else i++;
      }
    }
    return outlier;
}