import { Loader2 } from "lucide-react";

export default function AppLoading() {
  // This loading UI will be shown while navigating within the (app) group
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
}
