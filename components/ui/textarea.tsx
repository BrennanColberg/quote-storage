import * as React from "react"

import { cn } from "@/lib/shadcn"
import { ControllerRenderProps } from "react-hook-form"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  field?: ControllerRenderProps<any, any>
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, field, ...props }, ref) => {
    if (field) {
      props.onChange = props.onChange ?? field.onChange
      props.value = props.value ?? field.value
    }
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = "Textarea"

export { Textarea }
