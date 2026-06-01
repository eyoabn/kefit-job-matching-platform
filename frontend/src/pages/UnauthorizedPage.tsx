import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

export const UnauthorizedPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-background">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-black text-kefit-red mb-4 tracking-tighter">
          403
        </h1>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Access Denied
        </h2>
        <p className="text-muted-foreground mb-6">
          You are logged in as a <span className="font-semibold text-foreground">{user?.role}</span>, 
          but this page is only accessible to other roles.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};