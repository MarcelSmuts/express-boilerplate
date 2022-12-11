export default function round (value, precision) {
  var multiplier = Math.pow(10, precision || 0)
  const rounded = Math.round(value * multiplier) / multiplier
  const fixed = rounded.toFixed(precision)
  return parseFloat(fixed)
}
