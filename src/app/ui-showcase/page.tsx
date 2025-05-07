"use client";

import React from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/atoms/Card";
import { Alert, AlertTitle, AlertDescription } from "@/components/atoms/Alert";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/atoms/Table";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/atoms/Select";

export default function UIShowcase() {
  return (
    <div className="container mx-auto py-10 space-y-10 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">UI Component Showcase</h1>

      {/* Badges Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Badges</h2>
        <Card>
          <CardContent className="py-6">
            <div className="flex flex-wrap gap-4">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Buttons Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
        <Card>
          <CardContent className="py-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium">Default Variants</h3>
                <Button variant="default">Default</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium">Sizes</h3>
                <Button size="default">Default</Button>
                <Button size="sm">Small</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">🔍</Button>
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium">States</h3>
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Cards Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the main content of the card.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="mr-2">Cancel</Button>
              <Button>Submit</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Another Card</CardTitle>
              <CardDescription>With different content</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Cards can be used for various UI elements.</p>
            </CardContent>
            <CardFooter className="justify-between">
              <span className="text-sm text-gray-500">Last updated: Today</span>
              <Button variant="ghost" size="sm">View Details</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Alerts Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Alerts</h2>
        <div className="space-y-4">
          <Alert>
            <AlertTitle>Default Alert</AlertTitle>
            <AlertDescription>This is a default alert with standard styling.</AlertDescription>
          </Alert>
          
          <Alert variant="destructive">
            <AlertTitle>Destructive Alert</AlertTitle>
            <AlertDescription>This is a destructive alert for errors or warnings.</AlertDescription>
          </Alert>
          
          <Alert variant="warning">
            <AlertTitle>Warning Alert</AlertTitle>
            <AlertDescription>This is a warning alert for important notifications.</AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Tables Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Tables</h2>
        <Card>
          <CardContent className="py-6">
            <Table>
              <TableCaption>A simple table example</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell>john@example.com</TableCell>
                  <TableCell><Badge variant="success">Active</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>jane@example.com</TableCell>
                  <TableCell><Badge variant="warning">Pending</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Bob Johnson</TableCell>
                  <TableCell>bob@example.com</TableCell>
                  <TableCell><Badge variant="destructive">Inactive</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Select Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Select</h2>
        <Card>
          <CardContent className="py-6">
            <div className="max-w-md">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function TableCaption({ children }: { children: React.ReactNode }) {
  return (
    <caption className="mt-4 text-sm text-gray-500">{children}</caption>
  );
} 