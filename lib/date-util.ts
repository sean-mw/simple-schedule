export const generateDailyTimes = (increment: number) => {
  const times = []
  for (let hour = 1; hour <= 12; hour++) {
    for (let minute = 0; minute < 60; minute += increment) {
      const displayMinute = minute.toString().padStart(2, '0')
      times.push(`${hour}:${displayMinute}`)
    }
  }
  return times
}

export const convertToDate = (time: string, period: string, date: Date) => {
  const [hour, minute] = time.split(':').map(Number)
  const adjustedHour =
    period === 'PM' && hour !== 12
      ? hour + 12
      : hour === 12 && period === 'AM'
        ? 0
        : hour
  const newDate = new Date(date)
  newDate.setHours(adjustedHour, minute)
  return newDate
}
