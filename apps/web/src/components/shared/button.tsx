import { Button } from "@/components/ui/button";
import type { ComponentProps, HTMLProps } from "react";

export const CustomButton = ({
  className,
  children,
  ...props
}: ComponentProps<"button">) => {
  return (
    <Button
      variant="outline"
      className="mx-2 cursor-pointer justify-start gap-2 rounded-xl duration-300 hover:bg-gray-100"
      {...props}
    >
      {children}
    </Button>
  );
};
