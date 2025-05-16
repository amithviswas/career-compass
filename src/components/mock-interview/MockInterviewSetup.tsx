
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, PlayCircle } from "lucide-react";

const JOB_ROLES = [
  "Software Engineer", "Data Analyst", "Product Manager", "UX Designer", 
  "Marketing Manager", "Project Manager", "Sales Representative", 
  "Human Resources Specialist", "Business Analyst", "Customer Support Representative", "Other"
];
// Updated company list
const COMPANIES = [
  "Google", "Amazon", "Microsoft", "Meta", "Netflix", "Apple", 
  "Salesforce", "Adobe", "IBM", "Oracle", "Startup (General)", "Mid-size Tech Company", "Other"
];

const setupFormSchema = z.object({
  selectedJobRole: z.string().min(1, { message: "Please select a job role." }),
  customJobRole: z.string().optional(),
  selectedCompany: z.string().min(1, { message: "Please select a company." }),
  customCompany: z.string().optional(),
}).refine(data => data.selectedJobRole !== 'Other' || (data.customJobRole && data.customJobRole.trim().length >= 3), {
  message: "Custom job role must be at least 3 characters if 'Other' is selected.",
  path: ["customJobRole"],
}).refine(data => data.selectedCompany !== 'Other' || (data.customCompany && data.customCompany.trim().length >= 2), {
  message: "Custom company name must be at least 2 characters if 'Other' is selected.",
  path: ["customCompany"],
});

export type SetupFormValues = z.infer<typeof setupFormSchema>;

interface MockInterviewSetupProps {
  onSubmit: (values: SetupFormValues) => Promise<void>;
  isLoading: boolean;
}

export function MockInterviewSetup({ onSubmit, isLoading }: MockInterviewSetupProps) {
  const form = useForm<SetupFormValues>({
    resolver: zodResolver(setupFormSchema),
    defaultValues: {
      selectedJobRole: "",
      customJobRole: "",
      selectedCompany: "",
      customCompany: "",
    },
  });

  const watchSelectedJobRole = form.watch("selectedJobRole");
  const watchSelectedCompany = form.watch("selectedCompany");

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Mock Interview Setup</CardTitle>
        <CardDescription>
          Select or enter the job role and company you want to practice for. The interview will have two parts: Multiple Choice Questions (MCQs) and Descriptive Questions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="selectedJobRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Target Job Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a job role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {JOB_ROLES.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose the role you're targeting.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {watchSelectedJobRole === "Other" && (
              <FormField
                control={form.control}
                name="customJobRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specify Job Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Machine Learning Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="selectedCompany"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Target Company</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COMPANIES.map(company => (
                        <SelectItem key={company} value={company}>{company}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose the company or type 'Other'.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {watchSelectedCompany === "Other" && (
              <FormField
                control={form.control}
                name="customCompany"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specify Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Innovatech Solutions Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparing Interview...
                </>
              ) : (
                <>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Start Mock Interview
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

