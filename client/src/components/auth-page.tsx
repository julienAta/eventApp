"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth-form";

export function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const {
    state: { email, password, name, error, isLoading },
    handleSignIn,
    handleSignUp,
    setEmail,
    setPassword,
    setName,
  } = useAuth();

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container grid items-center gap-6 px-4 md:px-6 md:grid-cols-2">
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tighter md:text-5xl">
            Welcome to JUNBI
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            JUNBI is your comprehensive event management platform. Create,
            organize, and manage events with ease while keeping your
            participants connected and informed.
          </p>
        </div>
        <div className="mx-auto max-w-md w-full">
          <Tabs
            defaultValue="signin"
            className="w-full"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <Card>
                <form onSubmit={handleSignIn}>
                  <CardContent className="grid gap-4 pt-6">
                    <div className="grid gap-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            <TabsContent value="signup">
              <Card>
                <form onSubmit={handleSignUp}>
                  <CardContent className="grid gap-4 pt-6">
                    <div className="grid gap-2">
                      <Label htmlFor="signup-name">Name</Label>
                      <Input
                        id="signup-name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
          {error && (
            <p className="text-destructive mt-4 text-sm text-center">{error}</p>
          )}
        </div>
      </div>
    </section>
  );
}
