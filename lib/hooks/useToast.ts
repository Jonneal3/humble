import * as React from "react"

type ToastActionElement = React.ReactElement

export type ToastProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string
  description?: string
  action?: ToastActionElement
  variant?: "default" | "destructive"
}

type State = {
  toasts: ToastProps[]
}

const initialState: State = {
  toasts: [],
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = initialState

function dispatch(action: { type: "ADD_TOAST" | "DISMISS_TOAST"; toast?: ToastProps; toastId?: string }) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

function reducer(state: State, action: { type: "ADD_TOAST" | "DISMISS_TOAST"; toast?: ToastProps; toastId?: string }): State {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [...state.toasts, action.toast!],
      }
    case "DISMISS_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

function toast({ ...props }: ToastProps) {
  const id = Math.random().toString(36).substring(2, 9)
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
    },
  })
  return id
}

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
} 