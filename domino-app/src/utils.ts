export const faces:{[i:string]:Array<number>} = {
    '0H': [],
    '0V': [],
    '1H': [4],
    '1V': [4],
    '2H': [0, 8],
    '2V': [2, 6],
    '3H': [0, 4, 8],
    '3V': [2, 4, 6],
    '4H': [0, 2, 6, 8],
    '4V': [0, 2, 6, 8],
    '5H': [0, 2, 4, 6, 8],
    '5V': [0, 2, 4, 6, 8],
    '6H': [0, 1, 2, 6, 7, 8],
    '6V': [0, 2, 3, 5, 6, 8],
}

export const checkDouble = (points: Array<number>) => {
    return points.length === 2 && points[0] === points[1];
}