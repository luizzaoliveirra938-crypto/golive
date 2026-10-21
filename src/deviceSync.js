/** Merge a remote device into the local list (by id). */
export function mergeDevice(list, device) {
  if (!device?.id) return list
  const index = list.findIndex((item) => item.id === device.id)
  if (index === -1) return [device, ...list]
  const next = [...list]
  next[index] = { ...next[index], ...device }
  return next
}
