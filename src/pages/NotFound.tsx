import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <div className="text-center space-y-4">
        <div className="text-7xl font-bold bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text text-transparent">404</div>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Button asChild><Link to="/">Back home</Link></Button>
      </div>
    </div>
  );
}
