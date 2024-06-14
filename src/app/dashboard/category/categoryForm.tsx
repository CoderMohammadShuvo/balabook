"use client";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { CategoryFormSchema } from "./CategoryFormSchema";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import CustomSelect from "@/components/ui/CustomSelect";
import { saveCategory, updateCategory } from "./_action";
import SelectCategory from "@/components/ui/SelectCategory";

interface CategoryFormEditProps {
  entry: any;
  setOpen: React.Dispatch<React.SetStateAction<any>>;
}

function CategoryForm({ entry, setOpen }: CategoryFormEditProps) {
  // const [parent, setParent] = useState<string>(entry?.parentId || "");
  const [mcId, setMcId] = useState<string>("");
  const [id, setId] = useState<string>("");
  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      code: "",
      photo: "",
      parentId: "",
      status: "Active",
    },
  });

  useEffect(() => {
    if (entry?.id) {
      form.setValue("name", entry.name);
      form.setValue("description", entry.description);
      form.setValue("code", entry.code);
      form.setValue("photo", entry.photo);
      form.setValue("parentId", entry.parentId || "");
      form.setValue("status", entry.status);
      setId(entry?.id);
      setMcId(entry?.parentId);
    }
  }, [entry]);

  // useEffect(() => {
  //    ("parent", parent);
  //   form.setValue("parentId", parent);
  // }, [parent]);

  const handleCategoryId = (id: string) => {
    "handleCategoryId", id;
    form.setValue("parentId", id);
    setMcId(id);
  };
  //   ("category saved", id, data);
  async function onSubmit(data: z.infer<typeof CategoryFormSchema>) {
    try {
      const category = await updateCategory(entry.id, data);
      "category", category;
    } catch (err) {
      err;
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
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input placeholder="Category Name" {...field} />
                </FormControl>
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
            name="parentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <SelectCategory handleSelect={handleCategoryId} mcId={mcId} />
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
                    <SelectTrigger>
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

export default CategoryForm;
