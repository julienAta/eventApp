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
import { redirect } from "next/navigation";
import styles from "./marketing-client.module.scss";

export default function MarketingClient({ isAuth }: { isAuth: boolean }) {
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
    <main className={styles.main}>
      <section className={styles.hero}>
        <motion.div
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <h1>JUNBI</h1>
          <p>
            The next generation event planning platform that brings simplicity
            to complexity, making event organization effortless and enjoyable.
          </p>
          <motion.div
            className={styles.heroButtons}
            variants={fadeIn}
            transition={{ delay: 0 }}
          >
            {isAuth ? (
              <Button
                asChild
                size="lg"
                variant="default"
                className={styles.button}
                onClick={() => redirect("/events")}
              >
                <Link href="/events">Start</Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className={styles.button}
                >
                  <Link href="/auth">Login</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="default"
                  className={styles.button}
                >
                  <Link href="#">Discover</Link>
                </Button>
              </>
            )}
          </motion.div>
        </motion.div>
      </section>

      <section className={styles.features}>
        <div className={styles.container}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Powerful Features for Seamless Events
          </motion.h2>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={styles.featureCard}
              >
                <Card>
                  <CardHeader>
                    <div className={styles.featureIcon}>
                      <feature.icon />
                    </div>
                    <CardTitle className={styles.featureTitle}>
                      {feature.title}
                    </CardTitle>
                    <CardDescription className={styles.featureDescription}>
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.techStack}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={styles.sectionHeader}
          >
            <h2>Our Technology Stack</h2>
            <p>
              Built with cutting-edge technologies to ensure performance,
              scalability, and developer productivity
            </p>
          </motion.div>

          <div className={styles.techStackGrid}>
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={styles.techCard}
              >
                <Card>
                  <CardHeader>
                    <div className={styles.techHeader}>
                      <div className={styles.techIcon}>
                        <tech.icon />
                      </div>
                      <div>
                        <CardTitle>{tech.name}</CardTitle>
                        <Badge variant="secondary">{tech.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{tech.description}</p>
                    <div className={styles.techFeatures}>
                      {tech.features.map((feature, i) => (
                        <div key={i} className={styles.techFeature}>
                          <div className={styles.techFeatureDot} />
                          <span>{feature}</span>
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

      <section className={styles.cta}>
        <motion.div
          className={styles.ctaContent}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Get Started?</h2>
          <p>
            Join JUNBI today and experience the future of event planning. Create
            your first event in minutes.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className={styles.ctaButton}
          >
            <Link href="/signup">Start Planning Today</Link>
          </Button>
        </motion.div>
      </section>
    </main>
  );
}
