export function msToTimestamp(duration: number): string {

    let seconds: number | string = Math.floor((duration / 1000) % 60)

    let minutes: number | string = Math.floor((duration / (1000 * 60)) % 60)

    let hours: number | string = Math.floor((duration / (1000 * 60 * 60)) % 24)

    hours < 1 ? hours = "" : hours = hours + ":"

    if (minutes < 1) minutes = "00:"

    else if (minutes < 10) minutes = "0" + minutes + ":"

    else minutes = minutes + ":"

    seconds < 10 ? seconds = "0" + seconds : seconds = seconds.toString()

    return hours + minutes  + seconds
}