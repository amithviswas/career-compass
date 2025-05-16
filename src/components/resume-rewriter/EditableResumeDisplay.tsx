"use client";

import type { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import type { RewriteResumeOutput, WorkExperience, Education } from '@/ai/flows/resume-rewriter-flow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { User, Briefcase, GraduationCap, Award, List, PlusCircle, Trash2, Info } from 'lucide-react';
import { Separator } from '../ui/separator';

interface EditableResumeDisplayProps {
  initialData: RewriteResumeOutput;
  onUpdate: (updatedData: RewriteResumeOutput) => void;
}

// Helper to convert bullet string to array and back for textareas
const bulletsToArray = (text: string | undefined): string[] => text ? text.split('\n').map(s => s.replace(/^[-*]\s*/, '').trim()).filter(Boolean) : [];
const arrayToBullets = (arr: string[]): string => arr.map(s => `- ${s.trim()}`).join('\n');

export function EditableResumeDisplay({ initialData, onUpdate }: EditableResumeDisplayProps) {
  const [resumeData, setResumeData] = useState<RewriteResumeOutput>(initialData);

  useEffect(() => {
    setResumeData(initialData);
  }, [initialData]);

  const handleChange = (section: keyof RewriteResumeOutput, value: any, index?: number, field?: keyof WorkExperience | keyof Education) => {
    let newData = { ...resumeData };
    if (index !== undefined && field) {
      if (section === 'workExperience' || section === 'education') {
        const sectionArray = [...(newData[section] as Array<any>)];
        if (sectionArray[index]) {
          sectionArray[index] = { ...sectionArray[index], [field]: value };
          newData = { ...newData, [section]: sectionArray };
        }
      }
    } else {
      newData = { ...newData, [section]: value };
    }
    setResumeData(newData);
    onUpdate(newData);
  };
  
  const handleListChange = (
    section: 'workExperience' | 'education', 
    itemIndex: number, 
    field: 'responsibilities' | 'details', 
    value: string
  ) => {
    const sectionArray = [...(resumeData[section] as Array<any>)];
    if (sectionArray[itemIndex]) {
      sectionArray[itemIndex] = { ...sectionArray[itemIndex], [field]: value };
      const updatedResumeData = { ...resumeData, [section]: sectionArray };
      setResumeData(updatedResumeData);
      onUpdate(updatedResumeData);
    }
  };


  const addWorkExperience = () => {
    const newExperience: WorkExperience = { role: '', company: '', dates: '', responsibilities: '- New responsibility' };
    const updatedWorkExperience = [...(resumeData.workExperience || []), newExperience];
    handleChange('workExperience', updatedWorkExperience);
  };

  const removeWorkExperience = (index: number) => {
    const updatedWorkExperience = (resumeData.workExperience || []).filter((_, i) => i !== index);
    handleChange('workExperience', updatedWorkExperience);
  };

  const addEducation = () => {
    const newEducation: Education = { degree: '', institution: '', dates: '', details: '- New detail' };
    const updatedEducation = [...(resumeData.education || []), newEducation];
    handleChange('education', updatedEducation);
  };

  const removeEducation = (index: number) => {
    const updatedEducation = (resumeData.education || []).filter((_, i) => i !== index);
    handleChange('education', updatedEducation);
  };
  
  const renderSectionHeader = (title: string, Icon: React.ElementType) => (
    <div className="flex items-center gap-2 mb-3 mt-4">
      <Icon className="h-5 w-5 text-primary" />
      <h3 className="text-xl font-semibold text-primary">{title}</h3>
    </div>
  );

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center gap-2">
          <Info className="h-6 w-6" /> Your AI-Built ATS Resume
        </CardTitle>
        <CardDescription>
          Review and edit the AI-generated content below. Your changes will be used when preparing for PDF.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Full Name and Contact Info */}
        {renderSectionHeader("Contact Information", User)}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                <Input 
                    id="fullName" 
                    value={resumeData.fullName || ''} 
                    onChange={(e) => handleChange('fullName', e.target.value)} 
                    placeholder="Your Full Name"
                />
            </div>
            <div>
                <Label htmlFor="contactInfo" className="text-sm font-medium">Contact Details</Label>
                <Textarea 
                    id="contactInfo" 
                    value={resumeData.contactInfo || ''} 
                    onChange={(e) => handleChange('contactInfo', e.target.value)} 
                    placeholder="Email, Phone, LinkedIn, GitHub, Portfolio (one per line or pipe-separated)"
                    rows={3}
                />
                 <p className="text-xs text-muted-foreground mt-1">Separate items with new lines for best PDF formatting.</p>
            </div>
        </div>
        <Separator />

        {/* Summary */}
        {renderSectionHeader("Professional Summary", Info)}
        <Textarea 
          value={resumeData.summary} 
          onChange={(e) => handleChange('summary', e.target.value)} 
          placeholder="Professional Summary"
          className="min-h-[100px] text-sm"
        />
        <Separator />

        {/* Skills */}
        {renderSectionHeader("Skills", List)}
         <Textarea 
          value={resumeData.skills || ''} 
          onChange={(e) => handleChange('skills', e.target.value)} 
          placeholder="Skills (e.g., - JavaScript, - Project Management)"
          className="min-h-[100px] text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">Start each skill/category with a hyphen (-) on a new line.</p>
        <Separator />
        
        {/* Work Experience */}
        {renderSectionHeader("Work Experience", Briefcase)}
        {(resumeData.workExperience || []).map((exp, index) => (
          <Card key={`work-${index}`} className="p-4 space-y-3 bg-muted/20 border">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-md">Experience #{index + 1}</h4>
              <Button variant="ghost" size="sm" onClick={() => removeWorkExperience(index)} className="text-destructive hover:text-destructive/80">
                <Trash2 className="h-4 w-4 mr-1" /> Remove
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`work-role-${index}`}>Role</Label>
                <Input id={`work-role-${index}`} value={exp.role} onChange={(e) => handleChange('workExperience', e.target.value, index, 'role')} placeholder="Job Title" />
              </div>
              <div>
                <Label htmlFor={`work-company-${index}`}>Company</Label>
                <Input id={`work-company-${index}`} value={exp.company} onChange={(e) => handleChange('workExperience', e.target.value, index, 'company')} placeholder="Company Name" />
              </div>
            </div>
            <div>
              <Label htmlFor={`work-dates-${index}`}>Dates</Label>
              <Input id={`work-dates-${index}`} value={exp.dates} onChange={(e) => handleChange('workExperience', e.target.value, index, 'dates')} placeholder="e.g., Jan 2020 - Present" />
            </div>
            <div>
              <Label htmlFor={`work-responsibilities-${index}`}>Responsibilities &amp; Achievements</Label>
              <Textarea 
                id={`work-responsibilities-${index}`} 
                value={exp.responsibilities} 
                onChange={(e) => handleListChange('workExperience', index, 'responsibilities', e.target.value)}
                placeholder="Bullet points starting with action verbs (e.g., - Led a team...)"
                className="min-h-[120px] text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">Start each bullet with a hyphen (-) on a new line.</p>
            </div>
          </Card>
        ))}
        <Button variant="outline" onClick={addWorkExperience} className="mt-2 text-primary border-primary hover:bg-primary/10">
          <PlusCircle className="h-4 w-4 mr-2" /> Add Experience
        </Button>
        <Separator />

        {/* Education */}
        {renderSectionHeader("Education", GraduationCap)}
        {(resumeData.education || []).map((edu, index) => (
          <Card key={`edu-${index}`} className="p-4 space-y-3 bg-muted/20 border">
             <div className="flex justify-between items-center">
              <h4 className="font-semibold text-md">Education #{index + 1}</h4>
              <Button variant="ghost" size="sm" onClick={() => removeEducation(index)} className="text-destructive hover:text-destructive/80">
                <Trash2 className="h-4 w-4 mr-1" /> Remove
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`edu-degree-${index}`}>Degree</Label>
                <Input id={`edu-degree-${index}`} value={edu.degree} onChange={(e) => handleChange('education', e.target.value, index, 'degree')} placeholder="e.g., B.S. Computer Science" />
              </div>
              <div>
                <Label htmlFor={`edu-institution-${index}`}>Institution</Label>
                <Input id={`edu-institution-${index}`} value={edu.institution} onChange={(e) => handleChange('education', e.target.value, index, 'institution')} placeholder="University Name" />
              </div>
            </div>
             <div>
                <Label htmlFor={`edu-dates-${index}`}>Dates</Label>
                <Input id={`edu-dates-${index}`} value={edu.dates} onChange={(e) => handleChange('education', e.target.value, index, 'dates')} placeholder="e.g., Graduated May 2018" />
            </div>
            <div>
              <Label htmlFor={`edu-details-${index}`}>Details (Optional)</Label>
              <Textarea 
                id={`edu-details-${index}`} 
                value={edu.details || ''} 
                onChange={(e) => handleListChange('education', index, 'details', e.target.value)}
                placeholder="Relevant coursework, honors, GPA (e.g., - Dean's List)"
                className="min-h-[80px] text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">Start each bullet with a hyphen (-) on a new line if multiple.</p>
            </div>
          </Card>
        ))}
        <Button variant="outline" onClick={addEducation} className="mt-2 text-primary border-primary hover:bg-primary/10">
          <PlusCircle className="h-4 w-4 mr-2" /> Add Education
        </Button>
        <Separator />

        {/* Certifications */}
        {renderSectionHeader("Certifications (Optional)", Award)}
        <Textarea 
          value={resumeData.certifications || ''} 
          onChange={(e) => handleChange('certifications', e.target.value)} 
          placeholder="Certifications (e.g., - AWS Certified Developer)"
          className="min-h-[80px] text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">Start each certification with a hyphen (-) on a new line.</p>
        
      </CardContent>
    </Card>
  );
}
