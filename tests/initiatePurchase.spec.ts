import { test, expect } from '@playwright/test';
import * as shop from '../pages/shop';
import * as item from '../pages/item';
import * as shoppingBag from '../pages/shoppingBag';
import * as shippingInformation from '../objects/shippingInformation';

test('Initiate purchase for the first displayed item', async ({ page }) => {
  const url = process.env.URL;
  await page.goto(url);

  // Open shop, select two units of the items and add to shopping bag
  await page.click(shop.shopMenuItem);
  await page.click(shop.shopItem);
  const priceText = await page.locator(item.itemPrice).innerText();
  const priceNumber = parseFloat(priceText.replace("€", ""));
  await page.click(item.increaseNumberOfSelectedItems);
  await page.getByRole('button', { name: 'Add to bag' }).click();

  // Open shopping bag
  const subtotalText = await page.locator(shoppingBag.subtotalPrice).innerText();
  const subtotalNumber = parseFloat(subtotalText.replace(/[^\d.]/g, ""));
  expect(priceNumber * 2).toEqual(subtotalNumber);
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByRole('textbox', { name: 'Shipping destination' }).click();
  await page.getByRole('option', { name: 'Lithuania' }).click();
  await page.getByPlaceholder('Choose address').click();
  await page.getByText('Akmenės NORFA Daukanto paš').click();

  // Fill in shipping information
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.fill(shoppingBag.contactInformationEmail, shippingInformation.email);
  await page.fill(shoppingBag.contactInformationFullName, shippingInformation.fullName);
  await page.fill(shoppingBag.contactInformationPhoneNumber, shippingInformation.phoneNumber);
  await page.fill(shoppingBag.contactInformationComment, shippingInformation.comment);

  // Validate cost and place Order
  const shippingPriceText = await page.locator(shoppingBag.shippingPrice).innerText();
  const shippingPriceNumber = parseFloat(shippingPriceText.replace("€", ""));
  const totalPriceText = await page.locator(shoppingBag.totalPrice).innerText();
  const totalPriceNumber = parseFloat(totalPriceText.replace("€", ""));
  expect(((priceNumber * 2) + shippingPriceNumber)).toEqual(totalPriceNumber);
  await page.getByRole('button', { name: 'Continue' }).dblclick();
  await page.getByRole('button', { name: 'Place an order' }).click();
  await page.getByRole('button', { name: 'Got it' }).click();
});
