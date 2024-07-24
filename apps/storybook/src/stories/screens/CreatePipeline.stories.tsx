import React from 'react'
import Container from '../../components/layout/container'
import { GitnessNavbar } from '../components/NavBar.stories'
import { GitnessTopBar } from '../components/TopBar.stories'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button, Form, FormControl, FormField, FormItem, FormMessage, Input } from '@harnessio/canary'
import { MagicWandIcon, Pencil1Icon } from '@radix-ui/react-icons'

export default {
  title: 'Screens/Pipeline',
  parameters: {
    layout: 'fullscreen'
  }
}

const formSchema = z.object({
  prompt: z.string().min(2)
})

export function CreatePipeline() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: 'Create a pipeline to build and test a go binary'
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch('https://localhost:3000/api/v1/aiagent/generatePipeline', {
      method: 'POST',
      body: JSON.stringify({
        prompt: values.prompt,
        repo: {
          accountIdentifier,
          orgIdentifier,
          projectIdentifier,
          repoIdentifier
        }
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
      })
  }

  return (
    <Container.Root>
      <Container.Sidebar>
        <GitnessNavbar />
      </Container.Sidebar>
      <Container.Main>
        <Container.Topbar>
          <GitnessTopBar />
        </Container.Topbar>
        <div className="flex flex-col gap-7 w-[770px] mx-auto my-7">
          <h1 className="text-lg">Create Pipeline</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="AI Prompt" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex gap-4'>
              <Button type="submit" variant={'outline'} className='rounded-full'>
                <MagicWandIcon className='mr-2' /> Create with AI
              </Button>
              <Button variant={'outline'} className='rounded-full'>
                <Pencil1Icon className='mr-2' /> Start from scratch
              </Button>
              </div>

            </form>
          </Form>
        </div>
      </Container.Main>
    </Container.Root>
  )
}
