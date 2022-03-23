import { createSpinner } from "nanospinner";

async function withSuspense(callback, message) {
    try {
        const spinner = await createSpinner(message[0]).start();
        const result = await callback();
        if (result.length) {
            spinner.success();
            return result
        } else {
            spinner.error({ text: message[1], mark: ':(' });
            process.exit(1)
        }
    }
    catch(e) {
        console.error(e)
    }
}

function getBookTitle(page, messages) {
    return withSuspense(() => page.$$eval('.pollAnswer__bookLink > img', ((elements) => elements.map((el) => el.alt))), messages);
}

export function getCategoryURL(page, messages) {
    return withSuspense(() => page.$$eval('.category > a', ((elements) => elements.map((el) => el.href))), messages);
}

export function getCategoryName(page, messages) {
    return withSuspense(() => page.$$eval('.category__copy', ((elements) => elements.map((el) => el.textContent.trim()))), messages);
}

export async function getBooksList(params, messages) {
    const { page, urls, categories } = params;
    const books = {};

    for (let i = 0; i < urls.length - 1; i++) {
        await page.goto(urls[i]);
        books[categories[i]] = await getBookTitle(page, messages);
    }

    return books
}

export function getRandomBook(books, category) {
    const list = books[category];
    const index = Math.floor(Math.random() * (list.length - 1));
    return list[index]
}
