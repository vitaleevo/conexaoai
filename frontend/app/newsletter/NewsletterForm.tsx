"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { api } from "@/lib/api";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [region, setRegion] = useState("america");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setStatus("idle");

    startTransition(async () => {
      try {
        await api.newsletter.subscribe({ email, name, region });
        setStatus("success");
        setEmail("");
        setName("");
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    });
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 rounded-3xl border border-primary/20 bg-primary/5 p-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="size-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-foreground">Subscription confirmed!</h3>
          <p className="text-muted-foreground">
            Thank you for joining our community. You will receive the next edition shortly.
          </p>
        </div>
        <Button variant="outline" onClick={() => setStatus("idle")}>
          Go back
        </Button>
      </div>
    );
  }

  return (
    <form 
      className="space-y-6 rounded-3xl border border-border bg-card p-8 md:p-10 shadow-sm transition-all duration-300 hover:shadow-md" 
      onSubmit={handleSubmit}
    >
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Name</label>
          <Input
            className="h-14 rounded-xl bg-muted/30 focus-visible:ring-primary"
            placeholder="Your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email</label>
          <Input
            required
            className="h-14 rounded-xl bg-muted/30 focus-visible:ring-primary"
            placeholder="your@email.com"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Region</label>
          <Select value={region} onValueChange={(value) => setRegion(value ?? "america")}>
            <SelectTrigger className="h-14 rounded-xl bg-muted/30 focus:ring-primary">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="america">America (US/LATAM)</SelectItem>
              <SelectItem value="europe">Europe (EMEA)</SelectItem>
              <SelectItem value="asia">Asia (APAC)</SelectItem>
              <SelectItem value="global">Global (Others)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button 
          disabled={isPending} 
          type="submit"
          className="h-14 rounded-xl px-10 text-base font-bold shadow-lg shadow-primary/20 transition-all hover:translate-y-[-2px] active:translate-y-0"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-5 animate-spin" />
              Subscribing...
            </>
          ) : (
            "Join now"
          )}
        </Button>
        
        {status === "error" && (
          <div className="flex items-center gap-2 text-sm font-medium text-destructive animate-in slide-in-from-left-2">
            <AlertCircle className="size-4" />
            <span>{message}</span>
          </div>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground">
        By subscribing, you agree to our terms. We promise zero spam, just pure intelligence.
      </p>
    </form>
  );
}
