export function delay(delayTime: number) {
  return new Promise((resolve) => setTimeout(resolve, delayTime))
}
