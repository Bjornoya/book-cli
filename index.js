#!/usr/bin/env node
import inquirer from 'inquirer'
import puppeteer from 'puppeteer'
import config from './config.js'
import { getBooksList, getCategoryName, getCategoryURL, getRandomBook } from './utils.js'

async function openInitialPage(url, headless) {
    const browser = await puppeteer.launch({ headless });
    const page = await browser.newPage();
    await page.goto(url);
    return { browser, page }
}

async function fetchCategories() {
    const { url, messages } = config;
    const { browser, page } = await openInitialPage(url.goodreads, true)
    const categories = await getCategoryName(page, messages.categoryName);
    await browser.close();
    return { categories }
}

async function fetchBooks(categories) {
    const { url, messages } = config;
    const { browser, page } = await openInitialPage(url.goodreads, true);
    const urls = await getCategoryURL(page, messages.categoryURL);
    const books = await getBooksList({ page, urls, categories }, messages.bookTitles);
    await browser.close();
    return { books }
}

async function clickItem(page, selector) {
    await page.waitForNavigation();
    await page.click(selector);
}

async function searchItem(page, selector, query) {
    const { delay } = config;
    await page.type(selector, query, { delay });
    await page.keyboard.press('Enter');
}

async function buyBook(bookName) {
    try {
        const { url } = config;
        const { page } = await openInitialPage(url.amazon, false);
        await page.select('#searchDropdownBox', 'search-alias=stripbooks-intl-ship');
        await searchItem(page, '#twotabsearchtextbox', bookName)
        await clickItem(page, '.a-size-mini > a');
        // await clickItem(page, '#add-to-cart-button');
        // await clickItem(page, '[name="proceedToRetailCheckout"]');
    }
     catch (e) {
         console.error(e)
     }
}



(async function() {
    const { type, name, message } = config.prompt;
    const { categories: choices } = await fetchCategories();
    const getCategory = await inquirer.prompt({
        type,
        name,
        message,
        choices
    })
    const { books } = await fetchBooks(choices);
    const selectedBook = await getRandomBook(books, getCategory[name]);
    await buyBook(selectedBook);
})()
