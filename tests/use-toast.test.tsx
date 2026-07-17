import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, jest } from 'bun:test'

import { reducer, toast, useToast } from '@/hooks/use-toast'

describe('toast state', () => {
  afterEach(() => {
    jest.useRealTimers()
  })

  it('adds, updates, dismisses, and removes toasts', () => {
    const first = { id: 'first', title: 'First', open: true }
    const second = { id: 'second', title: 'Second', open: true }

    let state = reducer({ toasts: [] }, { type: 'ADD_TOAST', toast: first })
    state = reducer(state, { type: 'ADD_TOAST', toast: second })
    expect(state.toasts).toEqual([second])

    state = reducer(state, {
      type: 'UPDATE_TOAST',
      toast: { id: 'second', title: 'Updated' },
    })
    expect(state.toasts[0]).toMatchObject({ title: 'Updated' })

    state = reducer(state, { type: 'DISMISS_TOAST', toastId: 'second' })
    expect(state.toasts[0]?.open).toBe(false)
    expect(reducer(state, { type: 'REMOVE_TOAST', toastId: 'second' }).toasts).toEqual([])
    expect(reducer(state, { type: 'REMOVE_TOAST' }).toasts).toEqual([])
  })

  it('notifies the hook when toast helpers mutate state', () => {
    jest.useFakeTimers()
    const { result, unmount } = renderHook(() => useToast())

    let controls!: ReturnType<typeof toast>
    act(() => {
      controls = toast({ title: 'Saved' })
    })
    expect(result.current.toasts[0]).toMatchObject({
      id: controls.id,
      title: 'Saved',
      open: true,
    })

    act(() => {
      controls.update({ id: controls.id, title: 'Updated' })
    })
    expect(result.current.toasts[0]?.title).toBe('Updated')

    act(() => {
      result.current.toasts[0]?.onOpenChange?.(false)
    })
    expect(result.current.toasts[0]?.open).toBe(false)

    act(() => {
      jest.runAllTimers()
    })
    expect(result.current.toasts).toEqual([])
    unmount()
  })
})
