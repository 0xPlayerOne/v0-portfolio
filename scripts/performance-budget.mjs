export function checkMaximum(name, actual, maximum) {
  if (!Number.isFinite(actual)) {
    throw new Error(`${name} was not measured`)
  }

  if (actual > maximum) {
    throw new Error(`${name} exceeded its budget: ${actual} > ${maximum}`)
  }

  return `${name}: ${actual} <= ${maximum}`
}

export function checkMinimum(name, actual, minimum) {
  if (!Number.isFinite(actual)) {
    throw new Error(`${name} was not measured`)
  }

  if (actual < minimum) {
    throw new Error(`${name} missed its budget: ${actual} < ${minimum}`)
  }

  return `${name}: ${actual} >= ${minimum}`
}
