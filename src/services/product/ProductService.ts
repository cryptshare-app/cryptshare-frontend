import {AxiosResponse} from "axios";

import {HTTP} from "@/axios";
import Product from "@/stores/models/Product";
import {ProductTO} from "@/services/product/types/ProductTO";


/**
 * Product Service for handling request related to products
 */
export default class ProductService {
    /**
     * Get all products that belong to the given group
     * @param {string} groupTitle the name of the group to which the products belong
     * @returns {Promise<Product[]>}
     */
    static async getAllProductsForGroup(groupTitle: string): Promise<Product[]> {
        let response: AxiosResponse<ProductTO[]> = await HTTP().get("products/" + groupTitle);
        return Product.fromTOList(response.data);
    }

    /**
     * Create a new product
     * @param {Product} product
     * @returns {Promise<Product>}
     */
    static async createProduct(product: Product): Promise<Product> {
        let response: AxiosResponse<ProductTO> = await HTTP().post("products", product);
        return Product.fromTO(response.data);
    }
}