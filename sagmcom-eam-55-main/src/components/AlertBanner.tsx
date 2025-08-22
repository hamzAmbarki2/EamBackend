import { AlertTriangle, RefreshCw } from "lucide-react";

interface AlertBannerProps {
	message: string;
	onRetry?: () => void;
}

export function AlertBanner({ message, onRetry }: AlertBannerProps) {
	return (
		<div className="w-full mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 flex items-center justify-between">
			<div className="flex items-center gap-2">
				<AlertTriangle className="h-4 w-4" />
				<span className="text-sm">{message}</span>
			</div>
			{onRetry && (
				<button
					onClick={onRetry}
					className="inline-flex items-center gap-2 rounded-md border border-red-400/30 px-3 py-1 text-xs text-red-200 hover:bg-red-400/10"
				>
					<RefreshCw className="h-3 w-3" /> Réessayer
				</button>
			)}
		</div>
	);
}