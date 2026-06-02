import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Select } from '@/components/ui/Select';
import { useCreateJob } from '@/hooks/useJobs';
import { ArrowLeft, Send } from 'lucide-react';

const jobSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  category: z.string().min(1, 'Please select a category'),
  budget: z.string().transform(v => parseFloat(v)).refine(v => v > 0, 'Budget must be greater than 0'),
  deadline: z.string().min(1, 'Please select a deadline'),
  skills: z.string().min(1, 'Please specify at least one skill'),
});

type JobFormInput = z.input<typeof jobSchema>;
type JobFormOutput = z.output<typeof jobSchema>;

export const PostJobPage = () => {
  const navigate = useNavigate();
  const { mutateAsync: createJob } = useCreateJob();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<JobFormInput>({
    resolver: zodResolver(jobSchema) as any,
  });

  const onSubmit = async (data: any) => {
    const validatedData = data as JobFormOutput;
    try {
      await createJob({
        ...validatedData,
        deadline: new Date(validatedData.deadline).toISOString(),
        skills: validatedData.skills.split(',').map(s => s.trim()),
        status: 'Open',
      } as any);
      navigate('/client/dashboard');
    } catch (e: any) {
      alert(`Failed to post job: ${e.response?.data?.detail || e.message || 'Please try again.'}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="card-geometric p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Post a Job Listing</h1>
            <p className="text-slate-500 mt-1">Provide clear details to attract the best Ethiopian freelancers.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input 
              label="Job Title" 
              placeholder="e.g. Senior Mobile Developer for Fintech App" 
              error={errors.title?.message}
              {...register('title')}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <Select 
                label="Category" 
                options={[
                  { label: 'Select Category', value: '' },
                  { label: 'Software Development', value: 'dev' },
                  { label: 'Design & Creative', value: 'design' },
                  { label: 'Digital Marketing', value: 'marketing' },
                  { label: 'Writing & Translation', value: 'writing' },
                ]}
                error={errors.category?.message}
                {...register('category')}
              />
              <Input 
                label="Budget (ETB)" 
                type="number" 
                placeholder="50,000"
                error={errors.budget?.message}
                {...register('budget')}
              />
            </div>

            <TextArea 
              label="Job Description" 
              placeholder="Describe the project goals, requirements, and deliverables..."
              error={errors.description?.message}
              {...register('description')}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <Input 
                label="Application Deadline" 
                type="date"
                error={errors.deadline?.message}
                {...register('deadline')}
              />
              <Input 
                label="Required Skills (Comma separated)" 
                placeholder="React, TypeScript, Node.js"
                error={errors.skills?.message}
                {...register('skills')}
              />
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                Save as Draft
              </Button>
              <Button type="submit" isLoading={isSubmitting} leftIcon={<Send className="w-4 h-4" />}>
                Post Job Now
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
