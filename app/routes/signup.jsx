import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useState } from "react";
import { ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react";
import { Input } from "../../src/components/ui/Input";
import { Button } from "../../src/components/ui/Button";

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return json(
      { error: "Please enter both email and password." },
      { status: 400 }
    );
  }

  // Placeholder: in a real app you'd create a user account here.
  // For now, just redirect to settings so they can connect their store.
  return redirect("/app/settings");
}

export default function SignupRoute() {
  const actionData = useActionData();
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/25 blur-[140px] animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/25 blur-[140px] animate-pulse-slow delay-1000" />

      <div className="relative z-10 w-full max-w-md p-8 mx-4">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl" />
        <div className="relative z-20 space-y-8">
          <div className="text-center space-y-2">
            <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary p-[1px] mb-6 shadow-neon-blue">
              <div className="h-full w-full rounded-full bg-black flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Create RefundSavior Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Set up your command center, then connect your Shopify store.
            </p>
          </div>

          <Form
            method="post"
            className="space-y-6"
            onSubmit={() => setSubmitting(true)}
          >
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input
                  type="email"
                  name="email"
                  placeholder="founder@brand.com"
                  className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-slate-600 focus:border-primary/50 transition-all"
                  required
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input
                  type="password"
                  name="password"
                  placeholder="Choose a strong password"
                  className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-slate-600 focus:border-primary/50 transition-all"
                  required
                />
              </div>
            </div>

            {actionData?.error && (
              <p className="text-xs text-red-400 text-center">{actionData.error}</p>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)]"
              disabled={submitting}
            >
              <span className="flex items-center gap-2">
                {submitting ? "Creating account..." : "Create Account"}
                <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
          </Form>

          <div className="text-center text-xs text-slate-500">
            <p>
              Already have an account?{" "}
              <a
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

