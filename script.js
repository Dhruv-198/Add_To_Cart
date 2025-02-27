// Book data
// Array of book objects containing id, title, price, image path, and category
const books = [
    { id: 1, title: "Atomic Habit", price: 15.99, image: "Images/Atomic-habit.jpg", category: "inspirational" },
    { id: 2, title: "Beyond", price: 12.99, image: "Images/beyond.jpg", category: "comic" },
    { id: 3, title: "Believe In Yourself", price: 14.99, image: "Images/believe-in-yourself.webp", category: "inspirational" },
    { id: 4, title: "Indian Business", price: 11.99, image: "Images/indian-business.webp", category: "business" },
    { id: 5, title: "Srimad Bhagavad Gita", price: 13.99, image: "Images/gita.webp", category: "spiritual" },
    { id: 6, title: "Shri Vishnu Puran", price: 13.99, image: "Images/vishnupuran.webp", category: "spiritual" },
    { id: 7, title: "Rigveda", price: 13.99, image: "Images/Rugved.jpg", category: "spiritual" },
    { id: 8, title: "Samaveda", price: 13.99, image: "Images/samved.jpg", category: "spiritual" },
    { id: 9, title: "Atharvaveda", price: 13.99, image: "Images/Atharved.jpg", category: "spiritual" },
    { id: 10, title: "Beware", price: 19.99, image: "Images/beware.webp", category: "comic" },
    { id: 11, title: "Yajurveda", price: 16.99, image: "Images/yajurved.jpg", category: "spiritual" },
    { id: 12, title: "The First 90 Day's", price: 17.99, image: "Images/The first 90 days.webp", category: "business" },
    { id: 13, title: "Shiv Puran", price: 17.99, image: "Images/Shivpuran.jpg", category: "spiritual" },
    { id: 14, title: "Captain Marvel", price: 17.99, image: "Images/captain-marvel.jpg", category: "comic" },
    { id: 15, title: "Business Marketing", price: 13.99, image: "Images/Business Marketing.jpg", category: "business" },
    { id: 16, title: "Wings Of Fire", price: 13.99, image: "Images/wings-of-fire-original-imah4ssxb4y9zmvg.webp", category: "inspirational" }
];

// Initialize empty cart array to store selected books
let cart = [];

// Filter books by category
function filterBooks(category) {
    // Get all category buttons
    let buttons = document.getElementsByClassName('category-btn');

    // Remove 'active' class from all buttons and add it to the selected category button
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
        if (buttons[i].getAttribute('data-category') === category) {
            buttons[i].classList.add('active');
        }
    }

    // Get all book items
    let bookItems = document.getElementsByClassName('book-item');

    // Show books of selected category and hide others
    for (let i = 0; i < bookItems.length; i++) {
        if (category === 'all' || bookItems[i].getAttribute('data-category') === category) {
            bookItems[i].style.display = 'block';  // Show matching books
        } else {
            bookItems[i].style.display = 'none';   // Hide non-matching books
        }
    }
}

// Add book to cart
function addToCart(bookId) {
    let book = null;
    // Find the book in books array by ID
    for (let i = 0; i < books.length; i++) {
        if (books[i].id === bookId) {
            book = books[i];
            break;
        }
    }

    let cartItem = null;
    // Check if book already exists in cart
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === bookId) {
            cartItem = cart[i];
            break;
        }
    }

    // If book exists in cart, increase quantity; otherwise add new item
    if (cartItem) {
        cartItem.quantity++;
    }
    else {
        cart.push({ ...book, quantity: 1 });  // Spread operator creates a copy with quantity
    }
    updateCart();  // Refresh cart display
}

// Handle immediate purchase
function buyNow(bookId) {
    let book = null;
    // Find the book by ID
    for (let i = 0; i < books.length; i++) {
        if (books[i].id === bookId) {
            book = books[i];
            break;
        }
    }

    let cartItem = null;
    // Check if book is in cart
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === bookId) {
            cartItem = cart[i];
            break;
        }
    }

    let quantity = 1;  // Default quantity for direct purchase

    // Use cart quantity if book is in cart
    if (cartItem) {
        quantity = cartItem.quantity;
    }

    // Calculate total and show purchase confirmation
    let totalValue = (book.price * quantity).toFixed(2);
    alert(`Proceeding to buy "${book.title}"\nQuantity: ${quantity}\nTotal Value: $${totalValue}`);
}

// Update cart display
function updateCart() {
    // Get DOM elements for cart display
    let cartItemsContainer = document.getElementById('cartItems');
    let cartCount = document.getElementById('cartCount');
    let totalItems = document.getElementById('totalItems');
    let totalPrice = document.getElementById('totalPrice');
    let template = document.getElementById('cartItemTemplate');

    // Remove existing cart items from display
    let existingItems = cartItemsContainer.getElementsByClassName('cart-item');
    while (existingItems.length > 0) {
        existingItems[0].remove();
    }

    let totalItemCount = 0;
    let totalPriceValue = 0;

    // Add each cart item to display
    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        totalItemCount += item.quantity;
        totalPriceValue += item.price * item.quantity;

        // Clone template and populate with item data
        let cartItem = template.content.cloneNode(true);
        let container = cartItem.querySelector('.cart-item');

        container.setAttribute('data-index', i);
        let img = container.querySelector('.cart-item-img');
        img.src = item.image;
        img.alt = item.title;
        container.querySelector('.cart-item-title').textContent = item.title;
        container.querySelector('.cart-item-price').textContent = `$${item.price.toFixed(2)}`;

        // Set up quantity input and event listener
        let quantityInput = container.querySelector('.cart-item-quantity');
        quantityInput.value = item.quantity;
        quantityInput.onchange = function () {
            updateQuantity(i, this.value);
        };

        // Set up delete button
        container.querySelector('.cart-item-delete').onclick = function () {
            removeFromCart(i);
        };

        // Set up buy now button
        container.querySelector('.cart-item-buy').onclick = function () {
            buyNow(item.id);
        };

        cartItemsContainer.appendChild(cartItem);
    }

    // Update cart summary
    cartCount.textContent = cart.length;
    totalItems.textContent = totalItemCount;
    totalPrice.textContent = totalPriceValue.toFixed(2);
}

// Update item quantity in cart
function updateQuantity(index, newQuantity) {
    if (newQuantity < 1)
        newQuantity = 1;  // Ensure minimum quantity of 1
    cart[index].quantity = parseInt(newQuantity);
    updateCart();  // Refresh cart display
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);  // Remove item at specified index
    updateCart();  // Refresh cart display
}

// Initialize page on load
window.onload = function () {
    filterBooks('all');  // Show all books by default
};