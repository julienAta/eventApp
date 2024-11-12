"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  MessageSquare,
  Shield,
  Code2,
  Database,
  Server,
  Globe,
  Cpu,
  Layout,
  Boxes,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const features = [
    {
      icon: Calendar,
      title: "Event Management",
      description:
        "Create and manage events with an intuitive interface that makes planning seamless and enjoyable",
    },
    {
      icon: Users,
      title: "User-Friendly",
      description:
        "Designed for everyone, from casual users planning family gatherings to professional event organizers",
    },
    {
      icon: MessageSquare,
      title: "Real-Time Chat",
      description:
        "Stay connected with participants through our integrated messaging system with instant notifications",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description:
        "Enterprise-grade security with end-to-end encryption and full GDPR compliance for peace of mind",
    },
  ];

  const techStack = [
    {
      name: "Next.js",
      category: "Frontend",
      icon: Globe,
      description:
        "React framework for production-grade applications with server-side rendering and static site generation",
      features: [
        "Server-side Rendering",
        "Static Site Generation",
        "API Routes",
      ],
    },
    {
      name: "React",
      category: "Frontend",
      icon: Layout,
      description:
        "A JavaScript library for building user interfaces with reusable components",
      features: ["Component-Based", "Virtual DOM", "Rich Ecosystem"],
    },
    {
      name: "Node.js",
      category: "Backend",
      icon: Server,
      description:
        "JavaScript runtime built on Chrome&apos;s V8 JavaScript engine for scalable network applications",
      features: ["Event-Driven", "Non-Blocking I/O", "Large Package Ecosystem"],
    },
    {
      name: "PostgreSQL",
      category: "Database",
      icon: Database,
      description:
        "Powerful, open-source object-relational database system with reliability and data integrity",
      features: ["ACID Compliance", "Complex Queries", "Extensible"],
    },
    {
      name: "TypeScript",
      category: "Language",
      icon: Code2,
      description:
        "Typed superset of JavaScript that compiles to plain JavaScript for safer code",
      features: ["Static Typing", "Object-Oriented", "IDE Support"],
    },
    {
      name: "Supabase",
      category: "Backend",
      icon: Boxes,
      description:
        "Open source Firebase alternative with powerful features for modern applications",
      features: ["Authentication", "Real-time", "Auto-Generated APIs"],
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-8rem)] flex items-center justify-center py-32">
        <motion.div
          className="container mx-auto px-4 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-7xl font-bold tracking-tighter text-foreground sm:text-8xl mb-8">
            JUNBI
          </h1>
          <p className="mt-8 mx-auto max-w-2xl text-xl text-muted-foreground leading-relaxed">
            The next generation event planning platform that brings simplicity
            to complexity, making event organization effortless and enjoyable.
          </p>
          <motion.div
            className="mt-16 flex flex-col sm:flex-row gap-6 justify-center"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            <Button
              asChild
              size="lg"
              variant="default"
              className="text-lg px-8 py-6"
            >
              <Link href="/events">Explore Events</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
            >
              <Link href="/events/create">Create Event</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Powerful Features for Seamless Events
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl mb-2">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Our Technology Stack</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with cutting-edge technologies to ensure performance,
              scalability, and developer productivity
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <tech.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-1">
                          {tech.name}
                        </CardTitle>
                        <Badge variant="secondary">{tech.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {tech.description}
                    </p>
                    <div className="space-y-2">
                      {tech.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-32 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-8">About JUNBI</h2>
            <p className="text-xl text-muted-foreground mb-16 leading-relaxed">
              JUNBI is more than just an event planning platform - it&apos;s a
              comprehensive solution designed to simplify the entire event
              management process. From conception to execution, our platform
              provides the tools you need to create memorable experiences.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-bold text-2xl mb-3">Security First</h3>
                <p className="text-muted-foreground">
                  RGPD compliant with end-to-end encryption for all your
                  sensitive data
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Cpu className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-bold text-2xl mb-3">Scalable</h3>
                <p className="text-muted-foreground">
                  Built to handle events of any size, from intimate gatherings
                  to large conferences
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Code2 className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-bold text-2xl mb-3">Modern Stack</h3>
                <p className="text-muted-foreground">
                  Leveraging cutting-edge technologies for the best possible
                  user experience
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-primary text-primary-foreground">
        <motion.div
          className="container mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-8">Ready to Get Started?</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto opacity-90">
            Join JUNBI today and experience the future of event planning. Create
            your first event in minutes.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6"
          >
            <Link href="/signup">Start Planning Today</Link>
          </Button>
        </motion.div>
      </section>
    </main>
  );
}
