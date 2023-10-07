class CounterData {
  lastClick = ''
  counter = 0

  setLastClick = (payload: string) => {
    this.lastClick = payload
  }

  setCounter = (payload: number) => {
    this.counter = payload
  }
}

export default new CounterData()
