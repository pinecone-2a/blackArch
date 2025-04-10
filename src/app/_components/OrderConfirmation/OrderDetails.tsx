"use client";

import { OrderDetails as OrderDetailsType } from "./types";

type OrderDetailsSummaryProps = {
  orderDetails: OrderDetailsType;
};

export const OrderDetailsSummary = ({ orderDetails }: OrderDetailsSummaryProps) => {
  return (
    <div className="text-left mb-4 text-sm sm:text-base">
      <p className="mb-2">
        <span className="font-medium">Нийт дүн:</span> ₮{Number(orderDetails.totalPrice || 0).toLocaleString()}
      </p>
      <p className="mb-2">
        <span className="font-medium">Төлбөрийн хэлбэр:</span> {
          orderDetails.paymentMethod === "card" ? "Карт" : 
          orderDetails.paymentMethod === "qpay" ? "QPay" : "Бэлэн мөнгө"
        }
      </p>
      {orderDetails.shippingAddress && (
        <p className="mb-2">
          <span className="font-medium">Хүргэлтийн хаяг:</span> {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.street}
        </p>
      )}
      <p className="mb-2">
        <span className="font-medium">Захиалгын төлөв:</span> {
          orderDetails.status === "pending" ? "Хүлээгдэж байна" : 
          orderDetails.status === "processing" ? "Боловсруулж байна" : 
          orderDetails.status === "shipped" ? "Илгээгдсэн" : 
          orderDetails.status === "delivered" ? "Хүргэгдсэн" : orderDetails.status || "Бүртгэгдсэн"
        }
      </p>
      {orderDetails.createdAt && (
        <p className="mb-2">
          <span className="font-medium">Огноо:</span> {new Date(orderDetails.createdAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}; 