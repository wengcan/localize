export default function setValue(obj: any, path: string, value: string) {
    var a = path.split('.')
    var o = obj
    while (a.length - 1) {
        var n = a.shift()
        if (!(n! in o)) o[n!] = {}
        o = o[n!]
    }
    o[a[0]] = value
}
