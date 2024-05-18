"use client";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createBrand, updateBrand } from "./_action";
import { BrandFormSchema } from "./BrandFormSchema";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

interface BrandFormEditProps {
  entry: any;
  setOpen: React.Dispatch<React.SetStateAction<any>>;
}

function BrandFormEdit({ entry, setOpen }: BrandFormEditProps) {
  const router = useRouter();
  console.log(entry);

  const form = useForm<z.infer<typeof BrandFormSchema>>({
    resolver: zodResolver(BrandFormSchema),
    defaultValues: {
      name: "",
      description: "",
      code: "",
      logo: "",
      status: "Active",
    },
  });

  useEffect(() => {
    // console.log(data);
    if (entry?.id) {
      // form.setValue("name", entry.name);
      // form.setValue("description", entry.description);
      // form.setValue("code", entry.code);
      // form.setValue("logo", entry.logo);
      // form.setValue("status", entry.status);
    }
  }, []);

  async function onSubmit(data: z.infer<typeof BrandFormSchema>) {
    try {
      //@ts-ignore
      const newBrand = await updateBrand(entry.id, data);
      console.log("brand", newBrand);

      if (newBrand) {
        form.reset();
        setOpen(false);
        toast.success("Brand Creation Success");
      } else {
        toast.error("Brand Creatation faield!");
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-5/6 space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Brand Name</FormLabel>
                <FormControl>
                  <Input placeholder="Brand Name" {...field} />
                </FormControl>
                {/* <FormDescription>{JSON.stringify(entry)}</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input placeholder="code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="">
                      <SelectValue placeholder="Active" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <Toaster />
    </div>
  );
}

export default BrandFormEdit;
