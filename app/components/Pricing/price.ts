/**
 * A price that contains a figure ("$40.00") is the dominant datum of the card
 * and takes `display-sm` (36 / 700). A price that is a word ("Custom" /
 * "A cotizar") is not a figure and steps down to `headline-sm` (24 / 500),
 * so the four cards keep reading as one grid.
 */
export function isAmountPrice(price: string | undefined | null): boolean {
  return /\d/.test(price ?? '')
}
