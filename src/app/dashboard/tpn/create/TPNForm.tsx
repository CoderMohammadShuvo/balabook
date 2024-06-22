"use client";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { format } from "date-fns";
import { Calendar as CalendarIcon, SendHorizonal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import productPhoto from "./img/product.jpg";
import Image from "next/image";
import { DevTool } from "@hookform/devtools";
import SelectSupplier from "@/components/ui/SelectSupplier";
import SelectMc from "@/components/ui/SelectMc";
import SelectCategory from "@/components/ui/SelectCategory";
import SelectBrand from "@/components/ui/SelectBrand";
import SelectUnit from "@/components/ui/SelectUnit";
import { columns } from "./columns";
import { TPNFormSchema } from "./TPNFormSchema";
import { TPNDataTable } from "./data-table";
import SearchProduct from "@/components/ui/searchProduct";
import CsvUpload from "@/components/CsvUpload";
import { importProduct, searchProductById } from "../../products/_action";
import SelectWarehouse from "@/components/ui/SelectWareHouse";
import { useDispatch, useSelector } from "react-redux";
import {
  selectWhFrom,
  selectWhTo,
  setProducts,
  setUserId,
} from "@/app/redux-store/Slice/TPNSlice";
import { RootState } from "@/app/redux-store/store";
import { addToDb } from "@/lib/tpnDb";
import { saveTpn } from "../_action";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { createUserLogs } from "../../users/_action";

interface ProductFormEditProps {
  entry: any;
}
const data: any = [];
function TPNForm({ entry }: ProductFormEditProps) {
  const [id, setId] = useState<string>("");
  const [mcId, setMcId] = useState<string>("");
  const form = useForm();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const tpnData = useSelector((state: RootState) => state.tpn);
  //@ts-ignore
  const sessionUserId = session?.user?.id;

  const handleWhFrom = (id: string) => {
    dispatch(selectWhFrom(id));
  };
  const handleWhTo = (id: string) => {
    dispatch(selectWhTo(id));
  };

  useEffect(() => {
    dispatch(setUserId(sessionUserId));
  }, [sessionUserId]);
  const handleBrandId = (id: string) => {
    form.setValue("brandId", id);
    setMcId(id);
  };

  const onSearchChange = (query: any) => {
    query;
  };

  const handleSelectedProduct = async (productId: string) => {
    try {
      // Check if exist

      const exist = tpnData.products.find(
        (poProduct: any) => poProduct.id === productId
      );
      const rest = tpnData.products.filter(
        (poProduct: any) => poProduct.id !== productId
      );
      let newProduct;

      if (exist) {
        // inrease qty

        newProduct = {
          ...exist,
          qty: parseInt(exist.qty) + 1,
          total: parseInt(exist.qty + 1) * exist.tp,
        };
        dispatch(setProducts(rest));
        localStorage.setItem("tpn", JSON.stringify([...rest, newProduct]));
        dispatch(setProducts([...rest, newProduct]));
      } else {
        // add new
        const product = await searchProductById(productId);
        //  ("hello", product);
        newProduct = {
          id: product?.id,
          name: product?.name,
          articleCode: product?.articleCode,
          //@ts-ignore
          mrp: product?.mrp !== null ? product.mrp : 0,
          tp: product?.tp !== null ? product.tp : 0,
          hsCode: product.hsCode,
          openingQty: product.openingQty,
          cogs: product.cogs,
          closingQty: product.closingQty,
          qty: 1,
          // @ts-ignore
          total: 1 * product?.tp,
        };
      }

      addToDb(newProduct);
      dispatch(setProducts([...rest, newProduct]));
    } catch (error) {
      console.error("Error fetching product by id:", error);
    }
  };

  const [CSV, setCSV] = useState<any>([]);

  const handelImport = async () => {
    //  ("Import", CSV);
    if (CSV?.length > 0) {
      const product = await importProduct(CSV);
      if (product) {
        toast.success("Product Import Success");
      }
    }
  };

  async function onSubmit() {
    try {
      //@ts-ignore
      const TPN = await saveTpn(tpnData);
      if (TPN) {
        createUserLogs(TPN?.userId, TPN?.id, "TPN", "Create");
        toast.success(TPN ? "TPN  Creation Success" : "TPN Update Success");
        // dispatch(reset());
        // router.push("/dashboard/po");
      } else {
        toast.error(TPN ? "TPN Creation faield!" : "TPN Update faield!");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex pt-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <div className="flex w-full">
            <div className="w-full mx-4 ">
              {/* masterCategory, shCode, salesType */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-0 ">
                <FormField
                  control={form.control}
                  name="supplierId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warehouse From</FormLabel>
                      <FormControl>
                        {/* <SelectSupplier handleSelect={handleSupplierId} /> */}
                        <SelectWarehouse handleSelect={handleWhFrom} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supplierId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warehouse To</FormLabel>

                      <FormControl>
                        <SelectWarehouse handleSelect={handleWhTo} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center py-2 grid grid-cols-2 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="productSearch"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SearchProduct handleSelect={handleSelectedProduct} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <CsvUpload setCSV={setCSV} handelImport={handelImport} />
              </div>
              {/* table, search, import */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-0">
                <TPNDataTable
                  columns={columns}
                  data={
                    tpnData?.products?.length > 0
                      ? tpnData?.products
                          ?.slice()
                          // @ts-ignore
                          .sort((a, b) => a.order - b.order)
                      : []
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 mt-4 pb-2 border-b">
                <p className="font-bold">{/* Discount: <span>0.00</span> */}</p>
                <p className="font-bold">{/* Tax: <span>0.00</span> */}</p>
                <p className="font-bold">
                  Total Item: <span>{tpnData.totalItem}</span>
                </p>
                <p className="font-bold">
                  Gross Total: <span>{tpnData.grossTotal}</span>
                </p>
                <p className="font-bold">
                  Gross Total Round: <span>{tpnData.grossTotalRound}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-end">
            <Button type="submit" className="mr-4">
              Submit <SendHorizonal className="ml-2 h-4 w-4" />{" "}
            </Button>
          </div>
        </form>
        {/* <DevTool control={form.control} /> */}
      </Form>
      <Toaster />
    </div>
  );
}

export default TPNForm;
