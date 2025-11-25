"use client";

import * as React from "react";
import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils"; 

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadixRadioGroup.Root>,
  React.ComponentPropsWithoutRef<typeof RadixRadioGroup.Root>
>(({ className, ...props }, ref) => (
  <RadixRadioGroup.Root
    ref={ref}
    className={cn("flex flex-col space-y-2", className)}
    {...props}
  />
));
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadixRadioGroup.Item>,
  React.ComponentPropsWithoutRef<typeof RadixRadioGroup.Item>
>(({ className, children, ...props }, ref) => (
  <RadixRadioGroup.Item
    ref={ref}
    className={cn(
      "h-4 w-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none",
      className
    )}
    {...props}
  >
    <RadixRadioGroup.Indicator className="flex items-center justify-center w-full h-full">
      <div className="h-2 w-2 rounded-full bg-blue-500" />
    </RadixRadioGroup.Indicator>
  </RadixRadioGroup.Item>
));
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
