import * as React from "react"

import { cn } from "@/lib/shadcn"
import { ControllerRenderProps } from "react-hook-form"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  field?: ControllerRenderProps<any, any>
  setValue?: (value: string) => void
  setValueAsNumber?: (value: number) => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, field, setValue, setValueAsNumber, ...props }, ref) => {
    if (field) {
      props.onChange =
        props.onChange ??
        (type === "number"
          ? (e) => field.onChange({ target: { value: Number(e.target.value) } })
          : field.onChange)
      props.value = props.value ?? field.value
    }
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        onChange={(e) => {
          props.onChange?.(e)
          setValue?.(e.target.value)
          setValueAsNumber?.(Number(e.target.value))
        }}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

export { Input }
