"use client";
import PageTitle from "@/components/ui/PageTitle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Square, X, CheckSquare, CheckSquare2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetProducts,
  resetReturnProducts,
  setBillActive,
  setReturnActive,
  setSalesForUpdate,
  setStatus,
} from "./../../../redux-store/Slice/SalesSlice";
import { RootState } from "@/app/redux-store/store";
import CreateOrderForm from "../create-order/createOrderForm";
import { salesById } from "../_action";

export default function ProductsPage() {
  const saleData = useSelector((state: any) => state.sales);
  const dispatch = useDispatch();
  // const [returnActive, setReturnActive] = useState(false);

  // const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setReturnActive(e.target.checked);
  // };
  const handleReturnActive = () => {
    dispatch(setReturnActive(!saleData.returnActive));
    dispatch(resetProducts());
    if (saleData.returnActive === false) {
      dispatch(resetReturnProducts());
    }
  };
  const currentSaleId = window.location.pathname;
  const routeParts = currentSaleId.split("/");
  const id = routeParts[routeParts.length - 1];

  // console.log("Current Route:", saleData);
  // const [salesData, setSalesData] = useState(null);
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const data = await salesById(id);
        console.log("sale", data);
        dispatch(setSalesForUpdate(data));
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, [id]);

  // console.log("Sales:", salesData);

  return (
    <main className="flex min-h-screen flex-col gap-0 w-full">
      <div className="flex-col flex w-full">
        <div className="flex-1 space-y-4 p-4 ">
          <div className="flex items-center justify-between space-y-2">
            <div className="flex">
              <Link href="/dashboard/sales">
                <Button variant="ghost">
                  <ArrowLeft />
                </Button>
              </Link>
              <PageTitle title="Update Order" />
            </div>

            <div className="flex items-center space-x-2">
              <div
                className="grid gap-1.5 leading-none"
                onClick={() => {
                  dispatch(setBillActive(!saleData.billActive));
                  dispatch(setStatus("Complete"));
                }}
              >
                <label
                  htmlFor="return"
                  className="flex items-center gap-2 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {saleData.billActive ? (
                    <CheckSquare2 size={18} />
                  ) : (
                    <Square size={18} />
                  )}
                  Generate Bill
                </label>
              </div>
              <div className="items-top flex space-x-2 mr-4">
                {/* <Checkbox
                  id="return"
                  checked={saleData.returnActivate}
                  onChange={() =>
                    dispatch(setReturnActive(!saleData.returnActivate))
                  }
                /> */}
                <div
                  className="grid gap-1.5 leading-none"
                  onClick={handleReturnActive}
                >
                  <label
                    htmlFor="return"
                    className="flex items-center gap-2 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {saleData.returnActive ? (
                      <CheckSquare2 size={18} />
                    ) : (
                      <Square size={18} />
                    )}
                    VOID Return
                  </label>
                </div>
              </div>

              <Link href="/dashboard/sales">
                <Button className="ml-4">
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-0 md:grid-cols-1 lg:grid-cols-1">
        <CreateOrderForm />
      </div>
    </main>
  );
}