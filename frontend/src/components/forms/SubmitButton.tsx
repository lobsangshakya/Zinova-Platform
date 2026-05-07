import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	loading?: boolean;
	children: ReactNode;
};

export function SubmitButton({
	loading = false,
	children,
	className,
	disabled,
	...props
}: SubmitButtonProps) {
	return (
		<button
			type="submit"
			className={cn(
				"inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white",
				"transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300",
				"disabled:cursor-not-allowed disabled:bg-slate-400",
				className
			)}
			disabled={loading || disabled}
			{...props}
		>
			{loading ? "Signing in..." : children}
		</button>
	);
}
