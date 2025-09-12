import * as LabelPrimitive from '@radix-ui/react-label'
import * as React from 'react'
import { cn } from '../../lib/utils'

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none',
        'group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        "peer-required:after:text-destructive relative peer-required:after:ml-1 peer-required:after:content-['*']",
        className,
      )}
      {...props}
    />
  )
}

export { Label }
