"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Trash2, Users, CalendarDays, MessagesSquare } from "lucide-react";
import { Spinner } from "@/components/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Stats {
  totalUsers: number;
  totalEvents: number;
  totalMessages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalEvents: 0,
    totalMessages: 0,
  });
  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (usersError)
        throw new Error("Failed to fetch users: " + usersError.message);

      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: false });

      if (eventsError)
        throw new Error("Failed to fetch events: " + eventsError.message);

      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from("chat_messages")
        .select(
          `
          *,
          user:user_id(id, name, email),
          event:event_id(id, title)
        `
        )
        .order("created_at", { ascending: false })
        .limit(50);

      if (messagesError)
        throw new Error("Failed to fetch messages: " + messagesError.message);

      setUsers(usersData || []);
      setEvents(eventsData || []);
      setMessages(messagesData || []);

      setStats({
        totalUsers: usersData?.length || 0,
        totalEvents: eventsData?.length || 0,
        totalMessages: messagesData?.length || 0,
      });
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    try {
      setDeleteLoading(true);
      const { error } = await supabase.from("users").delete().eq("id", userId);

      if (error) throw error;

      toast.success("User deleted successfully");
      await fetchData();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      setDeleteLoading(true);
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (error) throw error;

      toast.success("Event deleted successfully");
      await fetchData();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    } finally {
      setDeleteLoading(false);
    }
  };
  const handleDeleteMessage = async (messageId: string) => {
    try {
      setDeleteLoading(true);
      const { error } = await supabase
        .from("chat_messages")
        .delete()
        .eq("id", messageId);

      if (error) throw error;

      toast.success("Message deleted successfully");
      await fetchData();
      setSelectedMessages((prev) => prev.filter((id) => id !== messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteSelectedMessages = async () => {
    if (!selectedMessages.length) return;

    try {
      setDeleteLoading(true);
      const { error } = await supabase
        .from("chat_messages")
        .delete()
        .in("id", selectedMessages);

      if (error) throw error;

      toast.success(`${selectedMessages.length} messages deleted successfully`);
      await fetchData();
      setSelectedMessages([]);
    } catch (error) {
      console.error("Error deleting messages:", error);
      toast.error("Failed to delete messages");
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleMessageSelection = (messageId: string) => {
    setSelectedMessages((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    );
  };

  const toggleAllMessages = () => {
    setSelectedMessages((prev) =>
      prev.length === messages.length ? [] : messages.map((m) => m.id)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <Button onClick={fetchData} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Messages
            </CardTitle>
            <MessagesSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Tables */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role || "user"}</TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={user.role === "admin" || deleteLoading}
                            >
                              {deleteLoading ? (
                                <Spinner />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this user and all
                                their data. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(user.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Events</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>{event.title}</TableCell>
                      <TableCell>{event.creator?.name || "Unknown"}</TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>
                        {new Date(event.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={deleteLoading}
                            >
                              {deleteLoading ? (
                                <Spinner />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this event and all
                                associated data. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteEvent(event.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader className="space-y-6">
              <CardTitle>Messages</CardTitle>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {selectedMessages.length} of {messages.length} selected
                </div>
                {selectedMessages.length > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deleteLoading}
                        className="flex items-center gap-2"
                      >
                        {deleteLoading ? (
                          <Spinner />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Delete Selected ({selectedMessages.length})
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete {selectedMessages.length}{" "}
                          selected messages. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteSelectedMessages}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectedMessages.length === messages.length}
                          onCheckedChange={toggleAllMessages}
                        />
                      </TableHead>
                      <TableHead className="w-[200px]">User</TableHead>
                      <TableHead className="w-[200px]">Event</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead className="w-[180px]">Sent At</TableHead>
                      <TableHead className="w-[70px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((message) => (
                      <TableRow
                        key={message.id}
                        className={
                          selectedMessages.includes(message.id)
                            ? "bg-muted/50"
                            : ""
                        }
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedMessages.includes(message.id)}
                            onCheckedChange={() =>
                              toggleMessageSelection(message.id)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="truncate max-w-[180px]">
                            {message.user?.name || "Unknown"}
                          </div>
                          {message.user?.email && (
                            <div className="truncate max-w-[180px] text-sm text-muted-foreground">
                              {message.user.email}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="truncate max-w-[180px]">
                          {message.event?.title || "Unknown"}
                        </TableCell>
                        <TableCell>
                          <div className="truncate max-w-[300px]">
                            {message.content}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(message.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={deleteLoading}
                              >
                                {deleteLoading ? (
                                  <Spinner />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete this message.
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteMessage(message.id)
                                  }
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
