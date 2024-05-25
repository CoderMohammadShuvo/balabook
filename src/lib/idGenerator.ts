import { Order } from "./../app/dashboard/sales/columns";
import prisma from "@/index";
import { endOfDay, formatDate, startOfDay } from "date-fns";

export const generateId = async (module: string) => {
  //Switch data table by module name
  let todayTotal = 0;
  let modulePrefix = "";
  // get data count by date from database by prisma query
  switch (module) {
    case "po":
      todayTotal = await prisma.purchaseOrder.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)), // Filter documents created today
          },
        },
      });
      break;
  }
  switch (module) {
    case "tpn":
      todayTotal = await prisma.tPN.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)), // Filter documents created today
          },
        },
      });
      break;
  }
  switch (module) {
    case "grn":
      todayTotal = await prisma.gRN.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)), // Filter documents created today
          },
        },
      });
      break;
  }
  //   switch (module) {
  //     case "order":
  //       todayTotal = await prisma.sales.count({
  //         where: {
  //           createdAt: {
  //             gte: new Date(new Date().setHours(0, 0, 0, 0)), // Filter documents created today
  //           },
  //         },
  //       });
  //       break;
  //   }

  console.log("todayTotal:", todayTotal);

  const number = ("000" + (todayTotal + 1)).toString();
  const current = number.substring(number.length - 4);
  const date = formatDate(new Date(new Date()), "MMddyyyy");
  const newId = process.env.ID_PREFIX + modulePrefix + date + "-" + current;

  return newId;
};