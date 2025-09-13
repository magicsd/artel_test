import { CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { cn } from '../lib/utils'
import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

export type DatePickerProps = {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  id?: string
  disabled?: boolean
  invalid?: boolean
  className?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Выбрать дату',
  id = 'date',
  disabled,
  invalid,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(value)

  React.useEffect(() => {
    setInternalDate(value)
  }, [value])

  const selected = value ?? internalDate

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id={id}
          disabled={disabled}
          className={cn('w-48 justify-between font-normal', invalid && 'border-red-500', className)}
        >
          {selected ? selected.toLocaleDateString() : placeholder}
          <CalendarIcon className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          captionLayout="dropdown"
          onSelect={(date) => {
            if (onChange) {
              onChange(date)
            } else {
              setInternalDate(date)
            }
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
