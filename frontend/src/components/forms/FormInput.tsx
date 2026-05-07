import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
	label: string;
	id: string;
};

export function FormInput({
	label,
	id,
	className,
	required,
	...props
}: FormInputProps) {
	return (
		<div className="space-y-2">
			<label htmlFor={id} className="block text-sm font-medium text-slate-700">
				{label}
			</label>
			<input
				id={id}
				required={required}
				className={cn(
					"block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400",
					"focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200",
					"disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
					className
				)}
				{...props}
			/>
		</div>
	);
}
