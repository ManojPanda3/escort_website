import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { CheckCircle } from 'lucide-react'

const successVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-green-500",
  {
    variants: {
      variant: {
        default: "bg-green-50 text-green-700 border-green-200",
        outline: "border-green-200 text-green-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Success = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof successVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(successVariants({ variant }), className)}
    {...props}
  >
    <span className="flex items-center gap-2">
      <CheckCircle className="h-4 w-4" />
      {props.children}
    </span>
  </div>
))
Success.displayName = "Success"

export { Success }

