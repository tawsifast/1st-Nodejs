import type { IncomingMessage, ServerResponse } from "http";
import { createProduct, productService } from "../service/product.service";
import type { Iproduct } from "../types/product";
import { bodyParser } from "../utils/parseBody";
import { sendResponse } from "../utils/sendResponse";

const productController = async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;

  const urlParams = url?.split("/");
  const id =
    urlParams && urlParams[1] === "products" ? Number(urlParams[2]) : null;
  console.log(id);

  // Get all products
  if (url === "/products" && method === "GET") {
    //  const products = [
    //     {
    //         id:1,
    //         name: "Product-1",
    //         price:20
    //     },
    //     {
    //         id:1,
    //         name: "Product-2",
    //         price:30
    //     },
    // ];
    try {
    const products = productService();
    sendResponse(res, true, 200, "Product retrieve successfully", products)
    } catch (error) {
    const products = productService();
    sendResponse(res, false, 500, "Internal server error")
    }
  } else if (method === "GET" && id !== null) {
    // for single product
    const products = productService();
    const product = products.find((p: Iproduct) => p.id === id);
    if (!products) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Products Not Found",
          // data: newProducts,
        }),
      );
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products retrieve successfully",
        data: product,
      }),
    );
  } else if (method === "POST" && url === "/products") {
    const body = await bodyParser(req);
    const newProducts = {
      id: Date.now(),
      ...body,
    };
    console.log(newProducts);
    const products = productService();
    products.push(newProducts);
    createProduct(products);
    console.log(body);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products created successfully",
        data: newProducts,
      }),
    );
  } else if (method === "PUT" && id !== null) {
    const body = await bodyParser(req);
    const products = productService();
    const index = products.findIndex((p: Iproduct) => p.id === id);
    if (index < 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Products Not Found",
          // data: newProducts,
        })
      );
    }
    console.log(products[index]);
    products[index] = { id: products[index].id, ...body };
    createProduct(products);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products updated successfully",
        data: products[index],
      }),
    );
  } else if (method === "DELETE" && id !== null) {
    const products = productService();
    const index = products.findIndex((p: Iproduct) => p.id === id);
    if (index < 0) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Products deleted successfully",
          // data:  products[index] ,
        })
      );
    }
    const arr = ["a", "b", "c"];
    console.log(arr.splice(2,1));
    products.splice(index, 1)
    createProduct(products)
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products deleted successfully",
        data: products[index],
      }),
    );
  }
};

export default productController;
