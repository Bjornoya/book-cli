export default {
    prompt: {
        type: 'list',
        name: 'category',
        message: 'Please select book category',
    },
    url: {
        goodreads: 'https://www.goodreads.com/choiceawards/best-books-2020',
        amazon: 'https://www.amazon.com/',
    },
    messages: {
        categoryURL: ['Fetching category links...', 'Cannot find any URLs!'],
        categoryName: ['Fetching category names...', 'Cannot find any category names!'],
        bookTitles: ['Fetching book titles...', 'Cannot find any books titles!'],
    },
    delay: 200,
}
