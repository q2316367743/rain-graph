export function getDefaultDataByItems(): Array<Record<string, any>> {
    return [{
        'Mon': 111,
        'Tue': 222,
        Wed: 333,
        'Thu': 444,
        Fri: 123,
        Sat: 324,
        Sun: '213'
    }];
}

export function getDefaultDataByHeaders(): Array<string> {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
}