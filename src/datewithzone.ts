import { timeToUntilString, datetime } from './dateutil'

export class DateWithZone {
  public date: Date
  public tzid?: string | null

  constructor(date: Date, tzid?: string | null) {
    if (isNaN(date.getTime())) {
      throw new RangeError('Invalid date passed to DateWithZone')
    }
    this.date = date
    this.tzid = tzid
  }

  private get isUTC() {
    return !this.tzid || this.tzid.toUpperCase() === 'UTC'
  }

  public toString() {
    const datestr = timeToUntilString(this.date.getTime(), this.isUTC)
    if (!this.isUTC) {
      return `;TZID=${this.tzid}:${datestr}`
    }

    return `:${datestr}`
  }

  public getTime() {
    return this.date.getTime()
  }

  public rezonedDate() {
    if (this.isUTC) {
      return this.date
    }

    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const dateInLocalTZ = new Date(
      this.date.toLocaleString(undefined, {
        dateStyle: 'short',
        timeStyle: 'short',
        hour12: false,
        timeZone: localTimeZone,
      })
    )
    const dateInTargetTZ = new Date(
      this.date.toLocaleString(undefined, {
        dateStyle: 'short',
        timeStyle: 'short',
        hour12: false,
        timeZone: this.tzid ?? 'UTC',
      })
    )
    const tzOffset = dateInTargetTZ.getTime() - dateInLocalTZ.getTime()
    console.log({
      local: this.date.toLocaleString(undefined, {
        dateStyle: 'short',
        timeStyle: 'short',
        hour12: false,
        timeZone: localTimeZone,
      }),
      target: this.date.toLocaleString(undefined, {
        dateStyle: 'short',
        timeStyle: 'short',
        hour12: false,
        timeZone: this.tzid ?? 'UTC',
      }),
      date: this.date,
      localTimeZone,
      targetTimeZone: this.tzid ?? 'UTC',
      dateInLocalTZ,
      dateInTargetTZ,
      tzOffset,
      tzOffset_1000: tzOffset / 1000,
      tzOffset_1000_60: tzOffset / 1000 / 60,
      tzOffset_1000_60_60: tzOffset / 1000 / 60 / 60,
    })

    return new Date(this.date.getTime() - tzOffset)
  }
}
