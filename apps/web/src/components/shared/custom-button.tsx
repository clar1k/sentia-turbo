import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ComponentProps, HTMLProps } from "react";

export const CustomButton = ({
  className,
  children,
  ...props
}: ComponentProps<"button">) => {
  return (
    <Button
      className={cn(
        "mx-2 cursor-pointer justify-start gap-2 rounded-xl border-blue-500 bg-blue-500 text-white duration-300 hover:border-blue-600 hover:bg-blue-600",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
};
