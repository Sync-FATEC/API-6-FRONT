"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/utils/className";

export const Tabs = TabsPrimitive.Root;

export const TabsList = ({ className, ...props }: TabsPrimitive.TabsListProps) => (
  <TabsPrimitive.List
    className={cn("flex border-b border-slate-200", className)}
    {...props}
  />
);

export const TabsTrigger = ({
  className,
  ...props
}: TabsPrimitive.TabsTriggerProps) => (
  <TabsPrimitive.Trigger
    className={cn(
      "px-4 py-2 text-sm font-medium transition-colors border-b-2 ",
      "data-[state=active]:border-primary data-[state=active]:text-primary",
      "border-transparent text-slate-500 hover:text-slate-700 cursor-pointer",
      className
    )}
    {...props}
  />
);

export const TabsContent = ({
  className,
  ...props
}: TabsPrimitive.TabsContentProps) => (
  <TabsPrimitive.Content className={cn("mt-2", className)} {...props} />
);