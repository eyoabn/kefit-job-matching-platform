import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, User, Briefcase, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
  role: z.enum(['Freelancer', 'Client']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting }, setError } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'Freelancer',
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
      });
      
      navigate(data.role === 'Client' ? '/client/dashboard' : '/dashboard');
    } catch (error: unknown) {
      if (error instanceof Response || (error && typeof error === 'object' && 'response' in error)) {
        const err = error as { response?: { data?: { detail?: string } } };
        if (err.response?.data?.detail) {
          setError('email', { message: err.response.data.detail });
        }
      } else {
        setError('email', { message: 'Registration failed. Please try again.' });
      }
    }
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join the leading marketplace for talent in Ethiopia"
    >
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-kefit-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setValue('role', 'Freelancer')}
            className={cn(
              "p-4 rounded-2xl border-2 transition-all text-left group",
              selectedRole === 'Freelancer' 
                ? "border-kefit-primary bg-kefit-primary/5 ring-4 ring-kefit-primary/10" 
                : "border-slate-100 hover:border-slate-200 bg-white"
            )}
          >
            <Briefcase className={cn(
              "w-6 h-6 mb-2",
              selectedRole === 'Freelancer' ? "text-kefit-primary" : "text-slate-400 group-hover:text-slate-600"
            )} />
            <p className={cn(
              "font-bold text-sm",
              selectedRole === 'Freelancer' ? "text-kefit-primary" : "text-slate-600"
            )}>Freelancer</p>
            <p className="text-[10px] text-slate-400 font-medium">I want to find projects</p>
          </button>

          <button
            type="button"
            onClick={() => setValue('role', 'Client')}
            className={cn(
              "p-4 rounded-2xl border-2 transition-all text-left group",
              selectedRole === 'Client' 
                ? "border-kefit-primary bg-kefit-primary/5 ring-4 ring-kefit-primary/10" 
                : "border-slate-100 hover:border-slate-200 bg-white"
            )}
          >
            <User className={cn(
              "w-6 h-6 mb-2",
              selectedRole === 'Client' ? "text-kefit-primary" : "text-slate-400 group-hover:text-slate-600"
            )} />
            <p className={cn(
              "font-bold text-sm",
              selectedRole === 'Client' ? "text-kefit-primary" : "text-slate-600"
            )}>Client</p>
            <p className="text-[10px] text-slate-400 font-medium">I want to hire talent</p>
          </button>
        </div>

        <Input
          label="Full Name"
          placeholder="e.g. Abebe Kebede"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full h-12 text-sm font-black shadow-lg shadow-kefit-primary/20" 
            isLoading={isSubmitting}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Create My Account
          </Button>
        </div>
      </form>

      <div className="mt-8 text-center text-sm">
        <span className="text-slate-500 font-medium">Already have an account? </span>
        <Link to="/login" className="text-kefit-primary font-bold hover:underline">
          Log in
        </Link>
      </div>

      <p className="mt-6 text-[10px] text-center text-slate-400 leading-relaxed font-medium">
        By creating an account, you agree to Kefit's <br />
        <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
      </p>
    </AuthLayout>
  );
};
