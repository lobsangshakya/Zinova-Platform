import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FormCardProps = {
	children: ReactNode;
	className?: string;
};

export function FormCard({ children, className }: FormCardProps) {
	return (
		<div
			className={cn(
				"w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8",
				className
			)}
		>
			{children}
		</div>
	);
}
