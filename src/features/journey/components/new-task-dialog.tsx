'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

import { useTaskStore } from '../utils/store';

export default function NewTaskDialog() {
  const addProspect = useTaskStore((state) => state.addProspect);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    if (
      typeof data.contactName !== 'string' ||
      typeof data.companyName !== 'string'
    )
      return;

    const contactMethods: ('email' | 'phone' | 'linkedin')[] = [];
    if (data.email === 'on') contactMethods.push('email');
    if (data.phone === 'on') contactMethods.push('phone');
    if (data.linkedin === 'on') contactMethods.push('linkedin');

    addProspect({
      contactName: data.contactName,
      companyName: data.companyName,
      status: 'INTERESTED',
      timeInStage: new Date(),
      nextAction: (data.nextAction as string) || undefined,
      source: (data.source as any) || 'Email',
      contactMethods,
      isActive: true
    });

    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='secondary' size='sm'>
          ＋ Add New Prospect
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add New Prospect</DialogTitle>
          <DialogDescription>
            Add a new prospect to your journey pipeline.
          </DialogDescription>
        </DialogHeader>
        <form
          id='prospect-form'
          className='grid gap-4 py-4'
          onSubmit={handleSubmit}
        >
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='contactName' className='text-right'>
              Name
            </Label>
            <Input
              id='contactName'
              name='contactName'
              placeholder='Contact name...'
              className='col-span-3'
              required
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='companyName' className='text-right'>
              Company
            </Label>
            <Input
              id='companyName'
              name='companyName'
              placeholder='Company name...'
              className='col-span-3'
              required
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='source' className='text-right'>
              Source
            </Label>
            <Select name='source' defaultValue='Email'>
              <SelectTrigger className='col-span-3'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='LinkedIn'>LinkedIn</SelectItem>
                <SelectItem value='Email'>Email</SelectItem>
                <SelectItem value='Phone'>Phone</SelectItem>
                <SelectItem value='Referral'>Referral</SelectItem>
                <SelectItem value='Website'>Website</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='nextAction' className='text-right'>
              Next Action
            </Label>
            <Input
              id='nextAction'
              name='nextAction'
              placeholder='Follow up call, email, etc...'
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-start gap-4'>
            <Label className='mt-2 text-right'>Contact Methods</Label>
            <div className='col-span-3 space-y-2'>
              <div className='flex items-center space-x-2'>
                <Checkbox id='email' name='email' />
                <Label htmlFor='email'>Email</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox id='phone' name='phone' />
                <Label htmlFor='phone'>Phone</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox id='linkedin' name='linkedin' />
                <Label htmlFor='linkedin'>LinkedIn</Label>
              </div>
            </div>
          </div>
        </form>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button type='submit' size='sm' form='prospect-form'>
              Add Prospect
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
