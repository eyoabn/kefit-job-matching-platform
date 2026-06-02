import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Select } from '@/components/ui/Select';
import { useJob, useCreateJob } from '@/hooks/useJobs';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

const jobSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Please select a category'),
  budget: z.string().transform(v => parseFloat(v)).refine(v => v > 0, 'Budget must be greater than 0'),
  deadline: z.string().min(1, 'Please select a deadline'),
  skills: z.string().min(1, 'Please specify at least one skill'),
});

type JobFormInput = z.input<typeof jobSchema>;
type JobFormOutput = z.output<typeof jobSchema>;

export const EditJobPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: job, isLoading } = useJob(id || '');
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<JobFormInput>({
    resolver: zodResolver(jobSchema) as any,
  });

  useEffect(() => {
    if (job) {
      reset({
        title: job.title,
        description: job.description,
        category: 'Development', // Mock category
        budget: job.budget.toString(),
        deadline: job.deadline,
        skills: job.skills.join(', '),
      });
    }
  }, [job, reset]);

  const onSubmit = async (data: any) => {
    const validatedData = data as JobFormOutput;
    try {
      // Mock update
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Job updated successfully!');
      navigate('/client/dashboard');
    } catch (e) {
      alert('Failed to update job.');
    }
  };

  if (isLoading) return (
    <DashboardLayout>
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-kefit-primary" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <section className="card-geometric p-8">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Job Posting</h1>
            <p className="text-slate-500 mt-1">Update your project details and requirements.</p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input 
              label="Job Title" 
              placeholder="e.g. Senior React Developer for Fintech App"
              error={errors.title?.message}
              {...register('title')}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <Select 
                label="Category"
                error={errors.category?.message}
                options={[
                  { label: 'Development', value: 'Development' },
                  { label: 'Design', value: 'Design' },
                  { label: 'Marketing', value: 'Marketing' },
                  { label: 'Writing', value: 'Writing' },
                ]}
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

            <Input 
              label="Application Deadline" 
              type="date"
              error={errors.deadline?.message}
              {...register('deadline')}
            />

            <TextArea 
              label="Job Description" 
              placeholder="Describe the project goals, requirements, and deliverables..."
              className="min-h-[200px]"
              error={errors.description?.message}
              {...register('description')}
            />

            <Input 
              label="Required Skills (Comma separated)" 
              placeholder="React, TypeScript, Node.js"
              error={errors.skills?.message}
              {...register('skills')}
            />

            <div className="pt-4 flex gap-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" isLoading={isSubmitting} leftIcon={<Save className="w-4 h-4" />}>
                Save Changes
              </Button>
            </div>
          </form>
        </section>
      </div>
    </DashboardLayout>
  );
};
