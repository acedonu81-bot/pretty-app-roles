import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#1a1a1a] group-[.toaster]:text-[#f0f0f0] group-[.toaster]:border-[rgba(212,175,55,0.25)] group-[.toaster]:shadow-[0_4px_20px_rgba(0,0,0,0.5)]",
          description: "group-[.toast]:text-[#8E8EA0]",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toaster]:!border-[rgba(34,197,94,0.3)]",
          error: "group-[.toaster]:!border-[rgba(255,95,86,0.3)]",
          info: "group-[.toaster]:!border-[rgba(212,175,55,0.3)]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
