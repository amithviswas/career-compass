import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-primary text-primary-foreground mx-auto">
            <Briefcase size={48} />
          </div>
          <CardTitle className="text-4xl font-bold text-primary">
            Welcome to CareerCompass
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Your AI-powered personal career mentor. Navigate your career path with confidence.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 text-center">
          <p className="text-md">
            CareerCompass helps you understand your strengths, identify skill gaps, and create a personalized roadmap for success. Upload your resume, define your goals, and let our AI guide you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/auth/login">
                Login <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10">
              <Link href="/auth/signup">
                Sign Up <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground pt-4">
            Powered by Firebase Studio AI
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
