import { AddToCartDto, UpdateCartItemDto } from "./dto/cart.dto";
import { cartRepository } from "./cart.repository";
import { productService } from "../product/product.service";
import { AppError } from "../../utils/AppError";

export class CartService {
  async getCart(userId: string) {
    const cart = await cartRepository.findByUserId(userId);
    if (!cart) {
      return await cartRepository.create(userId);
    }
    return cart;
  }

  async addItemToCart(userId: string, input: AddToCartDto) {
    const cart = await this.getCart(userId);

    // Check product existence and stock
    const product = await productService.getProductById(input.productId);

    if (product.stock < input.quantity) {
      throw new AppError("Not enough stock available", 400);
    }

    // Check if item already exists in cart
    const existingItem = await cartRepository.findCartItem(
      cart.id,
      input.productId,
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + input.quantity;
      if (product.stock < newQuantity) {
        throw new AppError("Not enough stock available", 400);
      }
      return await cartRepository.updateItemQuantity(
        existingItem.id,
        newQuantity,
      );
    }

    return await cartRepository.addItem(cart.id, input);
  }

  async updateItemQuantity(
    userId: string,
    cartItemId: string,
    input: UpdateCartItemDto,
  ) {
    const cart = await cartRepository.findByUserId(userId);
    if (!cart) throw new AppError("Cart not found", 404);

    const item = await cartRepository.findCartItemById(cartItemId);
    if (!item) throw new AppError("Item not found", 404);

    if (item.cartId !== cart.id) {
      throw new AppError("Item does not belong to this cart", 403);
    }

    // Check stock for the NEW quantity (absolute value)
    const product = await productService.getProductById(item.productId);
    if (product.stock < input.quantity) {
      throw new AppError("Not enough stock available", 400);
    }

    return await cartRepository.updateItemQuantity(cartItemId, input.quantity);
  }

  async removeItemFromCart(userId: string, cartItemId: string) {
    const cart = await cartRepository.findByUserId(userId);
    if (!cart) throw new AppError("Cart not found", 404);

    const item = await cartRepository.findCartItemById(cartItemId);
    if (!item) throw new AppError("Item not found", 404);

    if (item.cartId !== cart.id) {
      throw new AppError("Item does not belong to this cart", 403);
    }

    await cartRepository.removeItem(cartItemId);
  }

  async clearCart(userId: string) {
    const cart = await cartRepository.findByUserId(userId);
    if (cart) {
      await cartRepository.clearCart(cart.id);
    }
  }
}

export const cartService = new CartService();
